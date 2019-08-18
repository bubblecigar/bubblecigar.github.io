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
    const light = new THREE.DirectionalLight(color,intensity);
    light.position.set(-1,2,4);
    scene.add(light);

    const suplight = new THREE.AmbientLight(color,0.4);
    scene.add(suplight);

    // set meshed
    const meshes = {};

    // set ground
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
        meshes.ground = mesh;
    }

    const ballBases = [];
    // set ball, set fake shadow
    for(let i=0;i<10;i++){
        addBall();
    }
    function addBall(init = {
        x: Math.random()*15 - 7.5,
        y: Math.random()*15 - 7.5,
        z: 1+Math.random()*5,
        phase: Math.PI*2 * Math.random()
    })
    {
        // base
        const base3D = new THREE.Object3D();
        base3D.position.set(init.x,init.y,0.001);

        // ball geometry
        const radius = 1;
        const params = [radius,64,64];
        const ball_geometry = new THREE.SphereBufferGeometry(...params);

        // ball material
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        const material = new THREE.MeshPhongMaterial({});
        material.color.setRGB(r,g,b);

        const ball_mesh = new THREE.Mesh(ball_geometry,material);

        // shadow geometry
        const shadow_geometry = new THREE.PlaneBufferGeometry(radius*4,radius*4);

        // shadow material
        const loader = new THREE.TextureLoader();
        const url = '../img/roundshadow.png';
        const texture = loader.load(url);
        

        const shadow_material = new THREE.MeshBasicMaterial({
            map:texture,
            transparent: true,
            opacity: 1.3 - init.z/10,
            depthWrite: false
        })
        const shadow_mesh = new THREE.Mesh(shadow_geometry,shadow_material);

        // linking
        scene.add(base3D);
        base3D.add(ball_mesh);
        base3D.add(shadow_mesh);
        ballBases.push({
            base: base3D,
            vx: (Math.random()-.5)/10,
            vy: (Math.random()-.5)/10,
            move: function(){
                this.base.position.x += this.vx;
                this.base.position.y += this.vy;
                if(this.base.position.x >= 10 || this.base.position.x <= -10){
                    this.vx = -this.vx;
                }
                if(this.base.position.y >= 10 || this.base.position.y <= -10){
                    this.vy = -this.vy;
                }
            },
            ball: ball_mesh,
            phase: Math.PI*2*Math.random(),
            shadow: shadow_mesh
        });
    }

    render();
    function render(t){
        t *= 0.001;
        
        ballBases.forEach((el,i)=>{
            const z = Math.abs(Math.sin(t*2+el.phase)*5) + 1;
            el.ball.position.z = z;
            el.shadow.material.opacity = 1.5-z/5;
            el.move();
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