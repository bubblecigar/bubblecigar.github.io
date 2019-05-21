
const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

function createPt(x,y){
	return{
		x:x,
		y:y
	}
}

function toCenter(){
	ctx.beginPath();
	let cx = parseFloat(canvas.getAttribute('width'))*0.5;
	let cy = parseFloat(canvas.getAttribute('height'))*0.5;
	ctx.moveTo(cx,cy);
	return {x:cx,y:cy}
}

function rollColor(a=undefined){
	let r,g,b;
	r = Math.floor(Math.random()*255);
	g = Math.floor(Math.random()*255);
	b = Math.floor(Math.random()*255);

	a = a ? 1 : Math.random();
	
	return `rgba(${r},${g},${b},${a})`
}

function clearAll(){
	let wx = parseFloat(canvas.getAttribute('width'));
	let wy = parseFloat(canvas.getAttribute('height'));
	ctx.clearRect(0,0,wx,wy);
	ctx.beginPath();
}

function getLength(pt1,pt2){
	return Math.pow(((pt1.x - pt2.x)*(pt1.x - pt2.x) +(pt1.y - pt2.y)*(pt1.y - pt2.y)),0.5);
}


canvas.addEventListener('mousemove',(e)=>{
	cursorPt.x = e.layerX;
	cursorPt.y = e.layerY;

},false);

const cursorPt = createPt();

const animationLayer = {
	animatedObjects:[],
	backgroundImage: undefined, //function that draw static background
	addAnimatableObject: function(obj){
		this.animatedObjects.push(obj);
		// if (!this.on) {
		// 	this.animate();
		// 	this.on = true;
		// }
	},
	clear: function(){
		this.animatedObjects = [];
		clearAll();
		this.stop();
	},
	timeInterval: 10,
	animate: function(){
		if(!this.on){return}
		clearAll();
		if (this.backgroundImage) {
			this.backgroundImage();
		}
		if (this.animatedObjects.length>0) {
			for (var i = this.animatedObjects.length - 1; i >= 0; i--) {
				if (this.animatedObjects[i].render()){
					this.animatedObjects[i].render();
				}else {
					this.animatedObjects.splice(i,1);
				}
			}
			setTimeout(()=>{
				return this.animate();
			},this.timeInterval);
			// requestAnimationFrame(this.animate());
		}else {
			this.on = false;
		}
	},
	on: false,
	stop: function(){
		this.on = false
	},
	start: function(){
		this.on = true;
		this.animate();
	}

}


function createAnimatableObject(initial_x=0,initial_y=0,initial_radius=10){
	return{
		coordinate: {
			x:initial_x,
			y:initial_y,
			dx:0,
			dy:0,
			target_x:initial_x,
			target_y:initial_y
		},
		toInitialPoint: function (x=pt.x,y=pt.y){
			this.coordinate.x = initial_x;
			this.coordinate.y = initial_y;
		},
		property: {
			r0:initial_radius,
			radius:initial_radius,
			fillColor:'rgba(0,0,0,1)',
			strokeColor:'rgba(0,0,0,1)',
		},
		monitoringObjects:[],
		timer:{
			counter:0,
			duration:200
		},
		render: function(){
			if (this[this.motion]){
				this[this.motion]();
			}else{
				return false
			}
			this.draw();
			return true
		},
		draw: function(){
			// how the object renders itself on the canvas?
		},
		motion: 'enter', // call corresponding functions in each frame:
		enter: function(){
			// property/coordinate changes
			// motion switch criteria
		},
		linger: function(){
			// property/coordinate changes
			// motion switch criteria
		},
		reEnter: function(){
			// property/coordinate changes
			// motion switch criteria
		},
		exit: function(){
			// property/coordinate changes
			// motion switch criteria
		}
	}
}






//subClass of createAnimatableObject
function createBouncingBall(initial_x=100,initial_y=100,initial_radius=10){

	let a = createAnimatableObject(initial_x,initial_y,initial_radius);
	a.motion = 'linger';
	a.active = true;

	a.draw = function(){
		ctx.save();
		ctx.beginPath();

		if (a.active) {
			ctx.fillStyle = a.property.fillColor;
		}else{
			ctx.fillStyle = a.property.strokeColor;
		}
		

		ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
		ctx.fill();

		ctx.restore();
	}

	a.linger = function (){
		//move
		a.coordinate.x += a.coordinate.dx;
		a.coordinate.y += a.coordinate.dy;

		//bounce
		if (a.coordinate.x<=a.property.radius) {
			a.coordinate.x = a.property.radius;
			a.coordinate.dx = a.coordinate.dx * -1;
		}
		if (a.coordinate.x>=canvas.width-a.property.radius){
			a.coordinate.x = canvas.width-a.property.radius;
			a.coordinate.dx = a.coordinate.dx * -1;
		}
		if (a.coordinate.y<=a.property.radius) {
			a.coordinate.y = a.property.radius;
			a.coordinate.dy = a.coordinate.dy * -1;
		}
		if (a.coordinate.y>=canvas.height-a.property.radius) {
			a.coordinate.y = canvas.height-a.property.radius;
			a.coordinate.dy = a.coordinate.dy * -1;
		}
	}

	a.freeFall = function (){
				//move
		a.coordinate.x += a.coordinate.dx;
		a.coordinate.y += a.coordinate.dy;

		a.coordinate.dx *= 0.99;
		a.coordinate.dy = (a.coordinate.dy)*0.99;
		

		//bounce
		if (a.coordinate.x<=a.property.radius) {
			a.coordinate.x = a.property.radius;
			a.coordinate.dx = a.coordinate.dx * -1;
		}
		if (a.coordinate.x>=canvas.width-a.property.radius){
			a.coordinate.x = canvas.width-a.property.radius;
			a.coordinate.dx = a.coordinate.dx * -1;
		}
		if (a.coordinate.y<=a.property.radius) {
			a.coordinate.y = a.property.radius;
			a.coordinate.dy = a.coordinate.dy * -1;
		}
		if (a.coordinate.y>=canvas.height-a.property.radius) {
			a.coordinate.y = canvas.height-a.property.radius;
			a.coordinate.dy = a.coordinate.dy * -1;
		}

	}

	a.stop = function(){
		// stay
	}

	return a
}
	


