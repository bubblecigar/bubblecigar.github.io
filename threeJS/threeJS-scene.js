'use strict';
main();
function main(){
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({canvas});

    // scene and camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('gray');
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.z = 15;
    camera.position.y = -15;
    camera.rotation.x = (Math.PI/180)*40;

    // set light
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.PointLight(color,intensity);
        light.position.set(5,-5,10);
        scene.add(light);
    }

    const objects = {};

    
    // make ground
    // set groundSpace
    {
        const groundSpace = new THREE.Object3D();
        scene.add(groundSpace);
        objects.groundSpace = groundSpace;
    }
    // PlaneBufferGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
    {
        const size = 20;
        const geometry = new THREE.PlaneBufferGeometry(size,size);
        const material = new THREE.MeshPhongMaterial({
            color: 'green'
        });
        const mesh = new THREE.Mesh(geometry,material);
        objects.groundSpace.add(mesh);
    }

    // make a car
    // set car Space -parent: ground
    {
        const carSpace = new THREE.Object3D();
        carSpace.position.z = .64;
        objects.groundSpace.add(carSpace);
        objects.carSpace = carSpace;
    }
    // carBody
    // BoxBufferGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
    {
        const width = 3;
        const height = 1.5;
        const depth = .5;
        const geometry = new THREE.BoxBufferGeometry(width,height,depth);
        const material = new THREE.MeshPhongMaterial({
            color: '',
        });
        const mesh = new THREE.Mesh(geometry,material);
        mesh.rotation.y = Math.PI*1.5;
        objects.carSpace.add(mesh);
        objects.car = mesh;

        const carCamera = new THREE.PerspectiveCamera(fov,aspect,near,far);
        carCamera.rotation.z = Math.PI*3/2;
        carCamera.rotation.y = -Math.PI*1/4;
        carCamera.position.z = 2;
        mesh.add(carCamera);
        objects.carCamera = carCamera;
    }
    // car wheel
    // CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
    {
        const radiusTop = .5;
        const radiusBottom = .5;
        const height = .3;
        const radialSegments = 4;
        const geometry = new THREE.CylinderGeometry(radiusTop,radiusBottom,height,radialSegments);
        const material = new THREE.MeshPhongMaterial({
            color: '',
        });
        const wheel1 = new THREE.Mesh(geometry,material);
        wheel1.position.z = -.15;
        wheel1.position.x = -.8;
        wheel1.position.y = -.9;
        objects.car.add(wheel1);
        objects.wheel1 = wheel1;
        
        const wheel2 = new THREE.Mesh(geometry,material);
        wheel2.position.z = -.15;
        wheel2.position.x = .8;
        wheel2.position.y = -.9;
        objects.car.add(wheel2);
        objects.wheel2 = wheel2;

        const wheel3 = new THREE.Mesh(geometry,material);
        wheel3.position.z = -.15;
        wheel3.position.x = -.8;
        wheel3.position.y = .9;
        objects.car.add(wheel3);
        objects.wheel3 = wheel3;

        const wheel4 = new THREE.Mesh(geometry,material);
        wheel4.position.z = -.15;
        wheel4.position.x = .8;
        wheel4.position.y = .9;
        objects.car.add(wheel4);
        objects.wheel4 = wheel4;
    }

    //car-doom
    //SphereBufferGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
    {
        const params = [.7,64,64,0];
        const geometry = new THREE.SphereBufferGeometry(...params);
        const material = new THREE.MeshPhongMaterial({
            color: '',
        });
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.z = .5;
        mesh.position.x = .3;

        objects.car.add(mesh);
        objects.carDoom = mesh;

        const fov = 40;
        const aspect = 2;
        const near = 0.1;
        const far = 1000;
        const doomCamera = new THREE.PerspectiveCamera(fov,aspect,near,far);
        doomCamera.position.z = 0;
        // doomCamera.position.y = -10;
        doomCamera.rotation.y = Math.PI;
        objects.doomCamera = doomCamera;
        mesh.add(doomCamera);
    }

    // doom-gun
    // CylinderBufferGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
    {
        const length = 2;
        const params = [.2,.2,length,16];
        const geometry = new THREE.CylinderBufferGeometry(...params);
        const material = new THREE.MeshPhongMaterial({
            color: 'gray',
        });
        const mesh = new THREE.Mesh(geometry,material);

        mesh.rotation.x = Math.PI/2;        
        mesh.position.z = length/2;
        

        objects.carDoom.add(mesh);
        objects.doomGun = mesh;
    }

    // scene-targetSpace
    {
        const targetSpace = new THREE.Object3D();
        scene.add(targetSpace);
        objects.targetSpace = targetSpace;

        const targetCamera = new THREE.PerspectiveCamera(fov,aspect,near,far);
        // targetCamera.rotation.z = Math.PI*3/2;
        // targetCamera.rotation.y = -Math.PI*1/4;
        targetCamera.position.z = 20;
        targetSpace.add(targetCamera);
        objects.targetCamera = targetCamera;
    }
    // ground-target
    {
        const params = [.7,.3,256,16,2,8];
        const geometry = new THREE.TorusKnotBufferGeometry(...params);
        const material = new THREE.MeshPhongMaterial({
            color: '',
        });
        const mesh = new THREE.Mesh(geometry,material);
        mesh.scale.set(.5,.5,.5);
        mesh.position.z = 0;

        objects.targetSpace.add(mesh);
        objects.target = mesh;
    }
    
    // set trail to the car
    function trace(t){
        let x = Math.sin(t)*5;
        let y = Math.cos(t)*5;
        return {
            x:x,
            y:y
        };
    }

    render();
    function render(t){
        t *= 0.001;
        
        objects.carSpace.position.x = trace(t).x;
        objects.carSpace.position.y = trace(t).y;
        const dir = trace(t+1);
        objects.carSpace.lookAt(dir.x,dir.y,0.65);

        objects.wheel1.rotation.y = t;
        objects.wheel2.rotation.y = t;
        objects.wheel3.rotation.y = t;
        objects.wheel4.rotation.y = t;

        objects.target.position.z = 1+Math.abs(3*Math.sin(t));

        const targetPosition = new THREE.Vector3();
        objects.target.getWorldPosition(targetPosition);
        objects.carDoom.lookAt(targetPosition);



        const r = Math.random()*1.3;
        const g = Math.random()*1.3;
        const b = Math.random()*1.3;
        objects.target.material.color.setRGB(r,g,b);
        objects.target.rotation.x = t;
        objects.target.rotation.y = t;

        // adjusting the camera according to canvas client size
        const adoptedCamera = camera;
        // const adoptedCamera = objects.doomCamera;
        // const adoptedCamera = objects.carCamera;
        // const adoptedCamera = objects.targetCamera;
        const needResize = resizeRendererToDisplaySize(renderer);
        if(needResize){
            const canvas = renderer.domElement;
            adoptedCamera.aspect = canvas.clientWidth / canvas.clientHeight;
            adoptedCamera.updateProjectionMatrix();
        }        

        renderer.render(scene,adoptedCamera);
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