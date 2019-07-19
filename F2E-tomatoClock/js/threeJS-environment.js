'use strict';

const gui = new dat.GUI();

main();
function main(){
    // renderer
    const canvas = document.querySelector('#js-clock');
    const renderer = new THREE.WebGLRenderer({canvas});

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightgray');

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
    scene.add(light);

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

    render();
    function render(t){
        t *= 0.001;
        
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
    const canvas = renderer.domElement;
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