//subClass of createAnimatableObject
function createShrinkingDot(initial_x=100,initial_y=100,initial_radius=10){
	let a = createAnimatableObject(initial_x,initial_y,initial_radius);
	a.motion = 'enter';

	a.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.property.fillColor;

		ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
		ctx.fill();

		ctx.restore();
	}

	a.linger = function (){
		// if monitoringObject collide with it, change motion to exit
		a.monitoringObjects.forEach((obj)=>{
			let _x = obj.coordinate.x - a.coordinate.x;
			let _y = obj.coordinate.y - a.coordinate.y;
			let dist = Math.pow(_x*_x+_y*_y,0.5);
			if (dist<=a.property.radius+obj.property.radius) {
				a.motion = 'exit';
			}
		});
	}

	a.exit = function(){
		a.property.radius *= 0.97;
		if (a.property.radius <= 1) {
			a.motion = 'enter';
		}
	}

	a.enter = function(){
		a.timer.counter ++;
		a.property.radius = initial_radius*(a.timer.counter/a.timer.duration);
		if (a.property.radius >= initial_radius) {
			a.motion = 'linger';
			a.timer.counter = 0;
		}
	}

	return a
}

//subClass of createAnimatableObject
function createScatteringDot(initial_x=100,initial_y=100,initial_radius=10){
	let a = createAnimatableObject(initial_x,initial_y,initial_radius);
	a.motion = 'enter';

	a.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = a.property.fillColor;

		ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
		ctx.fill();

		ctx.restore();
	}

	a.linger = function (){
		// if monitoringObject collide with it, change motion to exit
		a.monitoringObjects.forEach((obj)=>{
			let _x = obj.coordinate.x - a.coordinate.x;
			let _y = obj.coordinate.y - a.coordinate.y;
			let dist = Math.pow(_x*_x+_y*_y,0.5);
			if (dist<=a.property.radius+obj.property.radius) {
				a.motion = 'exit';
				let angle = Math.random()*Math.PI*2;
				a.coordinate.dx = Math.cos(angle);
				a.coordinate.dy = Math.sin(angle);
			}
		});
	}

	a.exit = function(){
		a.coordinate.x += a.coordinate.dx;
		a.coordinate.y += a.coordinate.dy;

		a.timer.counter ++;
		if (a.timer.counter >= a.timer.duration) {
			a.timer.counter = 0;
			a.coordinate.x = initial_x;
			a.coordinate.y = initial_y;
			a.property.radius = 0;
			a.motion = 'enter';
		}
	}

	a.enter = function(){
		a.timer.counter ++;
		a.property.radius = initial_radius*(a.timer.counter/a.timer.duration);
		if (a.property.radius >= initial_radius) {
			a.motion = 'linger';
			a.timer.counter = 0;
		}
	}

	return a
}

//subClass of createAnimatableObject
function createAntiGravityDot(initial_x=100,initial_y=100,initial_radius=10){
	let a = createAnimatableObject(initial_x,initial_y,initial_radius);
	a.motion = 'linger';

	a.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = a.property.fillColor;

		ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
		ctx.fill();

		ctx.restore();
	}

	a.linger = function (){
		// if monitoringObject collide with it, change motion to exit

		a.monitoringObjects.forEach((obj)=>{

			let _x = initial_x - obj.coordinate.x;
			let _y = initial_y - obj.coordinate.y;
			let dist = Math.pow(_x*_x+_y*_y,0.5);


			// normalized vector
			a.coordinate.dx = _x/(dist+0.000001);
			a.coordinate.dy = _y/(dist+0.000001);

			let gravity_dist = obj.property.radius*obj.property.radius;

			if (dist<=gravity_dist) {
				a.coordinate.x += a.coordinate.dx;
				a.coordinate.y += a.coordinate.dy;
			}else {
				a.coordinate.dx = (initial_x - a.coordinate.x)/10;
				a.coordinate.dy = (initial_y - a.coordinate.y)/10;
				a.coordinate.x += a.coordinate.dx;
				a.coordinate.y += a.coordinate.dy;
			}
		});

	}

	a.exit = function(){
		
	}

	a.enter = function(){

	}

	return a
}

