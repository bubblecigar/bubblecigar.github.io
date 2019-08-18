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
    camera.position.z = 20;

    // set light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color,intensity);
    light.position.set(-1,2,4);
    scene.add(light);

    // managing meshes on screen
    const meshes = [];
    const spread = 2.5;

    function createMesh(params){
        const geometry = new THREE[params.geometryConstructor](...params.geometryParams);
        const material = new THREE[params.materialConstructor](params.materialParams);
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.x = params.position.x * spread;
        mesh.position.y = params.position.y * spread;
        scene.add(mesh);
        meshes.push(mesh);
        return mesh;
    }
    function createLine(params){
        const geometry = new THREE[params.geometryConstructor](...params.geometryParams);
        const material = new THREE[params.materialConstructor](params.materialParams);
    
        const line = new THREE[params.lineConstructor](geometry,material);
        line.position.x = params.position.x * spread;
        line.position.y = params.position.y * spread;
        scene.add(line);
        meshes.push(line);
        return line;
    }
    
    // making mesh
        // material
    const materialParam = {
        color: '',
        side: THREE.DoubleSide
    }    
{// BoxBufferGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
    const params = {
        geometryConstructor: 'BoxBufferGeometry',
        geometryParams: [],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: -2,
                y: 2,
                z: 0
        }
    }
    const mesh = createMesh(params);
}
{ // CircleBufferGeometry(radius : Float, segments : Integer, thetaStart : Float, thetaLength : Float)
    const mesh = createMesh({
        geometryConstructor: 'CircleBufferGeometry',
        geometryParams: [1,50],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: -1,
                y: 2,
                z: 0
        }
    });
}

{ // ConeBufferGeometry(radius : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
    const mesh = createMesh({
        geometryConstructor: 'ConeBufferGeometry',
        geometryParams: [1,2,30],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 0,
                y: 2,
                z: 0
        }
    });
}

{ // CylinderBufferGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
    const mesh = createMesh({
        geometryConstructor: 'CylinderBufferGeometry',
        geometryParams: [.5,.8,1.5,30],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 1,
                y: 2,
                z: 0
        }
    });
}

{ // DodecahedronBufferGeometry(radius : Float, detail : Integer)
    const mesh = createMesh({
        geometryConstructor: 'DodecahedronBufferGeometry',
        geometryParams: [],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 2,
                y: 2,
                z: 0
        }
    });
}

{ //  ExtrudeBufferGeometry(shapes : Array, options : Object)
    var length = .8, width = .8, depth = .5;

    var shape = new THREE.Shape();
        shape.moveTo( -length/2,-width/2);
        shape.lineTo( -length/2, width/2);
        shape.lineTo( length/2, width/2);
        shape.lineTo( length/2, -width/2);
        shape.lineTo( -length/2,-width/2);
    var extrudeSettings = {
        steps: 2,
        depth: depth,
        bevelEnabled: true,
        bevelThickness: .5,
        bevelSize: .5,
        bevelOffset: 0,
        bevelSegments: 4
    };
    const mesh = createMesh({
        geometryConstructor: 'ExtrudeBufferGeometry',
        geometryParams: [shape,extrudeSettings],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: -2,
                y:  1,
                z: 10
        }
    });
}

{ // IcosahedronBufferGeometry(radius : Float, detail : Integer)
    const mesh = createMesh({
        geometryConstructor: 'IcosahedronBufferGeometry',
        geometryParams: [],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: -1,
                y: 1,
                z: 0
        }
    });
}

{ // LatheBufferGeometry(points : Array, segments : Integer, phiStart : Float, phiLength : Float)
    const points = [];
    points.push(new THREE.Vector2(0,-1));
    points.push(new THREE.Vector2(1,0));
    points.push(new THREE.Vector2(0,1));
    const mesh = createMesh({
        geometryConstructor: 'LatheBufferGeometry',
        geometryParams: [points,8],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 0,
                y: 1,
                z: 0
        }
    });
}

{ // OctahedronBufferGeometry(radius : Float, detail : Integer)
    const mesh = createMesh({
        geometryConstructor: 'OctahedronBufferGeometry',
        geometryParams: [],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 1,
                y: 1,
                z: 0
        }
    });
}

{ // ParametricBufferGeometry(func : Function, slices : Integer, stacks : Integer)
    function to3Dfunc(v,u,target){
        let l = (v - .5)*(v - .5) + (u - .5)*(u - .5);
        l = Math.sqrt(l);
        l = (1.-l)*(1.-l)*Math.sin(Math.PI*l*4);
        target.set(v-.5,u-.5,l).multiplyScalar(2); 
    }
    const mesh = createMesh({
        geometryConstructor: 'ParametricBufferGeometry',
        geometryParams: [to3Dfunc,50,50],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 2,
                y: 1,
                z: 0
        }
    });
}

{ // PlaneBufferGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
    const mesh = createMesh({
        geometryConstructor: 'PlaneBufferGeometry',
        geometryParams: [2,2],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: -2,
                y: 0,
                z: 0
        }
    });
}

{ // PolyhedronBufferGeometry(vertices : Array, indices : Array, radius : Float, detail : Integer)
    const vertices = [];
    const indices = [];
    const pointsNumber = 20;
    for(let i=0;i<pointsNumber*3;i++){
        vertices.push(1*(Math.random()-.5));
        indices.push(Math.floor(Math.random()*pointsNumber));
    }
    
    const mesh = createMesh({
        geometryConstructor: 'PolyhedronBufferGeometry',
        geometryParams: [vertices,indices,1,1],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: -1,
                y: 0,
                z: 0
        }
    });
}

