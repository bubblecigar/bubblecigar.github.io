'use strict';

const gui = new dat.GUI();

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
    const light = new THREE.AmbientLight(color,intensity);
    light.position.set(-1,2,4);
    scene.add(light);

    // set meshed
    const meshes = {};

    let rt;
    let rtScene;
    let rtCamera;
    let rtCube;
    // renderTarget
    {
        // renderTarget
        const width = 512;
        const height = 512;
        const renderTarget = new THREE.WebGLRenderTarget(width,height);

        // camera
        const fov = 75; //deg
        const aspect = width/height;
        const near = .1;
        const far = 10;
        const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
        camera.position.z = 5;
        // dat gui for camera
        {
            class Options{
                constructor(){
                    this._fov = fov;
                    this._aspect = aspect;
                    this._near = near;
                    this._far = far;
                }
                get far(){
                    return this._far;
                }
                set far(num){
                    this._far = num;
                    camera.far = num;
                    camera.updateProjectionMatrix();
                }
                get near(){
                    return this._near;
                }
                set near(num){
                    this._near = num;
                    camera.near = num;
                    camera.updateProjectionMatrix();
                }
                get aspect(){
                    return this._aspect;
                }
                set aspect(ratio){
                    this._aspect = ratio;
                    camera.aspect = ratio;
                    camera.updateProjectionMatrix();
                }
                get fov(){
                    return this._fov
                }
                set fov(degree){
                    this._fov = degree;
                    camera.fov = degree;
                    camera.updateProjectionMatrix();
                }
            }

            const options = new Options();
            gui.add(options,'fov',1,180);
            gui.add(options,'aspect',.5,2);
            gui.add(options,'near',.1,10);
            gui.add(options,'far',.1,100);
        }

        const light = new THREE.DirectionalLight();
        light.position.set(0,0,5);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('red');

        // adding objects in renderTarget
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({});
        const mesh = new THREE.Mesh(geometry,material);

        // linking
        scene.add(mesh);
        scene.add(light);
        rt = renderTarget;
        rtCamera = camera;
        rtScene = scene;
        rtCube = mesh;
    } 


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
            map: rt.texture,
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

        rtCube.rotation.x = t;
        rtCube.rotation.y = t;
        
        // adjusting the camera according to canvas client size
        const needResize = resizeRendererToDisplaySize(renderer);
        if(needResize){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }        

        renderer.setRenderTarget(rt);
        renderer.render(rtScene,rtCamera);
        renderer.setRenderTarget(null);
        
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