//subClass of createAnimatableObject
function createGravityDot(initial_x=100,initial_y=100,initial_radius=10){
	let a = createAnimatableObject(initial_x,initial_y,initial_radius);
	a.motion = 'linger';

	a.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = a.property.fillColor;

		ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
		ctx.fill();

		ctx.restore();
	}

	a.linger = function (){
		// if monitoringObject collide with it, change motion to exit


		a.monitoringObjects.forEach((obj)=>{

			// let _x = initial_x - obj.coordinate.x;
			// let _y = initial_y - obj.coordinate.y;
			let _x = a.coordinate.x - obj.coordinate.x;
			let _y = a.coordinate.y - obj.coordinate.y;
			let dist = Math.pow(_x*_x+_y*_y,0.5);


			// normalized vector
			a.coordinate.dx = 2*_x/(dist+0.000001);
			a.coordinate.dy = 2*_y/(dist+0.000001);

			let gravity_dist = obj.property.radius*obj.property.radius;
			let ix = (initial_x - obj.coordinate.x);
			let iy = (initial_y - obj.coordinate.y);
			let release_dist = Math.pow(ix*ix+iy*iy,0.5);


			if (release_dist<=gravity_dist && release_dist >= obj.property.radius) {
				a.coordinate.x -= a.coordinate.dx;
				a.coordinate.y -= a.coordinate.dy;
			}else {
				a.coordinate.dx = (initial_x - a.coordinate.x)/10;
				a.coordinate.dy = (initial_y - a.coordinate.y)/10;
				a.coordinate.x += a.coordinate.dx;
				a.coordinate.y += a.coordinate.dy;
			}
		});

	}

	a.exit = function(){
		
	}

	a.enter = function(){

	}

	return a
}

//subClass of createAnimatableObject
function createMagneticDot(initial_x=100,initial_y=100,initial_radius=10){
	let a = createAnimatableObject(initial_x,initial_y,initial_radius);
	a.motion = 'linger';

	a.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = a.property.fillColor;

		ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
		ctx.fill();

		ctx.restore();
	}

	a.linger = function (){
		// if monitoringObject collide with it, change motion to exit
		a.monitoringObjects.forEach((obj)=>{
			if (obj.active === true) {

				// let _x = initial_x - obj.coordinate.x;
				// let _y = initial_y - obj.coordinate.y;
				let _x = a.coordinate.x - obj.coordinate.x;
				let _y = a.coordinate.y - obj.coordinate.y;
				let dist = Math.pow(_x*_x+_y*_y,0.5);


				// normalized vector
				a.coordinate.dx = 2*_x/(dist+0.000001);
				a.coordinate.dy = 2*_y/(dist+0.000001);

				let gravity_dist = obj.property.radius*obj.property.radius;
				let ix = (a.coordinate.x - obj.coordinate.x);
				let iy = (a.coordinate.y - obj.coordinate.y);
				let release_dist = Math.pow(ix*ix+iy*iy,0.5);


				if (release_dist<=gravity_dist && release_dist >= obj.property.radius) {
					a.coordinate.x -= a.coordinate.dx;
					a.coordinate.y -= a.coordinate.dy;
				}else {
					a.coordinate.dx = (initial_x - a.coordinate.x)/10;
					a.coordinate.dy = (initial_y - a.coordinate.y)/10;
					a.coordinate.x += a.coordinate.dx;
					a.coordinate.y += a.coordinate.dy;
				}

			}else{
				a.coordinate.dx = (initial_x - a.coordinate.x)/10;
				a.coordinate.dy = (initial_y - a.coordinate.y)/10;
				a.coordinate.x += a.coordinate.dx;
				a.coordinate.y += a.coordinate.dy;
			}	
		});

	}

	a.exit = function(){
		
	}

	a.enter = function(){

	}

	return a
}

//subClass of createAnimatableObject
function createEmittingDot(initial_x=100,initial_y=100,initial_radius=10){
	let a = createAnimatableObject(initial_x,initial_y,initial_radius);
	a.motion = 'initialize';

	a.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = a.property.fillColor;
		ctx.strokeStyle = a.property.strokeColor;
		ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
		ctx.fill();
		ctx.restore();
	}

	a.initialize = function(){
		let obj = a.monitoringObjects[0];
		a.coordinate.x = obj.coordinate.x;
		a.coordinate.y = obj.coordinate.y;  

		if(obj.active){
			if (a.timer.counter<=a.timer.duration) {
				a.timer.counter++;
			}else {
				a.motion = 'enter';
				a.timer.counter = 0;
			}
		}
	}

	a.enter = function(){
		a.coordinate.dx = (initial_x - a.coordinate.x)/100;
		a.coordinate.dy = (initial_y - a.coordinate.y)/100;
		a.coordinate.x += a.coordinate.dx;
		a.coordinate.y += a.coordinate.dy;

		let _x = initial_x - a.coordinate.x;
		let _y = initial_y - a.coordinate.y;
		let dist = Math.pow(_x*_x+_y*_y,0.5);

		if (dist <= 1) {
			a.coordinate.x = initial_x;
			a.coordinate.y = initial_y;
			a.motion = 'linger';
			a.timer.counter=0;
		}
	}

	a.linger = function (){
		//if monitoringObject[0] collide with it, change motion to exit
		let obj = a.monitoringObjects[0];

		if (obj.active === true) {

			// let _x = initial_x - obj.coordinate.x;
			// let _y = initial_y - obj.coordinate.y;
			let _x = a.coordinate.x - obj.coordinate.x;
			let _y = a.coordinate.y - obj.coordinate.y;
			let dist = Math.pow(_x*_x+_y*_y,0.5);


			// normalized vector
			a.coordinate.dx = 2*_x/(dist+0.000001);
			a.coordinate.dy = 2*_y/(dist+0.000001);

			let gravity_dist = obj.property.radius*obj.property.radius;
			let ix = (a.coordinate.x - obj.coordinate.x);
			let iy = (a.coordinate.y - obj.coordinate.y);
			let release_dist = Math.pow(ix*ix+iy*iy,0.5);


			if (release_dist<=gravity_dist && release_dist >= obj.property.radius) {
				a.coordinate.x -= a.coordinate.dx;
				a.coordinate.y -= a.coordinate.dy;
			}else {
				a.coordinate.dx = (initial_x - a.coordinate.x)/10;
				a.coordinate.dy = (initial_y - a.coordinate.y)/10;
				a.coordinate.x += a.coordinate.dx;
				a.coordinate.y += a.coordinate.dy;
			}

		}else{
			a.coordinate.dx = (initial_x - a.coordinate.x)/30;
			a.coordinate.dy = (initial_y - a.coordinate.y)/30;
			a.coordinate.x += a.coordinate.dx;
			a.coordinate.y += a.coordinate.dy;
		}	
	}

	a.exit = function(){

	}

	return a
}