{ // RingBufferGeometry(innerRadius : Float, outerRadius : Float, thetaSegments : Integer, phiSegments : Integer, thetaStart : Float, thetaLength : Float)
    const mesh = createMesh({
        geometryConstructor: 'RingBufferGeometry',
        geometryParams: [.6,1.2,8,1,0,Math.PI*1.5],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 0,
                y: 0,
                z: 0
        }
    });
}
{// ShapeBufferGeometry(shapes : Array, curveSegments : Integer)
    const shape = new THREE.Shape();
    // constructing shape
    shape.moveTo(0,0,0);
    shape.lineTo(1,0,0);
    shape.lineTo(1,1,0);
    shape.lineTo(.5,.5,0);
    shape.lineTo(0,1.2,0);
    shape.lineTo(-.5,.5,0);
    shape.lineTo(-1,1,0);
    shape.lineTo(-1,0,0);
    shape.lineTo(0,0,0);

    const shape2 = new THREE.Shape();
    // constructing shape
    shape2.moveTo(0,-1,0);
    shape2.lineTo(1,-1,0);
    shape2.lineTo(0,-.5,0);
    shape2.lineTo(-1,-1,0);
    shape2.lineTo(0,-1,0);
    

    const mesh = createMesh({
        geometryConstructor: 'ShapeBufferGeometry',
        geometryParams: [[shape,shape2]],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 1,
                y: 0,
                z: 0
        }
    });

}

{ // SphereBufferGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
    const mesh = createMesh({
        geometryConstructor: 'SphereBufferGeometry',
        geometryParams: [1,8,8,0,Math.PI*1.5,0,Math.PI*.75],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 2,
                y: 0,
                z: 0
        }
    });
}

{ // TetrahedronBufferGeometry(radius : Float, detail : Integer)
    const mesh = createMesh({
        geometryConstructor: 'TetrahedronBufferGeometry',
        geometryParams: [1],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: -2,
                y: -1,
                z: 0
        }
    });
}

{ // TextBufferGeometry(text : String, parameters : Object)
    const loader = new THREE.FontLoader();
    loader.load('https://bubblecigar.github.io/fonts/helvetiker_regular.typeface.json',function(font){        
        const text = '!?'
        const options = {
            font: font,
            size: 1.5,
            height: .5,
            curveSegments: 2,
            bevelEnabled: true,
            bevelThickness: .3,
            bevelSize: .2,
            bevelOffset: .0,
            bevelSegments: 2
        }
        const m = createMesh({
            geometryConstructor: 'TextBufferGeometry',
            geometryParams: [text,options],
            materialConstructor: 'MeshPhongMaterial',
            materialParams: {color:'', side: THREE.DoubleSide},
            position: {
                    x: -1,
                    y: -1,
                    z: 0
            }
        });
    });
}

{ // TorusBufferGeometry(radius : Float, tube : Float, radialSegments : Integer, tubularSegments : Integer, arc : Float)
    const mesh = createMesh({
        geometryConstructor: 'TorusBufferGeometry',
        geometryParams: [.6,.4,10,20,Math.PI*1.5],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 0,
                y: -1,
                z: 0
        }
    });
}

{ // TorusKnotBufferGeometry(radius : Float, tube : Float, tubularSegments : Integer, radialSegments : Integer, p : Integer, q : Integer)
    const mesh = createMesh({
        geometryConstructor: 'TorusKnotBufferGeometry',
        geometryParams: [.7,.3,256,16,2,8],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 1,
                y: -1,
                z: 0
        }
    });
}

{ // TubeBufferGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
    const curve = new THREE.Curve();
    curve.getPoint = function(x){
        let y = Math.cos(x*Math.PI*4);
        let z = Math.sin(x*Math.PI*4);
        x = (x-.5)*2;
        return new THREE.Vector3(x,y/4,z/4);
    }
    const mesh = createMesh({
        geometryConstructor: 'TubeBufferGeometry',
        geometryParams: [curve,128,.3,16,false],
        materialConstructor: 'MeshPhongMaterial',
        materialParams: {color:'', side: THREE.DoubleSide},
        position: {
                x: 2,
                y: -1,
                z: 0
        }
    });
}

{ // EdgesGeometry( geometry : Geometry, thresholdAngle : Integer )
    const geometry = new THREE.BoxGeometry(1.5,1.5,1.5);
    const line = createLine({
        geometryConstructor: 'EdgesGeometry',
        geometryParams: [geometry],
        lineConstructor: 'LineSegments',
        materialConstructor: 'LineBasicMaterial',
        materialParams: {color:''},
        position: {
                x: 2,
                y: -2,
                z: 0
        }
    });
}

{ // WireframeGeometry( geometry : Geometry )
    const geometry = new THREE.BoxGeometry(1.5,1.5,1.5);
    const line = createLine({
        geometryConstructor: 'WireframeGeometry',
        geometryParams: [geometry],
        lineConstructor: 'LineSegments',
        materialConstructor: 'LineBasicMaterial',
        materialParams: {color:''},
        position: {
                x: -2,
                y: -2,
                z: 0
        }
    });
}

    render();
    function render(t){
        t *= 0.001;
        // camera.rotation.z = t;
        // camera.position.z = 20 + Math.sin(t)*10;
        meshes.forEach((mesh,index)=>{
            mesh.rotation.x = t;
            mesh.rotation.y = t;
            mesh.rotation.z = t;
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

