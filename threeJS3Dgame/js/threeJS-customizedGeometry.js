'use strict';

const gui = new dat.GUI();
let glo;

main();
function main(){
    // renderer
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({canvas});

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('gray');

    // camera
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.z = 20;
    // camera controls
    const controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.target.set(0,5,0);
    controls.update();

    // set light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color,intensity);
    light.position.set(-1,2,4);

    const amlight = new THREE.AmbientLight(color,.5);
    
    scene.add(light);
    scene.add(amlight);

    // set meshed
    const meshes = {};

    // set ground
    {
        // geometry
        const width = 20;
        const height = 20;
        const geometry = new THREE.PlaneBufferGeometry(width,height);
        
        // material - texture
        const loader = new THREE.TextureLoader();
        const url = '../img/checker.png';
        const texture = loader.load(url);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(width/2,height/2);
        texture.magFilter = THREE.NearestFilter;

        // mesh
        const mesh = new THREE.Mesh(geometry,material);

        // linking
        scene.add(mesh);
        meshes.ground = mesh;
    }

    // customed mesh / geometry
    function addFlag(
        width = 10,
        height = 10,
        x_cuts = 10,
        y_cuts = 10,
        url = '../img/test3.jpg'
    )
    {
        const tileWidth = width/x_cuts;
        const tileHeight = height/y_cuts;
        const geometry = new THREE.Geometry();
        
        function roll(){
            return Math.random()*1;
        }

        // create vertices from bl to tr
        for(let x=0;x<=x_cuts;x++){
            for(let y=0;y<=y_cuts;y++){
                // indices of vertices: 
                // bl: (x)*(y_cuts+1)   + (y)
                // br: (x+1)*(y_cuts+1) + (y)
                // tr: (x+1)*(y_cuts+1) + (y+1)
                // tl: (x)*(y_cuts+1)   + (y+1)
                geometry.vertices.push(
                    new THREE.Vector3(
                        x*tileWidth, y*tileHeight, 0
                    )
                );
            }
        }
        // combine vertices to create faces
        // pin UV coords on the faces
        for(let x=0;x<x_cuts;x++){
            for(let y=0;y<y_cuts;y++){
                geometry.faces.push(
                    // br triangle
                    new THREE.Face3(
                        x*(y_cuts+1) + y,           // bl
                        (x+1)*(y_cuts+1) + y,       // br
                        (x+1)*(y_cuts+1) + (y+1),   // tr
                    ),
                    // tl triangle
                    new THREE.Face3(
                        x*(y_cuts+1) + y,           // bl
                        (x+1)*(y_cuts+1) + (y+1),   // tr
                        (x)*(y_cuts+1) + (y+1),     // tl
                    ),
                )
                // UV coords
                // bl:  x*1/x_cuts     | y*1/y_cuts
                // br:  (x+1)*1/x_cuts | y*1/y_cuts
                // tl:  x*1/x_cuts     | (y+1)*1/y_cuts
                // tr   (x+1)*1/x_cuts | (y+1)*1/y_cuts
                geometry.faceVertexUvs[0].push(
                    [
                        // bl
                        new THREE.Vector2(x*1/x_cuts, y*1/y_cuts),
                        // br
                        new THREE.Vector2((x+1)*1/x_cuts, y*1/y_cuts),
                        // tr
                        new THREE.Vector2((x+1)*1/x_cuts, (y+1)*1/y_cuts), 
                    ],
                    [
                        // bl
                        new THREE.Vector2(x*1/x_cuts, y*1/y_cuts),
                        // tr
                        new THREE.Vector2((x+1)*1/x_cuts, (y+1)*1/y_cuts),
                        // tl
                        new THREE.Vector2((x)*1/x_cuts, (y+1)*1/y_cuts), 
                    ]
                )
            }
        }
        // center the geometry
        geometry.translate(-width/2,-height/2,0);

        // geometry.computeFaceNormals();
        geometry.computeVertexNormals();


        const loader = new THREE.TextureLoader();
        // const url = '../img/test2.jpg';
        const texture = loader.load(url);

        const material = new THREE.MeshPhongMaterial({
            map: texture,
            // color: 'red',
            // emissive: 'navy',
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry,material);

        scene.add(mesh);
        meshes.flag = {
            mesh : mesh,
            vertexCoord: function(index){
                const x = Math.floor(index/(1+y_cuts));
                const y = index-x*(1+y_cuts);
                return {
                    x: x/x_cuts,
                    y: y/y_cuts
                }
            }
        }
    }
    addFlag(10,10,100,100);
    meshes.flag.mesh.position.set(0,5,2);
    render();
    function render(t){
        t *= 0.001;

        meshes.flag.mesh.rotation.z = t/4;
        const ar = meshes.flag.mesh.geometry.vertices;
        const fn = meshes.flag.vertexCoord;
        ar.forEach((el,i) => {
            const xy = fn(i);
            el.z = (Math.sin(xy.x*4*Math.PI + t))*.5 
                + (Math.sin(xy.y*4*Math.PI + t))*.5;
        });
        meshes.flag.mesh.geometry.verticesNeedUpdate = true;
        
        // adjusting the camera according to canvas client size
        const needResize = resizeRendererToDisplaySize(renderer);
        if(needResize){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }        

        renderer.render(scene,camera);

        window.requestAnimationFrame(render);
    }
}

function resizeRendererToDisplaySize(renderer){
    //const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize =
        width !== canvas.width || 
        height !== canvas.height;
    if (needResize){
        renderer.setSize(width,height,false);
    }
    return true
}