//subClass of createAnimatableObject
function createLinkingDot(initial_x=100,initial_y=100,initial_radius=10){
	let a = createAnimatableObject(initial_x,initial_y,initial_radius);
	a.motion = 'linger';

	a.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = a.property.fillColor;
		ctx.strokeStyle = a.property.strokeColor;

		a.monitoringObjects.forEach((obj,i)=>{
			if (i===0) {return}
			if (!obj.coordinate) {return}
			ctx.moveTo(a.coordinate.x,a.coordinate.y);
			ctx.lineTo(obj.coordinate.x,obj.coordinate.y);
			ctx.stroke();
		})

		ctx.beginPath();
		ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
		ctx.fill();
		ctx.restore();
	}

	a.linger = function (){
		
		let obj = a.monitoringObjects[0];
		let _x = a.coordinate.x - obj.coordinate.x;
		let _y = a.coordinate.y - obj.coordinate.y;
		let dist = Math.pow(_x*_x+_y*_y,0.5);

		let ix = (initial_x - obj.coordinate.x);
		let iy = (initial_y - obj.coordinate.y);
		let ini_dist = Math.pow(ix*ix+iy*iy,0.5);


		// normalized vector
		a.coordinate.dx = ix/(dist+0.000001);
		a.coordinate.dy = iy/(dist+0.000001);

		let gravity_dist = obj.property.radius*obj.property.radius;


		let final_x = initial_x + ix*(gravity_dist-ini_dist)*0.01;
		let final_y = initial_y + iy*(gravity_dist-ini_dist)*0.01;


		if (dist<=gravity_dist) {
			a.coordinate.x = final_x;
			a.coordinate.y = final_y;
		}else {
			a.coordinate.dx = (initial_x - a.coordinate.x)/10;
			a.coordinate.dy = (initial_y - a.coordinate.y)/10;
			a.coordinate.x += a.coordinate.dx;
			a.coordinate.y += a.coordinate.dy;
		}
		

	}

	return a
}


function createTextPointset(text='canvas',x=0,y=200,interval=5){

	clearAll();
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = 'rgba(0,0,0,0.3)';
	ctx.strokeStyle = 'rgba(0,0,0,0.3)';
	ctx.font = 'bold 250px serif';

	ctx.fillText(text,x,y);

	let pt_ar = [];

	for (let i=0;i<canvas.width;i=i+interval) {
		for(let j=0;j<canvas.height;j=j+interval){
			let pt = {
				x: i,
				y: j
			}
			if (ctx.getImageData(i,j,1,1).data[3] != 0){
				pt_ar.push(pt);
			}
		}
	}

	clearAll();
	ctx.restore();
	return pt_ar
}

function createTextMap(text='canvas',x=canvas.width/2,y=canvas.height/2,interval=5, rowBase = true){

	clearAll();
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = 'rgba(0,0,0,0.3)';
	ctx.strokeStyle = 'rgba(0,0,0,0.3)';
	ctx.font = 'bold 250px serif';

	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';

	ctx.fillText(text,x,y);

	let map = [];

	if (rowBase) {
		for(let i=0; i<canvas.width/interval;i++){
			for(let j=0; j<canvas.height/interval;j++){
				if (!map[j]) {map[j]=[]}
				if (ctx.getImageData(i*interval,j*interval,1,1).data[3] != 0){
					map[j][i] = true;
				}
			}
		}
	}else{
		for(let j=0; j<canvas.height/interval;j++){
			for(let i=0; i<canvas.width/interval;i++){
				if (!map[i]) {map[i]=[]}
				if (ctx.getImageData(i*interval,j*interval,1,1).data[3] != 0){
					map[i][j] = true;
				}
			}
		}
	}
	

	clearAll();
	ctx.restore();
	
	return {
		map: map,
		scaleFactor: interval
	}
}






const bouncingBall = createBouncingBall(canvas.width/2,20);
bouncingBall.property.fillColor = 'rgba(180,0,0,0.3)';
bouncingBall.property.strokeColor = 'rgba(0,0,180,0.3)';
animationLayer.addAnimatableObject(bouncingBall);

canvas.addEventListener('mousedown',(e)=>{
	bouncingBall.active = !bouncingBall.active; 
})
canvas.addEventListener('mousemove',(e)=>{
	bouncingBall.coordinate.x = e.layerX;
	bouncingBall.coordinate.y = e.layerY;
	bouncingBall.motion = 'stop';	
})
canvas.addEventListener('mouseleave',(e)=>{
	bouncingBall.motion = 'linger';
})

