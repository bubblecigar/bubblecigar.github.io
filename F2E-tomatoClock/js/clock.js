'use strict'


const clock = {
    stamps: [Date.now(),Date.now()],
    stamp: function(){
        this.stamps.push(Date.now());
    },
    getStampsInterval: function(i1,i2){
        const l = this.stamps.length;
        const index1 = i1 || l - 2;
        const index2 = i2 || l - 1;
        const stamps1 = this.stamps[index1];
        const stamps2 = this.stamps[index2];
        return stamps2 - stamps1;
    },
    getCurrentFromStamp: function(i){
        const l = this.stamps.length;
        const index = i || l - 1;
        const stamp = this.stamps[index];
        return Date.now() - stamp;
    },
    resetStamps: function(){
        this.stamps = [Date.now(),Date.now()];
    },
    state: {
        entry: false,
        exit: false,
        on: false,
        finished: false
    },
    start: function(){
        this.state.entry = true;
        this.state.exit = false;
        this.state.on = true;
        this.resetStamps();
    },
    discard: function(){
        this.state.entry = false;
        this.state.on = false;
        this.state.exit = true;
        this.resetStamps();
    }
}

const timeStart = document.querySelector('#time-start');
timeStart.addEventListener('click',(e)=>{
    clock.start();
    timeStart.classList.toggle('none');
    timeDiscard.classList.toggle('none');
});
const timeDiscard = document.querySelector('#time-discard');
timeDiscard.addEventListener('click',(e)=>{
    clock.discard();
    timeStart.classList.toggle('none');
    timeDiscard.classList.toggle('none');
    document.querySelector('.panel-wrapper').classList.toggle('scroll-up');
    document.querySelector('#panel-time').classList.toggle('scroll-down');
})


