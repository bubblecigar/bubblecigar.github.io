'use strict';
main();

function main(){
    // renderer
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({canvas});

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightgray');

    // camera
    const fov = 60;
    const aspect = 2;
    const near = 4;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.up.set(0,0,1);
    camera.position.z = 5;

    // set light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color,intensity);
    light.position.set(-1,2,4);
    scene.add(light);

    // modelling mesh
    const params = [.4,.2,128,64,2,4];
    const geometry = new THREE.TorusKnotGeometry(...params);
    const spreadDst = 1.8;
    const meshes = [];

    // helper function
    function createMesh(material, x=0, y=0){
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.x = x * spreadDst;
        mesh.position.y = y * spreadDst;
        scene.add(mesh);
        meshes.push(mesh);
        return mesh;
    }

    // MeshBasicMaterial( parameters : Object )
    {
        const x = -1;
        const y = 1;
        const material = new THREE.MeshBasicMaterial({
            color: 'gray'
        });
        createMesh(material,x,y);
    }

    // MeshDepthMaterial
    {
        const x = 0;
        const y = 1;
        const material = new THREE.MeshDepthMaterial();
        createMesh(material,x,y);
    }

    // MeshLambertMaterial
    {
        const x = -1;
        const y = 0;
        const material = new THREE.MeshLambertMaterial({
            
        });
        createMesh(material,x,y);
    }

    // MeshNormalMaterial
    {
        const x = 1;
        const y = 1;
        const material = new THREE.MeshNormalMaterial({

        });
        createMesh(material,x,y);
    }

    // MeshPhongMaterial
    {
        const x = -1;
        const y = -1;
        const material = new THREE.MeshPhongMaterial({

        });
        createMesh(material,x,y);
    }

    // MeshStandardMaterial
    {
        const x = 0;
        const y = -1;
        const material = new THREE.MeshStandardMaterial({
            color: 'white',
            emissive: '',
            metalness: .3,
            roughness: 0.3
        });
        createMesh(material,x,y);
    }

    // MeshPhysicalMaterial
    {
        const x = 1;
        const y = -1;
        const material = new THREE.MeshPhysicalMaterial({
            color: 'white',
            emissive: '',
            metalness: .3,
            roughness: .3,
            clearCoat: 1,
            clearCoatRoughness: 1
        });
        createMesh(material,x,y);
    }

    // MeshToonMaterial
    {
        const x = 0;
        const y = 0;
        const material = new THREE.MeshToonMaterial({
            color: 'white',
        });
        createMesh(material,x,y);
    }

    // LineDashedMaterial
    {
        const x = 1;
        const y = 0;
        const material = new THREE.LineDashedMaterial({
            color: 'blue',
            linewidth: 10,
            dashSize: .1,
            gapSize: .1
        });

        const geometry = new THREE.BoxGeometry();
        const _geometry = new THREE.WireframeGeometry(geometry);
        
        const mesh = new THREE.Line(_geometry,material);
        mesh.position.x = x * 1.8;
        mesh.position.y = y * 1.8;

        scene.add(mesh);
        meshes.push(mesh);
    }

    render();
    function render(t){
        
        t *= 0.001;
        

        
        meshes.forEach((mesh,index)=>{
            mesh.rotation.x = t;
            mesh.rotation.y = t;
            mesh.rotation.z = t;
        })

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