// doubleLinkText_demo();
function doubleLinkText_demo(){

	const dotStack = [];

	let interval = 5;

	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = 'rgba(0,0,0,0.3)';
	ctx.strokeStyle = 'rgba(0,0,0,0.3)';
	ctx.font = 'bold 250px serif';
	ctx.fillText('canvas',0,200);
	

	for(let i=0; i<canvas.width/interval;i++){
		for(let j=0; j<canvas.height/interval;j++){

			if (!dotStack[j]) {dotStack[j]=[]}

			if (ctx.getImageData(i*interval,j*interval,1,1).data[3] === 0){
				
			}else {
				let linkingDot = createLinkingDot(i*interval,j*interval,2);
				linkingDot.property.fillColor = 'rgba(0,0,0,0.3)';
				linkingDot.property.strokeColor = 'rgba(0,0,0,0.1)';
				linkingDot.monitoringObjects.push(bouncingBall);

				dotStack[j][i] = linkingDot;

				if (dotStack[j][i-1]) {
					linkingDot.monitoringObjects.push(dotStack[j][i-1]);
				}
				if (dotStack[j-1] && dotStack[j-1][i]) {
					linkingDot.monitoringObjects.push(dotStack[j-1][i]);
				}

				animationLayer.addAnimatableObject(linkingDot);
			}
		}
	}

	clearAll();
	ctx.restore();

	animationLayer.start();	
}

// singleLinkText_demo();
function singleLinkText_demo(){
	const dotStack = [];
	const pt_ar = createTextPointset(undefined,undefined,undefined,5);
	pt_ar.forEach((pt)=>{
		let linkingDot = createLinkingDot(pt.x,pt.y,2);
		linkingDot.property.fillColor = 'rgba(0,0,0,0.1)';
		linkingDot.property.strokeColor = 'rgba(0,0,0,0.05)';
		linkingDot.monitoringObjects.push(bouncingBall);

		if (dotStack.length!=0) {
			linkingDot.monitoringObjects.push(dotStack.pop());
		}
		dotStack.push(linkingDot);

		animationLayer.addAnimatableObject(linkingDot);
	})
	animationLayer.start();
}

function emittingText_demo(){
	const pt_ar = createTextPointset(undefined,undefined,undefined,5);

	bouncingBall.active = false;
	bouncingBall.coordinate.dx = 0;
	bouncingBall.coordinate.dy = 0;
	bouncingBall.coordinate.x = canvas.width/2;
	bouncingBall.coordinate.y = canvas.height/2;

	let delayShift;

	pt_ar.forEach((pt)=>{
		let emittingDot = createEmittingDot(pt.x,pt.y,2); // set target point
		emittingDot.coordinate.x = bouncingBall.coordinate.x;
		emittingDot.coordinate.y = bouncingBall.coordinate.y; //set entering point

		if (!delayShift) {delayShift=pt.x+pt.y}
		emittingDot.timer.duration = (pt.x+pt.y-delayShift)/2; //set dalay
		emittingDot.property.fillColor = 'rgba(0,0,0,0.2)';
		emittingDot.property.strokeColor = 'rgba(0,0,0,0.1)';
		emittingDot.monitoringObjects.push(bouncingBall);

		animationLayer.addAnimatableObject(emittingDot);
	})
	animationLayer.start();
}
// emittingText_demo();

function magneticText_demo(){
	const pt_ar = createTextPointset(undefined,undefined,undefined,5);
	pt_ar.forEach((pt)=>{
		let magneticDot = createMagneticDot(pt.x,pt.y,2);
		magneticDot.property.fillColor = 'rgba(0,0,0,0.2)';
		magneticDot.monitoringObjects.push(bouncingBall);
		animationLayer.addAnimatableObject(magneticDot);
	})
	animationLayer.start();
}

function gravityText_demo(){

	const pt_ar = createTextPointset(undefined,undefined,undefined,5);
	pt_ar.forEach((pt)=>{
		let gravityDot = createGravityDot(pt.x,pt.y,2);
		gravityDot.property.fillColor = 'rgba(0,0,0,0.2)';
		gravityDot.monitoringObjects.push(bouncingBall);
		animationLayer.addAnimatableObject(gravityDot);
	})
	animationLayer.start();
}

function antiGravityText_demo(){

	const pt_ar = createTextPointset(undefined,undefined,undefined,5);
	pt_ar.forEach((pt)=>{
		let antiGravityDot = createAntiGravityDot(pt.x,pt.y,2);
		antiGravityDot.property.fillColor = 'rgba(0,0,0,0.2)';
		antiGravityDot.monitoringObjects.push(bouncingBall);
		animationLayer.addAnimatableObject(antiGravityDot);
	})
	animationLayer.start();
}

function shrinkingText_demo(){

	const pt_ar = createTextPointset(undefined,undefined,undefined,5);
	pt_ar.forEach((pt)=>{
		let shrinkingDot = createShrinkingDot(pt.x,pt.y,2);
		shrinkingDot.property.fillColor = 'rgba(0,0,0,0.2)';
		shrinkingDot.monitoringObjects.push(bouncingBall);
		animationLayer.addAnimatableObject(shrinkingDot);
	})
	animationLayer.start();
}

function scatteringText_demo(){

	const pt_ar = createTextPointset(undefined,undefined,undefined,5);
	pt_ar.forEach((pt)=>{
		let scatteringDot = createScatteringDot(pt.x,pt.y,2);
		scatteringDot.property.fillColor = 'rgba(0,0,0,0.2)';
		scatteringDot.monitoringObjects.push(bouncingBall);
		animationLayer.addAnimatableObject(scatteringDot);
	})
	animationLayer.start();
}