// 3D modeling
main();
function main(){
    // renderer
    const canvas = document.querySelector('#js-clock');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.shadowMap.enabled = true;

    // scene
    const scene = new THREE.Scene();
    const backgroundColor = new THREE.Color();
    const backgroundIntensity = .85;
    backgroundColor.setRGB(backgroundIntensity,backgroundIntensity,backgroundIntensity);
    scene.background = new THREE.Color(backgroundColor);

    // fog
    {
        const color = backgroundColor;
        const visibleRange = 100;
        const invisibleRange = 200;
        const linearFog = new THREE.Fog(color,visibleRange,visibleRange+invisibleRange);
        scene.fog = linearFog;
    }

    // camera
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    scene.add(camera);
    camera.position.set(0,300,0);
    camera.lookAt(0,0,0);
    // camera controls
    const controls = new THREE.OrbitControls(camera,renderer.domElement);
    controls.target.set(0,20,0);
    controls.update();

    // set light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color,intensity);
    light.position.set(-40,50,-40);
    light.castShadow = true;
    const ambLight = new THREE.AmbientLight(color,.2);
    // scene.add(light);
    // scene.add(ambLight);

    // light shadow camera
    {
        const cameraWidth = 50;
        const cameraHeight = 50;
        light.shadow.camera.near = 0.1;    // default
        light.shadow.camera.far = 500;     // default
        light.shadow.camera.left = -cameraWidth/2;
        light.shadow.camera.right = cameraWidth/2;
        light.shadow.camera.top = -cameraHeight/2;
        light.shadow.camera.bottom = cameraHeight/2;
        light.shadow.camera.updateProjectionMatrix();
    }

    // set meshed
    const meshes = {};

    // center marker
    {
        const obj3D = new THREE.Object3D();
        obj3D.position.set(0,0,0);

        obj3D.rotation.y = Math.PI*-.2;
        obj3D.rotation.x = -Math.PI*1.3;
        obj3D.rotation.z = Math.PI*.9;
        

        scene.add(obj3D);
        meshes.centerMarker = obj3D;
        obj3D.add(light);
    }

    // flag
    // CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
    {
        const size = 50;
        const params = [2,size,size];
        const geometry = new THREE.BoxGeometry(...params);
        const material = new THREE.MeshPhongMaterial({
            flatShading: true,
            color:'gray'
        });
        const mesh = new THREE.Mesh(geometry,material);
        mesh.castShadow = true;
        mesh.position.y = -10;
        mesh.rotation.x = Math.PI/6;
        meshes.centerMarker.add(mesh);
        meshes.flag = mesh;
    }

    // tick point
    {        
        const radius = 30;
        const radian = Math.PI*2/12;
        const phase = Math.PI*0;
        for(let i=1;i<=12;i++){

            const obj3D = new THREE.Object3D();
            const x = radius * Math.cos(radian*i + phase);
            const z = radius * Math.sin(radian*i + phase);
            obj3D.position.set(-z,0,x);
            obj3D.lookAt(0,0,0);
            obj3D.scale.set(-1,1,1);
            meshes.centerMarker.add(obj3D);
            meshes[`tick${i}`] = obj3D;
        }
    }

    // tick marker
    {
        meshes.allTicks = [];
        for(let i=1;i<=12;i++){
            const mesh = createNumberMesh(i);
            meshes[`tick${i}`].add(mesh);
        }

        function createNumberMesh(number){
            const obj3D = new THREE.Object3D();
            
            const spread = .8;
            const thickness = 1;
            const x = .75*(12-number)*(12-number);
            const y = 2*number;
            for(let i=1;i<=number;i++){                
                const z = (thickness+spread)*12/number;
                const geometry = new THREE.BoxGeometry(x,y,z);
                const material = new THREE.MeshPhongMaterial({});
                (i)%5===0 ? material.color.setRGB(.95,0.,0.) : material.color.setRGB(0.4,0.4,0.4);
                const mesh = new THREE.Mesh(geometry,material);
                mesh.position.z = .5*z+-i*(z + spread);
                mesh.receiveShadow = true;
                obj3D.add(mesh);
                meshes.allTicks.push(mesh);
            }
            obj3D.rotation.z = Math.PI/2;
            return obj3D;
        }
    }

    //set ground
    {
        // geometry
        const size = [250,64];
        const geometry = new THREE.CircleGeometry(...size);

        // material - texture
        const loader = new THREE.TextureLoader();
        // const url = '../img/checker.png';
        // const url = '../img/cloudiness-clouds-cloudscape-414659.jpg';
        const url = 'img/cloudiness-clouds-cloudscape-414659.jpg';
        const texture = loader.load(url);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            // color:'white',
            // emissive:'white',
            side: THREE.DoubleSide
        });
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(size[0]/20,size[1]/20);
        // texture.magFilter = THREE.NearestFilter;

        const mesh = new THREE.Mesh(geometry,material);
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI/2;
        mesh.rotation.z = Math.PI/3;
        mesh.position.y = 0;

        meshes.centerMarker.add(mesh);
        meshes.ground = mesh;
        
    }
    

    function setMarker(milliSecond){

        if(milliSecond<2500){
            milliSecond += 60000;
        }

        const num = ((milliSecond/1000-2.5)/5)%12; 
        let index  = Math.ceil(num);
        const fract = num + 1 - index;
        const dist = 1 - 2 * Math.abs(fract-.5);

        const color = new THREE.Color();
        color.setHSL(dist,dist,dist/4);

        if(!meshes[`tick${index}`]){
            console.log('undefined object');
            return;
        }

        meshes[`tick${index}`].children[0].children.forEach((el,i)=>{
            el.material.emissive = color;
        });
    }
    function clearMarker(){
        meshes.allTicks.forEach((el,i)=>{
            el.material.emissive.setRGB(0,0,0);
        })
    }    

    const canvasTime = document.querySelector('#time');
    const r = 80; // light rotation radius
    const phase = Math.PI*1 // light phase
    const lightHeight = 35;
    const wave = .7;
    const px = Math.PI/2;
    const py = Math.PI/3;
    const pz = Math.PI/4;
    const offset = 5;

    render(0);
    function render(t){

        let clockTime;

        if (clock.state.on || clock.state.exit){
            clockTime = clock.getCurrentFromStamp();
        }else{
            clockTime = 0;
        }

        let milliSecond = clockTime;
        let second = Math.floor(milliSecond/1000);
        let minute = Math.floor(second/60);
        second -= minute*60; 

        if(clock.state.on){
            canvasTime.textContent = timeToString(59-second,24-minute);
        }
        if(clock.state.exit){
            canvasTime.textContent = timeToString(0,0);
        }
        
        if(clock.state.entry === true){
            const h = 300 - Math.sin(clockTime/1000)*110;
            camera.position.set(0,h,0);
            if(h <= 191){
                clock.state.entry = false;
                camera.position.set(0,190,0);
            }
        }else if(clock.state.exit === true){
            const h = 190 + Math.sin(clockTime/1000)*110;
            camera.position.set(0,h,0);
            if(h >= 299){
                clock.state.exit = false;
                camera.position.set(0,300,0);
            }
            camera.position.set(0,h,0);
        }

        clearMarker();
        setMarker(milliSecond);
 
        light.position.set(-r*Math.sin(milliSecond*Math.PI/30000+phase),lightHeight,r*Math.cos(milliSecond*Math.PI/30000+phase));

        meshes.centerMarker.position.x = offset+Math.sin(t/1000+px)*wave;
        meshes.centerMarker.position.y = offset+Math.sin(t/1000+py)*wave;
        meshes.centerMarker.position.z = offset+Math.sin(t/1000+pz)*wave;

        meshes.ground.rotation.z = -t/20000;
        
        // adjusting the camera according to canvas client size
        const needResize = resizeRendererToDisplaySize(renderer);
        if(needResize){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }        

        // check if time's up
        if(minute >= 25){
            clock.discard();
            timeStart.classList.toggle('none');
            timeDiscard.classList.toggle('none');
            document.querySelector('.panel-wrapper').classList.toggle('scroll-up');
            document.querySelector('#panel-time').classList.toggle('scroll-down');
            // add record
            clock.state.finished = true;
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

function timeToString(second,minute){
    let m,s,sl,ml;
    s = `00${second}`;
    m = `00${minute}`;
    sl = s.length;
    ml = m.length;

    return m[ml-2]+m[ml-1]+':'+s[sl-2]+s[sl-1];
}