'use strict';

// const gui = new dat.GUI();
const canvas = document.querySelector('#canvas');
const mouse = {
    layerX: undefined,
    layerY: undefined,
    vec2: new THREE.Vector2()
};
canvas.addEventListener('mousemove',
    e => {
        mouse.layerX = e.layerX;
        mouse.layerY = e.layerY;
        mouse.vec2.x = 2 * (e.layerX / canvas.clientWidth) - 1;
        mouse.vec2.y = -(2 * (e.layerY / canvas.clientHeight) - 1);
    }, false)

main();

function main() {
    // renderer

    const renderer = new THREE.WebGLRenderer({
        canvas
    });

    // scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color('gray');

    // camera
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 2000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const d = 500;
    camera.position.z = d;
    // camera.position.y = d;
    // camera.position.x = d;
    scene.add(camera)
    // camera controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.target.set(0, 0, 0);
    // controls.update();

    // set light
    const color = 0xFFFFFF;
    const intensity = .8;
    const light = new THREE.DirectionalLight(color, intensity);
    camera.add(light);

    // loading manager
    THREE.DefaultLoadingManager.onLoad = () => {
        addFBX();
    }

    // fbx
    const fbxs = []; {
        const fishes = [
            // 'Whale',
            // 'Shark',
            // 'Manta ray',
            // 'Fish3',
            // 'Fish2',
            'Fish1',
            // 'Dolphin'
        ]
        const fbxLoader = new THREE.FBXLoader();

        fishes.forEach(fish => {
            const url = `/fbx/${fish}.fbx`
            fbxLoader.load(url, fbx => {
                fbx.name = fish;
                fbxs.push(fbx);

                // set material shininess to 0
                fbx.traverse(el => {
                    if (el instanceof THREE.Mesh) {
                        if (el.material instanceof Array) {
                            el.material.forEach(material => {
                                material.shininess = 0;
                            })
                        } else {
                            el.material.shininess = 0;
                        }
                    }
                })
            })
        })
    }

    // make fishes clone
    const fishes = [];

    function addFBX() {
        fbxs.forEach((fbx, i) => {
            const mesh = THREE.SkeletonUtils.clone(fbx);
            scene.add(mesh);
            mesh.scale.set(0.5, 0.5, 0.5);
            // mixer
            const mixer = new THREE.AnimationMixer(mesh);
            const clips = fbx.animations;
            const clip = clips[0];
            const action = mixer.clipAction(clip);
            action.play();
            // linking
            fishes.push({
                mesh,
                mixer
            })
        })
    }

    // mouse picking panel
    let pickingPanel; {
        const size = [1000, 1000, 1000];
        const geometry = new THREE.PlaneBufferGeometry(...size);
        const material = new THREE.MeshBasicMaterial({
            opacity: .3,
            transparent: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, -1000);
        camera.add(mesh);
        pickingPanel = mesh;
    }

    let mouseMarker; {
        const geometry = new THREE.SphereBufferGeometry(.01);
        const material = new THREE.MeshBasicMaterial({
            color: 'white',
            side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh)
        mouseMarker = mesh;
    }

    const raycaster = new THREE.Raycaster();

    function updateMouseMarker() {
        raycaster.setFromCamera(mouse.vec2, camera)
        const ptsObj = raycaster.intersectObject(pickingPanel, false);
        if (ptsObj.length <= 0) {
            return
        }
        const ptObj = ptsObj[0];
        const pt = ptObj.point;
        mouseMarker.position.x = pt.x;
        mouseMarker.position.y = pt.y;
        mouseMarker.position.z = pt.z;
    }

    function updateFishLocation() {
        fishes.forEach(fish => {
            fish.mesh.position.x = mouseMarker.position.x;
            fish.mesh.position.y = mouseMarker.position.y;
            fish.mesh.position.z = mouseMarker.position.z;
        })
    };

    const clock = new THREE.Clock(false);
    clock.start();
    render();

    function render(t) {
        t *= 0.001;
        const delta = clock.getDelta();

        // update animation mixer
        fishes.forEach(fish => {
            fish.mixer.update(delta)
        })

        // update mouse coord
        updateMouseMarker();

        // update fish location
        updateFishLocation();

        // adjusting the camera according to canvas client size
        const needResize = resizeRendererToDisplaySize(renderer);
        if (needResize) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        window.requestAnimationFrame(render);
    }
}

function resizeRendererToDisplaySize(renderer) {
    //const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize =
        width !== canvas.width ||
        height !== canvas.height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return true
}