function gravityBall_in_web_demo(){

	const dotStack = []

	for(let i=0; i<30;i++){
		for(let j=0; j<10;j++){

			if (!dotStack[j]) {dotStack[j]=[]}

			let linkingDot = createLinkingDot(i*20+20,j*20+20,2);
			linkingDot.property.fillColor = 'rgba(0,0,0,0.05)';
			linkingDot.property.strokeColor = 'rgba(0,0,0,0.02)';
			
			dotStack[j].push(linkingDot);

			linkingDot.monitoringObjects.push(bouncingBall);

			if (dotStack[j][i-1]) {
				linkingDot.monitoringObjects.push(dotStack[j][i-1])
			}
			if (dotStack[j-1] && dotStack[j-1][i]) {
				linkingDot.monitoringObjects.push(dotStack[j-1][i])
			}			
			animationLayer.addAnimatableObject(linkingDot);
		}
	}
}


// pt1,pt2 -> line
function pointToLine(pt0,pt1,pt2){
	let d1 = pointToPoint(pt0,pt1);
	let d2 = pointToPoint(pt0,pt2);
	// let d3 = 
}

function pointToPoint(pt1,pt2){
	return Math.pow((pt1.x-pt2.x)*(pt1.x-pt2.x)+(pt1.y-pt2.y)*(pt1.y-pt2.y),0.5)
}

function thirdLength(x,y){
	return Math.pow(x*x+y*y,0.5)
}


text_animation();
function text_animation(text = 'Text', draw = draw_dot , enter = enter_random, linger = linger_ball, reEnter = enter, options = {}){
	animationLayer.clear();
	animationLayer.addAnimatableObject(bouncingBall);

	const textMap = createTextMap(text); // using default setting
	const map = textMap.map;
	const scaleFactor = textMap.scaleFactor;

// set draw function
	let beginningIndex; // for enter_emit_diag
	map.forEach((col,colIndex)=>{
		col.forEach((row,rowIndex)=>{
			let a = createAnimatableObject(rowIndex*scaleFactor,colIndex*scaleFactor,2);
			a.monitoringObjects.push(bouncingBall);
			map[colIndex][rowIndex] = a;
			if (!beginningIndex) {beginningIndex = rowIndex + colIndex}
			if (rowIndex + colIndex < beginningIndex) { beginningIndex = rowIndex + colIndex}

			if (draw === draw_thread_row) {
				a.monitoringObjects.push(animationLayer.animatedObjects[animationLayer.animatedObjects.length-1]);
			}

			if (draw === draw_thread_col) {
				let i=rowIndex,j=colIndex-1;
				while (j>=0) {
					if(map[j][i]){
						a.monitoringObjects.push(map[j][i]);
						break;
					}else {
						j--;
					}
				}	
			}

			if (draw === draw_thread_web) {
				if (map[colIndex][rowIndex-1]) {
					a.monitoringObjects.push(map[colIndex][rowIndex-1]);
				}
				if (map[colIndex-1][rowIndex]) {
					a.monitoringObjects.push(map[colIndex-1][rowIndex]);
				}
			}

			animationLayer.addAnimatableObject(a);

			a.draw = draw;
		})
	})

// set enter function
	let firstColIndex; // for enter_emit_row
	map.forEach((col,colIndex)=>{ 
		if (Boolean(map[colIndex].join('')) && !firstColIndex) {
			firstColIndex = colIndex;
		}
		col.forEach((row,rowIndex)=>{
			let a = map[colIndex][rowIndex];

			if (enter === enter_zoom) {
				a.coordinate.x = canvas.width/2;
				a.coordinate.y = canvas.height/2;
			}

			if (enter === enter_emit_row) {
				a.coordinate.x = bouncingBall.coordinate.x; 
				a.coordinate.y = bouncingBall.coordinate.y; 
				a.timer.delay = (colIndex - firstColIndex)*10;
			}

			if (enter === enter_emit_diag) {
				a.coordinate.x = bouncingBall.coordinate.x; 
				a.coordinate.y = bouncingBall.coordinate.y; 
				a.timer.delay = (a.coordinate.target_x + a.coordinate.target_y - beginningIndex*scaleFactor);
			}

			if (enter === enter_random) {
				let angle = Math.PI*2*Math.random();
				let R = canvas.width*canvas.height*Math.random()/3;
				a.coordinate.x = R*Math.cos(angle);
				a.coordinate.y = R*Math.sin(angle);				
			}

			a.enter = enter;
		})
	})

// set linger function
	map.forEach((col,colIndex)=>{
		col.forEach((row,rowIndex)=>{
			let a = map[colIndex][rowIndex];
			a.linger = linger;
		})
	})

// set reEnter function
	map.forEach((col,colIndex)=>{
		col.forEach((row,rowIndex)=>{
			let a = map[colIndex][rowIndex];
			a.reEnter = reEnter;
		})
	})

// start animation
	animationLayer.start();
}





