'use strict';

const gameState = {
    hp: 10,
    level: 1,
    score: 0,
    miss: 0,
    state: 'wait' || 'playing' || 'end',
    timeStamp: Date.now(),
    loadingProgress: {
        itemsTotal: undefined,
        itemsLoaded: undefined,
        loadingUrl: undefined
    },
    elaspedTime: 0,
    startFunction: undefined
}

//load audios

const audioBlob = {
    gunShot: undefined,
    animalGasp: undefined,
    damagedSound: undefined,
    darkWind: undefined,
    gameEnd: undefined
}

{ // gunshot
    fetch('audio/gun-blast_A_minor.wav')
        .then(response => {
            return response.blob()
        })
        .then(blob => {
            audioBlob.gunShot = URL.createObjectURL(blob);
            new Audio(audioBlob.gunShot)
        }).catch(err => {
            console.log(err)
        })
    // animal be shot
    fetch('audio/kicked_G_major.wav')
        .then(response => {
            return response.blob()
        })
        .then(blob => {
            audioBlob.animalGasp = URL.createObjectURL(blob);
            new Audio(audioBlob.animalGasp)
        }).catch(err => {
            console.log(err)
        })
    // damaged sound
    fetch('audio/industrial-fx.wav')
        .then(response => {
            return response.blob()
        })
        .then(blob => {
            audioBlob.damagedSound = URL.createObjectURL(blob);
            new Audio(audioBlob.damagedSound)
        }).catch(err => {
            console.log(err)
        })
    // darkwind
    fetch('audio/long-stretched-huh-with-reverb.wav')
        .then(response => {
            return response.blob()
        })
        .then(blob => {
            audioBlob.darkWind = URL.createObjectURL(blob);
            new Audio(audioBlob.darkWind)
        }).catch(err => {
            console.log(err)
        })
    // gameend
    fetch('audio/old-rhodes-chord_90bpm_D.wav')
        .then(response => {
            return response.blob()
        })
        .then(blob => {
            audioBlob.gameEnd = URL.createObjectURL(blob);
            new Audio(audioBlob.gameEnd)
        }).catch(err => {
            console.log(err)
        })
    // background
    // fetch('audio/eerie-string-pad_125bpm_E_major.wav')
    //     .then(response => {
    //         return response.blob()
    //     })
    //     .then(blob => {
    //         audioBlob.bgm = URL.createObjectURL(blob);
    //         new Audio(audioBlob.bgm);
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
}
const bgm = new Audio('audio/eerie-string-pad_125bpm_E_major.wav');
bgm.loop = true;
bgm.autoplay = true;

const mouse = {
    layerX: 0,
    layerY: 0,
    x: 0.,
    y: 0.5
}
const canvas = document.querySelector('#canvas');
canvas.addEventListener('mousemove', e => {
    mouse.layerX = e.layerX;
    mouse.layerY = e.layerY;
    mouse.x = (e.layerX * 2 / canvas.clientWidth) - 1;
    mouse.y = 1 - (e.layerY * 2 / canvas.clientHeight);
}, false)

main();

