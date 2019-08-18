'use strict';
let glo;
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
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.z = 10;

    // set light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color,intensity);
    light.position.set(-1,2,4);
    scene.add(light);

    const objects = {};

    // texture cube
    {
        // geometry 
        const geometry = new THREE.PlaneGeometry(7,7);

        // multiple materials
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../img/test2.jpg');
        texture.magFilter = THREE.LinearFilter;
        // texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearFilter;

        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;

        const material = new THREE.MeshBasicMaterial({
            map: texture
        })

        // mesh
        const mesh = new THREE.Mesh(geometry,material);

        scene.add(mesh);
        objects.plane = mesh;

        // gui params:
        class Params{
            constructor(){
                this._scaleX = 1;
                this._scaleY = 1;
                this._wrapS = 'default';
                this._wrapT = 'default';
                this._repeatS = 1;
                this._repeatT = 1;
                this._offsetX = 0;
                this._offsetY = 0;
                this._centerX = 0;
                this._centerY = 0;
                this._rotationDeg = 0;
            }
            get scaleX(){
                return this._scaleX;
            }
            set scaleX(input){
                this._scaleX = input;
                mesh.scale.set(this._scaleX,this._scaleY,1);
            }
            get scaleY(){
                return this._scaleY;
            }
            set scaleY(input){
                this._scaleY = input;
                mesh.scale.set(this._scaleX,this._scaleY,1);
            }
            get wrapS(){
                return this._wrapS;
            }
            set wrapS(input){
                this._wrapS = input;
                texture.wrapS = THREE[input];
                texture.needsUpdate = true;
            }
            get wrapT(){
                return this._wrapT;
            }
            set wrapT(input){
                this._wrapT = input;
                texture.wrapT = THREE[input];
                texture.needsUpdate = true;
            }
            get repeatS(){
                return this._repeatS;
            }
            set repeatS(input){
                this._repeatS = input;
                texture.repeat.set(this._repeatS,this._repeatT);
            }
            get repeatT(){
                return this._repeatT;
            }
            set repeatT(input){
                this._repeatT = input;
                texture.repeat.set(this._repeatS,this._repeatT);
            }
            get offsetX(){
                return this._offsetX;
            }
            set offsetX(input){
                this._offsetX = input;
                texture.offset.set(this._offsetX,this._offsetY);
            }
            get offsetY(){
                return this._offsetX;
            }
            set offsetY(input){
                this._offsetY = input;
                texture.offset.set(this._offsetX,this._offsetY);
            }
            get centerX(){
                return this._centerX;
            }
            set centerX(input){
                this._centerX = input;
                texture.center.set(this._centerX,this._centerY);
            }
            get centerY(){
                return this._centerY;
            }
            set centerY(input){
                this._centerY = input;
                texture.center.set(this._centerX,this._centerY);
            }
            get rotationDeg(){
                return this._rotationDeg;
            }
            set rotationDeg(input){
                this._rotationDeg = input;
                texture.rotation = this._rotationDeg*Math.PI/180;
            }
        };
        const params = new Params();
        const gui = new dat.GUI();
        gui.remember(params);
        const f1 = gui.addFolder('plane size');
        f1.add(params,'scaleX',1,200);
        f1.add(params,'scaleY',1,200);
        const f2 = gui.addFolder('repeat options');
        f2.add(params,'wrapS',['ClampToEdgeWrapping','RepeatWrapping','MirroredRepeatWrapping']);
        f2.add(params,'wrapT',['ClampToEdgeWrapping','RepeatWrapping','MirroredRepeatWrapping']);
        const f3 = gui.addFolder('repeat times');
        f3.add(params,'repeatS',1,5);
        f3.add(params,'repeatT',1,5);
        const f4 = gui.addFolder('texture position');
        f4.add(params,'offsetX',-1,1);
        f4.add(params,'offsetY',-1,1);
        f4.add(params,'centerX',0,1);
        f4.add(params,'centerY',0,1);
        f4.add(params,'rotationDeg',0,360);
    }

    render();
    function render(t){
        t *= 0.001;
        
        Object.keys(objects).forEach((key)=>{
            // objects[key].rotation.x = t;
            // objects[key].rotation.y = t;
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