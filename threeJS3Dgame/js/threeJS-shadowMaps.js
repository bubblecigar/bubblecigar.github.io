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
    scene.background = new THREE.Color('');

    // camera
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.z = 20;
    camera.position.y = -20;
    // camera controls
    const controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.target.set(0,5,0);
    controls.update();

    // set light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light1 = new THREE.PointLight(color,intensity);
    const initPosition = {
        x: -5,
        y: 5,
        z: 5
    }
    light1.position.set(initPosition.x,initPosition.y,initPosition.z);
    const light2 = new THREE.AmbientLight('white',.15);
    scene.add(light1);
    scene.add(light2);
    // dat gui for light1
    {
        const bindedLight = light1;
        function updatePosition(x,y,z){
            bindedLight.position.set(x,y,z);
        }
        class Options{
            constructor(){
                this._x = initPosition.x;
                this._y = initPosition.y;
                this._z = initPosition.z;
            }
            set x(num){
                this._x = num;
                updatePosition(this._x,this._y,this._z);
            }
            set y(num){
                this._y = num;
                updatePosition(this._x,this._y,this._z);
            }
            set z(num){
                this._z = num;
                updatePosition(this._x,this._y,this._z);
            }
            get x(){
                return this._x
            }
            get y(){
                return this._y
            }
            get z(){
                return this._z
            }
        }
        const options = new Options();
        const bound = 10;
        gui.add(options,'x',-bound,bound);
        gui.add(options,'y',-bound,bound);
        gui.add(options,'z',1,2*bound);
        gui.remember(options);
    }

    // global storage
    const objects = {};
    // add ground
    {
        // geometry
        const width = 24;
        const height = 24;
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
        objects.ground = mesh;
    }
    // add cube
    {   
        // geometry
        const params = [2,2.5,3];
        const geometry = new THREE.BoxGeometry(...params);

        // material
        const material = new THREE.MeshPhongMaterial({
            color: 'gold',
            emissive: 'navy'
        });

        // mesh
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(6,0,4);

        // linking
        scene.add(mesh);
        objects.cube = mesh;
    }
    // add sphere
    {   
        // geometry
        const params = [1.5,64,64];
        const geometry = new THREE.SphereGeometry(...params);

        // material
        const material = new THREE.MeshPhongMaterial({
            color: 'gold',
            emissive: 'navy'
        });

        // mesh
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(0,0,4);

        // linking
        scene.add(mesh);
        objects.sphere = mesh;
    } 
    // set shadow
    renderer.shadowMap.enabled = true;
    light1.castShadow = true;
    objects.ground.receiveShadow = true;
    objects.cube.castShadow = true;
    objects.cube.receiveShadow = true;
    objects.sphere.castShadow = true;
    objects.sphere.receiveShadow = true;

    render();
    function render(t){
        t *= 0.001;
        
        objects.cube.rotation.x = t;
        objects.cube.rotation.y = t;

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