function main() {
    // renderer

    const renderer = new THREE.WebGLRenderer({
        canvas
    });
    renderer.shadowMap.enabled = true;



    // scene
    const scene = new THREE.Scene();
    const backgroundColor = 'black';
    scene.background = new THREE.Color(backgroundColor);


    // set linear fog
    {
        const near = 20;
        const far = 70;
        const density = 0.15;
        const linearFog = new THREE.Fog(backgroundColor, near, far);
        const expFog = new THREE.FogExp2(backgroundColor, density);
        scene.fog = expFog
    }


    function fogFadeOut(t, targetDensity = 0.035, interval = 0.001) {
        if (scene.fog.density >= targetDensity) {
            scene.fog.density -= interval;
            window.requestAnimationFrame(fogFadeOut);
        } else {
            scene.fog.density = targetDensity;
        }
    }

    function fogFadeIn(t, targetDensity = 0.15, interval = 0.001) {
        if (scene.fog.density <= targetDensity) {
            scene.fog.density += interval;
            window.requestAnimationFrame(fogFadeIn);
        } else {
            scene.fog.density = targetDensity;
        }
    }

    // camera
    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // camera.position.z = 20;
    // scene.add(camera);
    // camera controls
    // const controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.target.set(0, 5, 0);
    // controls.update();

    // set light
    const color = 0xFFFFFF;
    const intensity = .5;
    const amblight = new THREE.AmbientLight(color, .3);
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(0, 5, 5);
    light.angle = Math.PI / 10;
    const lightTarget = light.target;
    scene.add(lightTarget);
    camera.add(light)
    scene.add(amblight);
    light.castShadow = true;

    // origin light
    {
        const light = new THREE.PointLight('darkred', 1);
        light.position.set(-1, -1, 2);
        light.decay = 2;
        light.distance = 5;
        scene.add(light);
    }

    // set meshes
    const meshes = {};

    // set cylindrical Box
    {
        // geometry
        const size = 50;
        const geometry = new THREE.CylinderBufferGeometry(size, size, size);

        // material - texture
        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide
        });
        material.color.setRGB(.2, .35, .2);

        // mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI / 2;
        mesh.position.z = size / 2;

        // linking
        scene.add(mesh);
        meshes.ground = mesh;
    }

    // pov
    {
        const object3D = new THREE.Object3D();
        scene.add(object3D);
        object3D.position.set(0, 0, 1);
        object3D.up = new THREE.Vector3(0, 0, 2);
        meshes.pov = object3D;
    }
    const width = 4;
    const height = 2;
    const thickness = 6;
    // body
    {
        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshPhongMaterial({
        //     color: 'navy'
        // });
        // const mesh = new THREE.Mesh(geometry, material);
        const mesh = new THREE.Object3D();
        meshes.body = mesh;
        meshes.pov.add(mesh);
    }

    // neckJoint
    {
        const object3D = new THREE.Object3D();
        meshes.body.add(object3D);
        object3D.position.set(0, thickness / 8, height / 2);
        meshes.neckJoint = object3D;
    }

    // head
    {
        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshPhongMaterial({
        //     color: 'red'
        // });
        // const mesh = new THREE.Mesh(geometry, material);
        const mesh = new THREE.Object3D();
        meshes.neckJoint.add(mesh);
        meshes.head = mesh;


    }

    // gun joint
    {
        const object3D = new THREE.Object3D();
        meshes.head.add(object3D);
        object3D.position.set(0, thickness / 8, height / 2);
        meshes.gunJoint = object3D;
        object3D.add(camera);
        camera.up = new THREE.Vector3(0, 0, 1);
        camera.position.z = 5;
        camera.position.x = -4;
        camera.position.y = -12;
        camera.lookAt(0, 15, 0);

    }
    // gun
    {
        const mesh = new THREE.Object3D();
        meshes.gunJoint.add(mesh);
        mesh.up = new THREE.Vector3(0, 0, 1);
        meshes.gun = mesh;

    }

    // targeting light
    const targetingLight = new THREE.SpotLight('red', 4);
    targetingLight.position.set(0, 5, 3);
    targetingLight.angle = Math.PI / 60;
    targetingLight.decay = .5;
    const aimingTarget = targetingLight.target;
    scene.add(aimingTarget);
    scene.add(targetingLight);

    // targeting line
    {
        // geometry
        const v1 = new THREE.Vector3(0, 0, 10);
        const v2 = new THREE.Vector3(0, 10, 0);
        const geometry = new THREE.Geometry();
        geometry.vertices.push(v1, v2);

        // material
        const material = new THREE.LineBasicMaterial({
            color: 'red'
        })
        const line = new THREE.Line(geometry, material);

        scene.add(line);

        const targetingLine = {
            line,
            v1,
            v2
        }
        meshes.targetingLine = targetingLine;
    }

    const bullets = [];
    const bulletSize = .1;
    // bullet model
    {
        const geometry = new THREE.SphereGeometry(bulletSize);
        const material = new THREE.MeshStandardMaterial({
            color: 'gray',
            metalness: 1,
            roughness: .8
        })
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'bullet';
        meshes.bulletModel = mesh;
    }

    function fire(caster) {
        new Audio(audioBlob.gunShot).play();

        if (!caster) {
            caster = meshes.gun;
        }

        const mesh = meshes.bulletModel.clone();

        const origin = new THREE.Vector3();
        caster.getWorldPosition(origin);
        const direction = new THREE.Vector3();
        caster.getWorldDirection(direction);

        mesh.position.set(origin.x, origin.y, origin.z)
        scene.add(mesh)

        const bullet = {
            mesh,
            direction,
            collisionRadius: bulletSize,
            state: 'fly'
        }
        bullets.push(bullet)

        caster.position.x += Math.random() * .2;
        caster.position.y += Math.random() * .2;
        caster.position.z += Math.random() * .2;
        setTimeout(x => {
            caster.position.set(0, 1, 0); // original position
        }, 100)
    }

    function recyclingBullets() {
        const del = [];
        bullets.forEach((el, i) => {
            if (el.state === 'remove') {
                scene.remove(el.mesh)
                del.push(i)
            }
        })
        while (del.length > 0) {
            bullets.splice(del.pop(), 1);
            if (gameState.state === 'playing') {
                gameState.miss++;
            }
        }
    }

    //FBX
    // const animals = ['Cow'];
    const animals = ['Cow', 'Zebra', 'Horse'];
    const weapon = {};
    // const trees = ['BirchTree_1'];
    const trees = ['BirchTree_1', 'BirchTree_Dead_1', 'BirchTree_Autumn_1'];
    const fbxs = {};
    const animalModels = {};
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = init;

    function init() {
        render();
        createForest();
        fogFadeOut();
    }
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
        gameState.loadingProgress.loadingUrl = url;
        gameState.loadingProgress.itemsLoaded = itemsLoaded;
        gameState.loadingProgress.itemsTotal = itemsTotal;
    }

    // load animals' fbxs
    {
        const loader = new THREE.FBXLoader(loadingManager);
        animals.forEach((animal, i) => {
            const url = `/3dModel/Farm Animals by @Quaternius/FBX/${animal}.fbx`;
            loader.load(url, fbx => {
                fbx.traverse(el => {
                    if (el instanceof THREE.Mesh) {
                        el.material.forEach(el => {
                            el.shininess = 0;
                        })
                    }
                })
                fbxs[animal] = fbx;
                fbx.traverse(x => {
                    if (x instanceof THREE.Mesh) {
                        x.castShadow = true
                    }
                })
                animalModels[animal] = {
                    fbx,
                    collisionRadius: 3
                }
            })
        })
        // load gun' fbxs
        loader.load(`/3dModel/guns by @Quaternius/AssaultRifle_1.fbx`, fbx => {
            fbxs.weapon = fbx;
            fbx.traverse(el => {
                if (el instanceof THREE.Mesh) {
                    el.material.forEach(el => {
                        el.shininess = 0;
                    })
                }
            })
            fbx.traverse(x => {
                if (x instanceof THREE.Mesh) {
                    x.castShadow = true
                }
            })
            const wrapper = new THREE.Object3D();
            wrapper.scale.set(.03, .03, .03);
            wrapper.rotation.y = Math.PI / 2;
            wrapper.rotation.x = -Math.PI;
            // wrapper.rotation.z = Math.PI;
            wrapper.position.set(0, 1.6, -8.5);

            const wrapper2 = new THREE.Object3D();
            wrapper2.up = new THREE.Vector3(0, 0, 1);
            wrapper2.rotation.z = Math.PI;

            meshes.gun.add(wrapper2);
            wrapper2.add(wrapper);
            wrapper.add(fbx);
            weapon.fbx = fbx;
        })
        // load trees' fbxs
        trees.forEach(tree => {
            loader.load(`/3dModel/Trees by @Quaternius/${tree}.fbx`, fbx => {
                fbxs[tree] = fbx;
                fbx.traverse(el => {
                    if (el instanceof THREE.Mesh) {
                        el.material.forEach(el => {
                            el.shininess = 0;
                        })
                    }
                })
                fbx.traverse(x => {
                    if (x instanceof THREE.Mesh) {
                        x.castShadow = true
                    }
                })
            })
        })
        // load flag
        loader.load(`/3dModel/Flag by @Quaternius.fbx`, fbx => {
            fbxs.flag = fbx;
            fbx.traverse(el => {
                if (el instanceof THREE.Mesh) {
                    el.material.forEach(el => {
                        el.shininess = 0;
                    })
                }
            })
            fbx.traverse(x => {
                if (x instanceof THREE.Mesh) {
                    x.castShadow = true
                }
            })
            const wrapper = new THREE.Object3D();
            wrapper.scale.set(.006, .006, .006);

            wrapper.position.set(0, 0, 0);
            wrapper.rotation.y = Math.PI;
            wrapper.rotation.x = Math.PI / 2;

            scene.add(wrapper);
            wrapper.add(fbx);
            meshes.flag = wrapper;
        })
    }


    function createTree(fbx, x = 0, y = 20) {
        const clone = fbx.clone();
        const wrapper = new THREE.Object3D();
        wrapper.scale.set(.05, .05, .05);
        wrapper.position.set(x, y, 0);
        wrapper.up = new THREE.Vector3(0, 0, 1);
        wrapper.lookAt(0, 100, 0);
        fbx.rotation.y = Math.random() * 2
        wrapper.add(clone);
        scene.add(wrapper)
    }

    function createForest() {

        const minRadius = 20;
        const maxRadius = 40;


        for (let i = 0; i < 40; i++) {
            const index = Math.floor(trees.length * Math.random());
            const fbx = fbxs[trees[index]];
            const a = rollPos(minRadius, maxRadius);
            createTree(fbx, a[0], a[1]);
        }

        function rollPos(minR, maxR) {
            const r = minR + Math.random() * (maxR - minR);
            const sign = Math.ceil(.5 - Math.random()) * 2 - 1;
            const theta = Math.PI * (Math.random() * 1.5 - .25);
            const x = r * Math.cos(theta) * sign;
            const y = r * Math.sin(theta);
            return [x, y]
        }
    }

    const enemies = [];

    function createEnemy() {
        let mesh = new THREE.Object3D();
        const animal = animals[Math.floor(animals.length * Math.random())];
        let mixer, clips;
        if (animalModels[animal] && animalModels[animal].fbx) {
            const fbx = fbxs[animal];
            const clone = THREE.SkeletonUtils.clone(fbx);
            const wrapper = new THREE.Object3D();
            wrapper.scale.set(.01, .01, .01);
            wrapper.up = new THREE.Vector3(0, 0, 1);
            wrapper.add(clone);
            wrapper.rotation.x = -Math.PI / 2;
            mesh.add(wrapper)

            mixer = new THREE.AnimationMixer(clone)
            clips = fbx.animations;
            const clip = clips[0];
            const action = mixer.clipAction(clip);
            action.setDuration(1);
            action.play()
        }
        const boxhelper = new THREE.BoxHelper(mesh);
        const sp = boxhelper.geometry.boundingSphere;

        const pos = rollSpawnPosition();
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.up = new THREE.Vector3(0, 0, 1);
        mesh.lookAt(0, 0, 0);
        const enemy = {
            mesh,
            mixer,
            clips,
            direction: pos.normalize().multiplyScalar(-1),
            collisionOffset: sp.center,
            collisionRadius: sp.radius,
            state: 'marching'
        }
        enemies.push(enemy);
        scene.add(mesh)
    }

    function rollSpawnPosition(radius = 50) {
        const theta = (1 + 2 * Math.random()) * Math.PI * .25;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        const z = 0;

        return new THREE.Vector3(x, y, z)
    }

    function bullets_enemies_collide() {
        const delEnemies = [];
        const delBullets = [];
        enemies.forEach((enemy, i1) => {
            const pos1 = enemy.mesh.position;
            const r1 = enemy.collisionRadius * .5;
            bullets.forEach((bullet, i2) => {
                const pos2 = bullet.mesh.position;
                const r2 = bullet.collisionRadius;

                const pos3 = new THREE.Vector3();
                pos3.x = pos1.x - pos2.x;
                pos3.y = pos1.y - pos2.y;
                pos3.z = 0;
                const dist = pos3.length();
                if (dist <= r1 + r2 && enemy.state === 'marching') {
                    new Audio(audioBlob.animalGasp).play();
                    bullet.state = 'remove';
                    enemy.state = 'dead'
                    enemy.mixer.clipAction(enemy.clips[1]).repetitions = 1;
                    enemy.mixer.clipAction(enemy.clips[1]).setDuration(1.5);
                    enemy.mixer.clipAction(enemy.clips[1]).play();
                    enemy.mixer.clipAction(enemy.clips[0]).stop();
                    setTimeout(x => {
                        enemy.state = 'remove'
                    }, enemy.clips[1].duration * 1000)
                    if (gameState.state === 'playing') {
                        gameState.score++
                    }
                }
            })
        })
        while (delEnemies.length > 0) {
            enemies.splice(delEnemies.pop(), 1);
        }
        while (delBullets.length > 0) {
            bullets.splice(delBullets.pop(), 1);
        }
    }

    function enemies_body_collide() {
        const delEnemies = [];
        enemies.forEach((enemy, i1) => {
            const pos1 = enemy.mesh.position;
            const r1 = enemy.collisionRadius;

            const pos2 = meshes.pov.position;
            const r2 = 0;

            const pos3 = new THREE.Vector3();
            pos3.x = pos1.x - pos2.x;
            pos3.y = pos1.y - pos2.y;
            pos3.z = pos1.z - pos2.z;
            const dist = pos3.length();
            if (dist <= r1 + r2) {
                if (gameState.state === 'playing') {
                    gameState.hp--
                    new Audio(audioBlob.damagedSound).play()
                }
                scene.remove(enemy.mesh);
                delEnemies.push(i1);

                meshes.pov.position.z += .2;
                light.color.setRGB(.6, 0, 0);
                amblight.color.setRGB(1, 0, 0);
                setTimeout(x => {
                    meshes.pov.position.z = 0;
                    light.color.setRGB(1, 1, 1);
                    amblight.color.setRGB(1, 1, 1);
                }, 100)
            }
        })
        while (delEnemies.length > 0) {
            enemies.splice(delEnemies.pop(), 1);
        }
    }

    canvas.addEventListener('click', e => {
        fire();
    }, false)

    const raycaster = new THREE.Raycaster()

    function castRay() {
        const targetingLine = meshes.targetingLine;
        targetingLine.line.geometry.verticesNeedUpdate = true;

        const origin = new THREE.Vector3();
        meshes.gun.getWorldPosition(origin);
        targetingLight.position.set(origin.x, origin.y, origin.z)

        targetingLine.v1.set(origin.x, origin.y, origin.z);

        const mouseCoord = new THREE.Vector2(mouse.x, mouse.y);
        raycaster.setFromCamera(mouseCoord, camera);
        const objArray = raycaster.intersectObject(meshes.ground, false);
        if (objArray.length > 0) {
            const intersectPt = objArray[0].point;
            // console.log(objArray)
            aimingTarget.position.set(intersectPt.x, intersectPt.y, intersectPt.z)
            lightTarget.position.set(intersectPt.x, intersectPt.y, intersectPt.z)

            targetingLine.v2.set(intersectPt.x, intersectPt.y, intersectPt.z)

            meshes.gun.lookAt(intersectPt.x, intersectPt.y, intersectPt.z)
        }
    }

    const clock = new THREE.Clock(false);

    function gameStart() {
        bgm.play();
        fogFadeOut();
        clock.start();
    }
    gameState.startFunction = gameStart;

    function gameEnd() {
        console.log('end')
        new Audio(audioBlob.gameEnd).play();
        clock.stop();
        gameState.state = 'end';
    }

    let stamp = 0;
    const levelUpInterval = 27;

    function render(t = 0) {
        meshes.gun.lookAt(0, 10, 0);

        t *= 0.001;
        const deltaT = t - stamp;
        stamp = t;
        gameState.elaspedTime = clock.getElapsedTime();

        // adjust level according to elaspedTime
        if (gameState.elaspedTime / levelUpInterval > gameState.level) {
            new Audio(audioBlob.darkWind).play();
            gameState.level++
        }

        // spawn
        const enemyPerSecond = gameState.level * .5;
        const enemySpawnChance = enemyPerSecond * deltaT;
        if (Math.random() < enemySpawnChance && gameState.state === 'playing') {
            createEnemy();
        }

        // adjust camera
        meshes.neckJoint.rotation.z = -mouse.x * Math.PI * .5;
        meshes.gunJoint.rotation.x = (mouse.y / 2 - .5) * Math.PI * .25;

        // set hinting target
        castRay()

        // move bullets
        bullets.forEach((el) => {
            if (el.state === 'fly') {
                el.mesh.position.x += el.direction.x / 4;
                el.mesh.position.y += el.direction.y / 4;
                el.mesh.position.z += el.direction.z / 4;
            }
            if (el.mesh.position.z <= 0 || el.mesh.position.distanceTo(new THREE.Vector3(0, 0, 0) >= 25)) {
                el.state = 'remove'
            }
        })
        recyclingBullets();

        // move enemies
        const delEnemies = [];
        enemies.forEach((el, i) => {
            if (el.mixer) {
                el.mixer.update(deltaT)
            }
            if (el.state === 'marching') {
                el.mesh.position.x += gameState.level * el.direction.x / 12;
                el.mesh.position.y += gameState.level * el.direction.y / 12;
                el.mesh.position.z += gameState.level * el.direction.z / 12;
            }
            if (el.state === 'remove') {
                delEnemies.push(i)
                scene.remove(el.mesh)
            }
        })
        while (delEnemies.length > 0) {
            enemies.splice(delEnemies.pop(), 1);
        }
        bullets_enemies_collide()
        enemies_body_collide()

        // adjusting the camera according to canvas client size
        const needResize = resizeRendererToDisplaySize(renderer);
        if (needResize) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // gamestate management
        if (gameState.state != 'end') {
            if (gameState.hp <= 0 || gameState.elaspedTime >= 90) {
                gameEnd();
            }
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