'use strict';
// global variables
const lights = {};
const gui = new dat.GUI();
main();
function main(){
    // renderer
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.physicallyCorrecLights = true;

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('gray');

    // camera
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.set(0,-7,10);
    // orbitControl for camera
    const controls = new THREE.OrbitControls(camera,canvas);
    controls.target.set(0,5,0);
    controls.update();
    
    // set lights
    // light default setting
    const color = 0xFFFFFF;
    const intensity = 1
    const positions = [0,0,4];
    // light position indicator
    {
        const params = [.3,.1,32,32,1,1];
        const geometry = new THREE.TorusKnotBufferGeometry(...params);
        const material = new THREE.MeshPhongMaterial({
            color: 'gold',
            emissive: 'darkred',
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(...positions);
        scene.add(mesh);
        lights.indicator = mesh;
    }
    // DirectionalLight( color : Integer, intensity : Float )
    {
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(...positions);
        
        lights.DirectionalLight = light;
    }
    // AmbientLight( color : Integer, intensity : Float )
    {
        const light = new THREE.AmbientLight(color,intensity);
        light.position.set(...positions);

        lights.AmbientLight = light;
    }
    // HemisphereLight( skyColor : Integer, groundColor : Integer, intensity : Float )
    {   
        const skyColor = color;
        const groundColor = 'brown';
        const light = new THREE.HemisphereLight(skyColor,groundColor,intensity);
        light.position.set(...positions);

        lights.HemisphereLight = light;
    }
    // PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
    {   
        const distance = 0;
        const decay = 2;
        const light = new THREE.PointLight(color,intensity,distance,decay);
        light.position.set(...positions);

        lights.PointLight = light;
    }
    // SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )
    {
        const distance = 0;
        const angle = Math.PI/4;
        const penumbra = 0;
        const decay = 2;
        const light = new THREE.SpotLight(color,intensity,distance,angle,penumbra,decay);
        light.position.set(...positions);

        lights.SpotLight = light;
    }

    // dat.gui for lights
    {
        // defult setting
        const defaultType = 'PointLight';
        lights.currentLight = lights[defaultType];
        scene.add(lights.currentLight);

        class Options{
            constructor(){
                this._light = defaultType;
                this._intensity = intensity;
                this._color = [255,255,255];
                this._lightPositionX = positions[0];
                this._lightPositionY = positions[1];
                this._lightPositionZ = positions[2];
            }
            set lightPositionX(num){
                this._lightPositionX = num;
                lights.currentLight.position.set(
                    this._lightPositionX,
                    this._lightPositionY,
                    this._lightPositionZ
                );
                lights.indicator.position.set(
                    this._lightPositionX,
                    this._lightPositionY,
                    this._lightPositionZ
                );
            }
            get lightPositionX(){
                return this._lightPositionX;
            }
            set lightPositionY(num){
                this._lightPositionY = num;
                lights.currentLight.position.set(
                    this._lightPositionX,
                    this._lightPositionY,
                    this._lightPositionZ
                );
                lights.indicator.position.set(
                    this._lightPositionX,
                    this._lightPositionY,
                    this._lightPositionZ
                );
            }
            get lightPositionY(){
                return this._lightPositionY;
            }
            set lightPositionZ(num){
                this._lightPositionZ = num;
                lights.currentLight.position.set(
                    this._lightPositionX,
                    this._lightPositionY,
                    this._lightPositionZ
                );
                lights.indicator.position.set(
                    this._lightPositionX,
                    this._lightPositionY,
                    this._lightPositionZ
                );
            }
            get lightPositionZ(){
                return this._lightPositionZ;
            }
            set light(string){
                this._light = string;
                scene.remove(lights.currentLight);
                scene.add(lights[string]);
                lights.currentLight = lights[string];
            }
            get light(){
                return this._light;
            }
            set intensity(num){
                this._intensity  = num;
                lights.currentLight.intensity = num;
            }
            get intensity(){
                return this._intensity;
            }
            set color(c){
                this._color = c;
                lights.currentLight.color.setRGB(c[0]/256,c[1]/256,c[2]/256);  
            }
            get color(){
                return this._color;
            }
        }
        const options = new Options();
        const f1 = gui.addFolder('light options');
        f1.add(options,'light',['DirectionalLight','AmbientLight','HemisphereLight','PointLight','SpotLight']);
        f1.add(options,'intensity',0,2);
        f1.addColor(options,'color');
        const bound = 5;
        f1.add(options,'lightPositionX',-bound,bound);
        f1.add(options,'lightPositionY',-bound,bound);
        f1.add(options,'lightPositionZ',1,4*bound-1);
    }

    // global storage for 3D meshes
    const meshes = {};

    // plane
    {
        // geometry
        const planeSize = 16;
        const geometry = new THREE.PlaneBufferGeometry(planeSize,planeSize);

        // material - texture
        const loader = new THREE.TextureLoader();
        const url = '../img/checker.png';
        const texture = loader.load(url);

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.repeat.set(planeSize/2,planeSize/2);

        const material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry,material);
        
        scene.add(mesh);
        meshes.plane = mesh;

        // walls
        // front wall
        const frontMesh = new THREE.Mesh(geometry,material);
        frontMesh.rotation.x = Math.PI/2;
        frontMesh.position.y = planeSize/2;
        frontMesh.position.z = planeSize/2;

        scene.add(frontMesh);
        meshes.frontWall = frontMesh;

        // left side wall
        const leftMesh = new THREE.Mesh(geometry,material);
        leftMesh.rotation.z = Math.PI/2;
        leftMesh.rotation.y = Math.PI/2;
        leftMesh.position.x = -planeSize/2;
        leftMesh.position.z = planeSize/2;

        scene.add(leftMesh);
        meshes.leftWall = leftMesh;

        // right side wall
        const rightMesh = new THREE.Mesh(geometry,material);
        rightMesh.rotation.z = Math.PI/2;
        rightMesh.rotation.y = Math.PI/2;
        rightMesh.position.x = planeSize/2;
        rightMesh.position.z = planeSize/2;

        scene.add(rightMesh);
        meshes.leftWall = rightMesh;
    }
    
    // sphere target
    const targetPositions = [-2.5,2.5,2.5];
    {
        const params = [1,.4,64,32,1,2];
        const geometry = new THREE.TorusKnotBufferGeometry(...params);
        const material = new THREE.MeshPhongMaterial({

        });
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(...targetPositions);

        scene.add(mesh);
        meshes.target = mesh;

        lights.SpotLight.target = mesh;
        lights.DirectionalLight.target = mesh;
    }
    // dat.GUI for sphere target
    {
        class Options{
            constructor(){
                this._positionX = targetPositions[0];
                this._positionY = targetPositions[1];
                this._positionZ = targetPositions[2];
            }
            set positionX(num){
                this._positionX = num;
                meshes.target.position.set(
                    this._positionX,
                    this._positionY,
                    this._positionZ
                )
            }
            get positionX(){
                return this._positionX;
            }
            set positionY(num){
                this._positionY = num;
                meshes.target.position.set(
                    this._positionX,
                    this._positionY,
                    this._positionZ
                )
            }
            get positionY(){
                return this._positionY;
            }
            set positionZ(num){
                this._positionZ = num;
                meshes.target.position.set(
                    this._positionX,
                    this._positionY,
                    this._positionZ
                )
            }
            get positionZ(){
                return this._positionZ;
            }
        }
        const options = new Options();
        const bound = 5;
        const folder = gui.addFolder('target options');
        folder.add(options,'positionX',-bound,bound);
        folder.add(options,'positionY',-bound,bound);
        folder.add(options,'positionZ',1,4*bound-1);
    }

    render();
    function render(t){
        t *= 0.001;

        lights.indicator.rotation.x = t;
        lights.indicator.rotation.y = t;

        meshes.target.rotation.x = t;
        meshes.target.rotation.z = t;
        
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