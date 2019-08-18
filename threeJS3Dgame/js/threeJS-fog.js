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
    camera.position.set(0,-20,20);
    // camera controls
    const controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.target.set(0,5,0);
    controls.update();

    // set light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color,intensity);
    light.position.set(-1,2,40);
    scene.add(light);

    // set linear fog
    {
        const color = 'white';
        const near = 20;
        const far = 30;
        const linearFog = new THREE.Fog(color,near,far);

        // linking
        scene.fog = linearFog;

        // dat.GUI for fog
        {
            class Options{
                constructor(){
                    this._near = near;
                    this._far = far;
                    this._color = [255,255,255];
                    this._linearFog = true;
                }
                get linearFog(){
                    return this._linearFog;
                }
                set linearFog(bool){
                    this._linearFog = bool;
                    bool ? scene.fog = linearFog : scene.fog = null;
                }
                get color(){
                    return this._color;
                }
                set color(cArray){
                    this._color = [...cArray];
                    scene.fog.color.setRGB(...this._color.map(el=>el/255));
                    scene.background.setRGB(...this._color.map(el=>el/255));

                }
                get near(){
                    return this._near;
                }
                set near(num){
                    this._near = num;
                    scene.fog.near = this._near;
                }
                get far(){
                    return this._far;
                }
                set far(num){
                    this._far = num;
                    scene.fog.far = this._far;
                }
            }
            const options = new Options();
            const folder = gui.addFolder('linear fog');
            folder.add(options,'linearFog');
            folder.add(options,'near',.1,50);
            folder.add(options,'far',10,100);
            folder.addColor(options,'color');
        }
    }
    // set exp fog
    {
        const color = 'white';
        const density = 0.0001;
        const expFog = new THREE.FogExp2(color,density);

        // dat.GUI for fog
        {
            class Options{
                constructor(){
                    this._density = density;
                    this._color = [255,255,255];
                    this._expFog = false;
                }
                get density(){
                    return this._density;
                }
                set density(num){
                    this._density = num;
                    scene.fog.density = num*density;
                }
                get expFog(){
                    return this._expFog;
                }
                set expFog(bool){
                    this._expFog = bool;
                    bool ? scene.fog = expFog : scene.fog = null;
                }
                get color(){
                    return this._color;
                }
                set color(cArray){
                    this._color = [...cArray];
                    scene.fog.color.setRGB(...this._color.map(el=>el/255));
                    scene.background.setRGB(...this._color.map(el=>el/255));

                }
                get near(){
                    return this._near;
                }
                set near(num){
                    this._near = num;
                    scene.fog.near = this._near;
                }
                get far(){
                    return this._far;
                }
                set far(num){
                    this._far = num;
                    scene.fog.far = this._far;
                }
            }
            const options = new Options();
            const folder = gui.addFolder('exponential fog');
            folder.add(options,'expFog');
            folder.add(options,'density',1,1000);
            folder.addColor(options,'color');
        }
    }

    // set meshes
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

    // cubes storage
    const cubes = [];
    for(let i=0; i< 3; i++){
        for(let j=0; j<3; j++){
            const x = (i-1)*6;
            const y = (j-1)*6;
            const z = 4;
            addCube(x,y,z);
        }
    }
    cubes.forEach((el,i)=>{
        if(i%2===1){
            el.material.fog = false;
        }
    })
    function addCube(x,y,z)
    {
        // geometry
        const params = [3,3,3];
        const geometry = new THREE.BoxGeometry(...params);

        // material
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        const material = new THREE.MeshPhongMaterial({});
        material.color.setRGB(r,g,b);

        // mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x,y,z);

        // linking
        scene.add(mesh);
        cubes.push(mesh);
    }

    render();
    function render(t){
        t *= 0.001;

        cubes.forEach((el,i)=>{
            el.rotation.x = t;
            el.rotation.y = t;
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