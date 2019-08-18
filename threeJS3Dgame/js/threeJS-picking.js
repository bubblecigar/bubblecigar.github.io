'use strict';

const gui = new dat.GUI();

main();
function main(){
    // renderer
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({canvas});

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightgray');

    // camera
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.z = 30;
    scene.add(camera);
    // camera controls
    const controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.target.set(0,5,0);
    controls.update();

    // set light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color,intensity);
    light.position.set(0,0,0);
    const ambiLight = new THREE.AmbientLight(color,.5);
    camera.add(light);
    scene.add(ambiLight);
 
    // cubes' meshes
    const cubes = [];
    function addCube(size=1,spread=10)
    {
        // geometry
        const geometry = new THREE.BoxGeometry(size,size,size);
        // material
        const material = new THREE.MeshPhongMaterial({
            color: rollColor()
        })
        // mesh
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(...rollPosition(spread));
        mesh.lookAt(0,0,0);
        // linking
        scene.add(mesh);
        cubes.push(mesh);
    }
    function rollColor(){
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        const color =  new THREE.Color();
        color.setRGB(r,g,b);
        return color;
    }
    function rollPosition(spread = 1){
        const x = (Math.random()-.5) * spread;
        const y = (Math.random()-.5) * spread;
        const z = (Math.random()-.5) * spread;
        return [x,y,z];
    }
    const cubeNum = 100;
    const spread = 23;
    for(let i=0;i<cubeNum;i++){
        const cubeSize = .5 + Math.random()*3;
        addCube(cubeSize,spread);
    }
    cubes.forEach(el=>{
        el.lookAt(0,0,0);
    });

    // picking
    const pickingTools = {};
    {
        // update normalized mouse coordinate
        const mouseCoord = new THREE.Vector2(-10000,-10000);
        canvas.addEventListener('mousemove',(e)=>{
            let x = e.clientX / window.innerWidth;
                x = x * 2 - 1;
            let y = e.clientY / window.innerHeight;
                y = -(y * 2 - 1);
            mouseCoord.x = x;
            mouseCoord.y = y;
        },false);
        // raycaster
        const raycaster = new THREE.Raycaster();

        let picked;
        function pick(t){
            // clear previous mark
            if(picked){
                picked.material.emissive.setRGB(0,0,0);
            }
            picked = null;

            // pick new object
            raycaster.setFromCamera(mouseCoord,camera);
            const intersects = raycaster.intersectObjects(scene.children);
            if(intersects.length>0){
                picked = intersects[0].object;                
                // mark new picked object
                const y = Math.abs(Math.sin(t*10))/2;
                picked.material.emissive.setRGB(y,y,y/4);
            }
        }
        pickingTools.pick = pick;
    }
    
    

    render();
    function render(t){
        t *= 0.001;

        cubes.forEach(el=>{
            el.rotation.z = t;
        })
        
        pickingTools.pick(t);
        
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