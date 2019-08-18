'use strict';

// 4D matrix space
const m4 = {
    multiply: function(m,n){ // m * n
        let r = [];
        r.push(m[ 0]*n[ 0] + m[ 1]*n[ 4] + m[ 2]*n[ 8] + m[ 3]*n[12]);
        r.push(m[ 0]*n[ 1] + m[ 1]*n[ 5] + m[ 2]*n[ 9] + m[ 3]*n[13]);
        r.push(m[ 0]*n[ 2] + m[ 1]*n[ 6] + m[ 2]*n[10] + m[ 3]*n[14]);
        r.push(m[ 0]*n[ 3] + m[ 1]*n[ 7] + m[ 2]*n[11] + m[ 3]*n[15]);
        r.push(m[ 4]*n[ 0] + m[ 5]*n[ 4] + m[ 6]*n[ 8] + m[ 7]*n[12]);
        r.push(m[ 4]*n[ 1] + m[ 5]*n[ 5] + m[ 6]*n[ 9] + m[ 7]*n[13]);
        r.push(m[ 4]*n[ 2] + m[ 5]*n[ 6] + m[ 6]*n[10] + m[ 7]*n[14]);
        r.push(m[ 4]*n[ 3] + m[ 5]*n[ 7] + m[ 6]*n[11] + m[ 7]*n[15]);
        r.push(m[ 8]*n[ 0] + m[ 9]*n[ 4] + m[10]*n[ 8] + m[11]*n[12]);
        r.push(m[ 8]*n[ 1] + m[ 9]*n[ 5] + m[10]*n[ 9] + m[11]*n[13]);
        r.push(m[ 8]*n[ 2] + m[ 9]*n[ 6] + m[10]*n[10] + m[11]*n[14]);
        r.push(m[ 8]*n[ 3] + m[ 9]*n[ 7] + m[10]*n[11] + m[11]*n[15]);
        r.push(m[12]*n[ 0] + m[13]*n[ 4] + m[14]*n[ 8] + m[15]*n[12]);
        r.push(m[12]*n[ 1] + m[13]*n[ 5] + m[14]*n[ 9] + m[15]*n[13]);
        r.push(m[12]*n[ 2] + m[13]*n[ 6] + m[14]*n[10] + m[15]*n[14]);
        r.push(m[12]*n[ 3] + m[13]*n[ 7] + m[14]*n[11] + m[15]*n[15]);
        return r
    },
    transpose: function(n){
        return[
            n[0],n[4],n[8],n[12],
            n[1],n[5],n[9],n[13],
            n[2],n[6],n[10],n[14],
            n[3],n[7],n[11],n[15],
        ]
    },
    createIdentity: function(){
        return [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]
    },
    translate: function(n,tx,ty,tz){
        let m = [
            1,0,0,tx,
            0,1,0,ty,
            0,0,1,tz,
            0,0,0,1            
        ];
        return this.multiply(m,n);
    },
    scale: function(n,sx,sy,sz){
        let m = [
            sx,0,0,0,
            0,sy,0,0,
            0,0,sz,0,
            0,0,0,1
        ];
        return this.multiply(m,n);
    },
    xRotatate: function(n,rad){
        let c = Math.cos(rad);
        let s = Math.sin(rad);
        let m = [
            1,0,0,0,
            0,c,-s,0,
            0,s,c,0,
            0,0,0,1
        ];
        return this.multiply(m,n);
    },
    yRotatate: function(n,rad){
        let c = Math.cos(rad);
        let s = Math.sin(rad);
        let m = [
            c,0,s,0,
            0,1,0,0,
            -s,0,c,0,
            0,0,0,1
        ];
        return this.multiply(m,n);
    },
    zRotatate: function(n,rad){
        let c = Math.cos(rad);
        let s = Math.sin(rad);
        let m = [
            c,-s,0,0,
            s,c,0,0,
            0,0,1,0,
            0,0,0,1
        ];
        return this.multiply(m,n);
    },
    // fov = fieldofView, ar = aspectRatio (width/height)
    // n = near, f = far
    setPerspective: function(matrix,fov,ar,n,f){
        let tan = Math.tan(fov*0.5);
        let m = [
            1/(tan*ar),0,         0,              0,
            0,         1/tan,     0,              0,
            0,         0,         (f+n)/(f-n),    (2*n*f)/(n-f),
            0,         0,         1,              0
        ]
        return this.multiply(m,matrix)
    },
    createPerspectiveMatrix: function(fieldOfViewInRadians, aspect, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);
     
        return [
          f / aspect, 0, 0, 0,
          0, f, 0, 0,
          0, 0, (near + far) * rangeInv, near * far * rangeInv * 2,
          0, 0, -1, 0
        ];
      },
    invert: function(m){
        let M = [
            [m[0],m[1],m[2],m[3]],
            [m[4],m[5],m[6],m[7]],
            [m[8],m[9],m[10],m[11]],
            [m[12],m[13],m[14],m[15]]
        ];
        // source: http://blog.acipo.com/matrix-inversion-in-javascript/
        // I use Guassian Elimination to calculate the inverse:
        // (1) 'augment' the matrix (left) by the identity (on the right)
        // (2) Turn the matrix on the left into the identity by elemetry row ops
        // (3) The matrix on the right is the inverse (was the identity matrix)
        // There are 3 elemtary row ops: (I combine b and c in my code)
        // (a) Swap 2 rows
        // (b) Multiply a row by a scalar
        // (c) Add 2 rows
        
        //if the matrix isn't square: exit (error)
        if(M.length !== M[0].length){return;}
        
        //create the identity matrix (I), and a copy (C) of the original
        var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
        var I = [], C = [];
        for(i=0; i<dim; i+=1){
            // Create the row
            I[I.length]=[];
            C[C.length]=[];
            for(j=0; j<dim; j+=1){
                
                //if we're on the diagonal, put a 1 (for identity)
                if(i==j){ I[i][j] = 1; }
                else{ I[i][j] = 0; }
                
                // Also, make the copy of the original
                C[i][j] = M[i][j];
            }
        }
        
        // Perform elementary row operations
        for(i=0; i<dim; i+=1){
            // get the element e on the diagonal
            e = C[i][i];
            
            // if we have a 0 on the diagonal (we'll need to swap with a lower row)
            if(e==0){
                //look through every row below the i'th row
                for(ii=i+1; ii<dim; ii+=1){
                    //if the ii'th row has a non-0 in the i'th col
                    if(C[ii][i] != 0){
                        //it would make the diagonal have a non-0 so swap it
                        for(j=0; j<dim; j++){
                            e = C[i][j];       //temp store i'th row
                            C[i][j] = C[ii][j];//replace i'th row by ii'th
                            C[ii][j] = e;      //repace ii'th by temp
                            e = I[i][j];       //temp store i'th row
                            I[i][j] = I[ii][j];//replace i'th row by ii'th
                            I[ii][j] = e;      //repace ii'th by temp
                        }
                        //don't bother checking other rows since we've swapped
                        break;
                    }
                }
                //get the new diagonal
                e = C[i][i];
                //if it's still 0, not invertable (error)
                if(e==0){return}
            }
            
            // Scale this row down by e (so we have a 1 on the diagonal)
            for(j=0; j<dim; j++){
                C[i][j] = C[i][j]/e; //apply to original matrix
                I[i][j] = I[i][j]/e; //apply to identity
            }
            
            // Subtract this row (scaled appropriately for each row) from ALL of
            // the other rows so that there will be 0's in this column in the
            // rows above and below this one
            for(ii=0; ii<dim; ii++){
                // Only apply to other rows (we want a 1 on the diagonal)
                if(ii==i){continue;}
                
                // We want to change this element to 0
                e = C[ii][i];
                
                // Subtract (the row above(or below) scaled by e) from (the
                // current row) but start at the i'th column and assume all the
                // stuff left of diagonal is 0 (which it should be if we made this
                // algorithm correctly)
                for(j=0; j<dim; j++){
                    C[ii][j] -= e*C[i][j]; //apply to original matrix
                    I[ii][j] -= e*I[i][j]; //apply to identity
                }
            }
        }
        
        //we've done all operations, C should be the identity
        //matrix I should be the inverse:
        // return I
        return [...I[0],...I[1],...I[2],...I[3]];
    },
    // objectPosition = [a,b,c]; targetPosition = [d,e,f];
    lookAt: function(n, objectPosition,targetPosition){
        let vecZ = [
            targetPosition[0] - objectPosition[0],
            targetPosition[1] - objectPosition[1],
            targetPosition[2] - objectPosition[2]
        ];
    
        vecZ = this.normalize(vecZ);
        let vecX = this.cross([0,1,0],vecZ);
        vecX = this.normalize(vecX);
        let vecY = this.cross(vecZ,vecX);
        vecY = this.normalize(vecY);
        let m = [
            vecX[0],vecY[0],vecZ[0], objectPosition[0],
            vecX[1],vecY[1],vecZ[1], objectPosition[1],
            vecX[2],vecY[2],vecZ[2], objectPosition[2],
            0,0,0,1
        ];
        return this.multiply(m,n)
    },
    normalize: function(vec){
        let l = Math.pow(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2],0.5);
        return [
            vec[0]/l,
            vec[1]/l,
            vec[2]/l
        ]
    },
    cross: function(v1,v2){
        return[
            v1[1]*v2[2] - v1[2]*v2[1],
            v1[2]*v2[0] - v1[0]*v2[2],
            v1[0]*v2[1] - v1[1]*v2[0],
        ]
    },
    length: function(vec){
        return Math.pow(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2],0.5);
    }
}


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
    camera.up.set(0,0,1);
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
        carSpace.up = new THREE.Vector3(0,0,1);
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
        mesh.position.z = 1;
        mesh.rotation.x = Math.PI*1.5;
        mesh.rotation.z = Math.PI*1.5;
        objects.carSpace.add(mesh);
        objects.car = mesh;

        const carCamera = new THREE.PerspectiveCamera(fov,aspect,near,far);
        carCamera.rotation.z = Math.PI*3/2;
        carCamera.rotation.y = -Math.PI*1/4;
        carCamera.position.z = 2;
        mesh.add(carCamera);
        objects.carCamera = carCamera;
    }
    // car wheels
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
        mesh.up.set(0,0,1);

        objects.car.add(mesh);
        objects.carDoom = mesh;

        const fov = 40;
        const aspect = 2;
        const near = 0.1;
        const far = 1000;
        const doomCamera = new THREE.PerspectiveCamera(fov,aspect,near,far);
        doomCamera.position.z = -3;
        doomCamera.position.y = 1.;
        // doomCamera.position.y = -10;
        doomCamera.rotation.y = Math.PI;
        doomCamera.up.set(0,0,1);
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
        targetCamera.position.z = 8;
        targetCamera.up = new THREE.Vector3(0,0,1);
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

        objects.targetSpace.position.z = 1+Math.abs(3*Math.sin(t));

        const targetPosition = new THREE.Vector3();
        objects.target.getWorldPosition(targetPosition);
        objects.carDoom.lookAt(targetPosition);

        const r = Math.random()*1.3;
        const g = Math.random()*1.3;
        const b = Math.random()*1.3;
        objects.target.material.color.setRGB(r,g,b);
        // objects.target.rotation.x = t;
        // objects.target.rotation.y = t;

        // adjusting the camera according to canvas client size
        // const adoptedCamera = camera;
        const adoptedCamera = objects.doomCamera;
        // const adoptedCamera = objects.carCamera;
        // const adoptedCamera = objects.targetCamera;
        // const carPosition = new THREE.Vector3();
        // objects.car.getWorldPosition(carPosition);
        // adoptedCamera.lookAt(carPosition);

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