function linger_ball(){ // this is a v=0 animation, will not follow by a 'reEnter' motion
	let a = this;
	let obj = a.monitoringObjects[0];
	let _x = a.coordinate.x - obj.coordinate.x;
	let _y = a.coordinate.y - obj.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);

	let ix = (a.coordinate.target_x - obj.coordinate.x);
	let iy = (a.coordinate.target_y - obj.coordinate.y);
	let ini_dist = Math.pow(ix*ix+iy*iy,0.5);


	// normalized vector
	a.coordinate.dx = ix/(dist+0.000001);
	a.coordinate.dy = iy/(dist+0.000001);

	let gravity_dist = obj.property.radius*obj.property.radius;


	let final_x = a.coordinate.target_x + ix*(gravity_dist-ini_dist)*0.01;
	let final_y = a.coordinate.target_y + iy*(gravity_dist-ini_dist)*0.01;


	if (dist<=gravity_dist) {
		a.coordinate.x = final_x;
		a.coordinate.y = final_y;
	}else {
		a.coordinate.x = a.coordinate.target_x;
		a.coordinate.y = a.coordinate.target_y;
	}
}
function linger_gravity(){

	let obj = this.monitoringObjects[0];
	let _x = this.coordinate.x - obj.coordinate.x;
	let _y = this.coordinate.y - obj.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);

	// normalized vector
	this.coordinate.dx = _x/(dist+0.000001);
	this.coordinate.dy = _y/(dist+0.000001);

	let gravity_dist = obj.property.radius*obj.property.radius;
	let ix = (this.coordinate.target_x - obj.coordinate.x);
	let iy = (this.coordinate.target_y - obj.coordinate.y);
	let release_dist = Math.pow(ix*ix+iy*iy,0.5);

	if (release_dist<=gravity_dist && release_dist >= obj.property.radius) {
		this.coordinate.x -= this.coordinate.dx;
		this.coordinate.y -= this.coordinate.dy;
	}else {
		this.motion = 'reEnter';
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
	}
}
function linger_magnetic(){

	let a = this;
	let obj = a.monitoringObjects[0];

	let _x = a.coordinate.x - obj.coordinate.x;
	let _y = a.coordinate.y - obj.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);


	// normalized vector
	a.coordinate.dx = 2*_x/(dist+0.000001);
	a.coordinate.dy = 2*_y/(dist+0.000001);

	let gravity_dist = obj.property.radius*obj.property.radius;
	let ix = (a.coordinate.x - obj.coordinate.x);
	let iy = (a.coordinate.y - obj.coordinate.y);
	let release_dist = Math.pow(ix*ix+iy*iy,0.5);


	if (release_dist<=gravity_dist && release_dist >= obj.property.radius) {
		a.coordinate.x -= a.coordinate.dx;
		a.coordinate.y -= a.coordinate.dy;
		a.timer.counter++;
	}else if(release_dist<=gravity_dist){
		a.coordinate.dx = (a.coordinate.target_x - a.coordinate.x)/10;
		a.coordinate.dy = (a.coordinate.target_y - a.coordinate.y)/10;
		a.coordinate.x += a.coordinate.dx;
		a.coordinate.y += a.coordinate.dy;
	}else if(release_dist > gravity_dist && a.timer.counter != 0){
		a.coordinate.dx = 0;
		a.coordinate.dy = 0;
		a.timer.counter = 0;
		a.motion = 'reEnter';
	}
}
function linger_antiGravity(){

	let obj = this.monitoringObjects[0];
	let _x = this.coordinate.target_x - obj.coordinate.x;
	let _y = this.coordinate.target_y - obj.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);


	// normalized vector
	this.coordinate.dx = _x/(dist+0.000001);
	this.coordinate.dy = _y/(dist+0.000001);

	let gravity_dist = obj.property.radius*obj.property.radius;

	if (dist<=gravity_dist) {
		this.coordinate.x += this.coordinate.dx;
		this.coordinate.y += this.coordinate.dy;
	}else {
		this.motion = 'reEnter';
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
	}
}
function linger_scatter(){

	let obj =  this.monitoringObjects[0]
	let _x = obj.coordinate.x - this.coordinate.x;
	let _y = obj.coordinate.y - this.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);

	if (dist<=this.property.radius+obj.property.radius && this.timer.counter===0) {
		let angle = Math.random()*Math.PI*2;
		this.coordinate.dx = Math.cos(angle);
		this.coordinate.dy = Math.sin(angle);
		this.timer.counter ++;
	}else if(this.timer.counter != 0){
		this.coordinate.x += this.coordinate.dx;
		this.coordinate.y += this.coordinate.dy;
		this.timer.counter ++;
		if (this.timer.counter >= this.timer.duration) {
			this.timer.counter = 0;
			this.coordinate.dx = 0;
			this.coordinate.dy = 0;
			this.motion = 'reEnter';
		}
	}
}
function linger_fall(){
	let obj =  this.monitoringObjects[0]
	let _x = obj.coordinate.x - this.coordinate.x;
	let _y = obj.coordinate.y - this.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);

	if (dist<=this.property.radius+obj.property.radius && this.timer.counter === 0) {
		this.coordinate.dy = 1;
		this.timer.counter++;
	}else if (this.timer.counter != 0){
		this.coordinate.x += this.coordinate.dx;
		this.coordinate.y += this.coordinate.dy;
		this.timer.counter++;
		if (this.timer.counter >= this.timer.duration) {
			this.timer.counter = 0;
			this.coordinate.dy = 0;
			this.motion = 'reEnter';
		}
	}
}
function linger_shrink(){
	let obj = this.monitoringObjects[0];
	let _x = obj.coordinate.x - this.coordinate.x;
	let _y = obj.coordinate.y - this.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);
	if (dist<=this.property.radius+obj.property.radius) {
		this.property.radius *= 0.9;
		if (this.property.radius <= 0.1) {
			this.property.radius = 0.1;
		}
	}else if (this.property.radius<=this.property.r0) {
		this.property.radius *= 1.03;
	}
}



function enter_random(){
	
	let _x = this.coordinate.target_x - this.coordinate.x;
	let _y = this.coordinate.target_y - this.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);

	this.coordinate.dx = (this.coordinate.target_x - this.coordinate.x)/10;
	this.coordinate.dy = (this.coordinate.target_y - this.coordinate.y)/10;
	this.coordinate.x += this.coordinate.dx;
	this.coordinate.y += this.coordinate.dy;
	if (dist <= 0.3) {
		this.coordinate.x = this.coordinate.target_x;
		this.coordinate.y = this.coordinate.target_y;
		this.motion = 'linger';
		this.timer.counter = 0;
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
	}
}
function enter_emit_diag(){

	if (this.timer.counter <= this.timer.delay) {
		this.timer.counter++;
		this.coordinate.x = bouncingBall.coordinate.x;
		this.coordinate.y = bouncingBall.coordinate.y; 
		return
	}

	let _x = this.coordinate.target_x - this.coordinate.x;
	let _y = this.coordinate.target_y - this.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);

	this.coordinate.dx = (this.coordinate.target_x - this.coordinate.x)/100;
	this.coordinate.dy = (this.coordinate.target_y - this.coordinate.y)/100;
	this.coordinate.x += this.coordinate.dx;
	this.coordinate.y += this.coordinate.dy;
	if (dist <= 0.3) {
		this.coordinate.x = this.coordinate.target_x;
		this.coordinate.y = this.coordinate.target_y;
		this.motion = 'linger';
		this.timer.counter = 0;
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
	}
}
function enter_emit_row(){

	if (this.timer.counter <= this.timer.delay) {
		this.timer.counter++;
		this.coordinate.x = bouncingBall.coordinate.x;
		this.coordinate.y = bouncingBall.coordinate.y; 
		return
	}

	let _x = this.coordinate.target_x - this.coordinate.x;
	let _y = this.coordinate.target_y - this.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);

	this.coordinate.dx = (this.coordinate.target_x - this.coordinate.x)/100;
	this.coordinate.dy = (this.coordinate.target_y - this.coordinate.y)/100;
	this.coordinate.x += this.coordinate.dx;
	this.coordinate.y += this.coordinate.dy;
	if (dist <= 0.3) {
		this.coordinate.x = this.coordinate.target_x;
		this.coordinate.y = this.coordinate.target_y;
		this.motion = 'linger';
		this.timer.counter = 0;
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
	}
}
function enter_expand(){
	this.timer.counter ++;
	this.coordinate.x = this.coordinate.target_x;
	this.coordinate.y = this.coordinate.target_y;
	this.property.radius = this.property.r0*(this.timer.counter/this.timer.duration);

	if (this.timer.counter>=this.timer.duration) {
		this.motion = 'linger';
		this.timer.counter = 0;
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
	}
}
function enter_zoom(){
	this.coordinate.dx = (this.coordinate.target_x - this.coordinate.x)/100;
	this.coordinate.dy = (this.coordinate.target_y - this.coordinate.y)/100;
	this.coordinate.x += this.coordinate.dx;
	this.coordinate.y += this.coordinate.dy;

	let _x = this.coordinate.target_x - this.coordinate.x;
	let _y = this.coordinate.target_y - this.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);


	
	if (this.timer.counter<this.timer.duration) {
		this.timer.counter ++;
	this.property.radius = this.property.r0*(this.timer.counter/this.timer.duration);
	}
	if (dist <= 0.3) {
		this.coordinate.x = this.coordinate.target_x;
		this.coordinate.y = this.coordinate.target_y;
		this.motion = 'linger';
		this.timer.counter = 0;
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
	}
}



function draw_dot(){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = this.property.fillColor;

	ctx.arc(this.coordinate.x,this.coordinate.y,this.property.radius,0,2*Math.PI);
	ctx.fill();

	ctx.restore();
}
function draw_thread_row(){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = this.property.fillColor;
	ctx.strokeStyle = this.property.strokeColor;

	this.monitoringObjects.forEach((obj,i)=>{
		if (i===0) {return}
		if (!obj.coordinate) {return}
		ctx.moveTo(this.coordinate.x,this.coordinate.y);
		ctx.lineTo(obj.coordinate.x,obj.coordinate.y);
		ctx.stroke();
	})

	ctx.beginPath();
	ctx.arc(this.coordinate.x,this.coordinate.y,this.property.radius,0,2*Math.PI);
	ctx.fill();
	ctx.restore();
}
function draw_thread_col(){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = this.property.fillColor;
	ctx.strokeStyle = this.property.strokeColor;

	this.monitoringObjects.forEach((obj,i)=>{
		if (i===0) {return}
		if (!obj.coordinate) {return}
		ctx.moveTo(this.coordinate.x,this.coordinate.y);
		ctx.lineTo(obj.coordinate.x,obj.coordinate.y);
		ctx.stroke();
	})

	ctx.beginPath();
	ctx.arc(this.coordinate.x,this.coordinate.y,this.property.radius,0,2*Math.PI);
	ctx.fill();
	ctx.restore();
}
function draw_thread_web(){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = this.property.fillColor;
	ctx.strokeStyle = this.property.strokeColor;

	this.monitoringObjects.forEach((obj,i)=>{
		if (i===0) {return}
		if (!obj.coordinate) {return}
		ctx.moveTo(this.coordinate.x,this.coordinate.y);
		ctx.lineTo(obj.coordinate.x,obj.coordinate.y);
		ctx.stroke();
	})

	ctx.beginPath();
	ctx.arc(this.coordinate.x,this.coordinate.y,this.property.radius,0,2*Math.PI);
	ctx.fill();
	ctx.restore();	
}








