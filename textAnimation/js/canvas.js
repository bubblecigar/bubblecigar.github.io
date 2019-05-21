
const canvas = document.querySelector('#canvas');

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
			lineWidth:1,
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
	if (animationLayer.on) {
		bouncingBall.active = false; 
		animationLayer.animate();
		animationLayer.stop();
	}else{
		bouncingBall.active = true;
		animationLayer.animate();
		animationLayer.start();
	}
})
canvas.addEventListener('mousemove',(e)=>{
	bouncingBall.coordinate.x = e.layerX;
	bouncingBall.coordinate.y = e.layerY;
	bouncingBall.motion = 'stop';	
})
canvas.addEventListener('mouseleave',(e)=>{
	bouncingBall.motion = 'linger';
})

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

function text_animation(text = 'Text', draw = draw_dot , enter = enter_expand, linger = linger_shrink, reEnter = enter_expand, dotSize = 2, lineWidth = 1, fillColor = 'black', strokeColor = 'black'){
	animationLayer.clear();
	animationLayer.addAnimatableObject(bouncingBall);
	bouncingBall.active = true;

	const textMap = createTextMap(text); // using default setting
	const map = textMap.map;
	const scaleFactor = textMap.scaleFactor;

// set draw function
	let beginningIndex; // for enter_emit_diag
	map.forEach((col,colIndex)=>{
		col.forEach((row,rowIndex)=>{
			let a = createAnimatableObject(rowIndex*scaleFactor,colIndex*scaleFactor,dotSize);
			a.property.lineWidth = lineWidth;
			a.property.fillColor = fillColor;
			a.property.strokeColor = strokeColor;

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
		this.timer.counter++;
	}else if(this.timer.counter != 0){
		this.motion = 'reEnter';
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
		this.timer.counter = 0;
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
		this.timer.counter++;
	}else if(this.timer.counter != 0){
		this.motion = 'reEnter';
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
		this.timer.counter = 0;
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

	let hold_dist = this.property.radius + obj.property.radius;

	if (dist <= hold_dist && this.timer.counter === 0) {
		this.coordinate.dy = 1;
		this.timer.counter++;
	}else if (this.timer.counter != 0){
		this.coordinate.x += this.coordinate.dx;
		this.coordinate.y += this.coordinate.dy;
		this.timer.counter++;
		if (this.timer.counter >= this.timer.duration) {
			this.timer.counter = 0;
			this.coordinate.dy = 0;
			this.coordinate.dx = 0;
			this.motion = 'reEnter';
		}
	}
}
function linger_shrink(){
	let obj = this.monitoringObjects[0];
	let _x = obj.coordinate.x - this.coordinate.x;
	let _y = obj.coordinate.y - this.coordinate.y;
	let dist = Math.pow(_x*_x+_y*_y,0.5);
	if (dist<=this.property.radius+obj.property.radius && this.timer.counter === 0) {
		this.property.radius *= 0.98;
		this.timer.counter++;
	}else if (this.timer.counter > 0) {
		this.property.radius *= 0.95;
		if (this.property.radius <= 0.1) {
			this.property.radius = 0.1;
			this.motion = 'reEnter';
			this.timer.counter = 0;
		}
	}
	// else if (this.property.radius<=this.property.r0) {
	// 	this.property.radius *= 1.03;
	// }
}



function enter_random(){
	
	if (this.property.radius != this.property.r0) {
		this.property.radius = this.property.r0;
	}

	let _x = this.coordinate.target_x - this.coordinate.x;
	let _y = this.coordinate.target_y - this.coordinate.y;
	

	this.coordinate.dx = (this.coordinate.target_x - this.coordinate.x)/10;
	this.coordinate.dy = (this.coordinate.target_y - this.coordinate.y)/10;
	this.coordinate.x += this.coordinate.dx;
	this.coordinate.y += this.coordinate.dy;

	let dist = Math.pow(_x*_x+_y*_y,0.5);
	if (dist <= 0.3) {
		this.coordinate.x = this.coordinate.target_x;
		this.coordinate.y = this.coordinate.target_y;
		this.timer.counter = 0;
		this.coordinate.dx = 0;
		this.coordinate.dy = 0;
		this.motion = 'linger';
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

	if (this.property.radius != this.property.r0) {
		this.property.radius = this.property.r0;
	}


	if (!this.timer.delay) {
		this.timer.delay = 1;
	}
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
	
	this.coordinate.x = this.coordinate.target_x;
	this.coordinate.y = this.coordinate.target_y;
	this.property.radius = this.property.r0*(this.timer.counter/this.timer.duration);
	this.timer.counter ++;

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
	ctx.lineWidth = this.property.lineWidth;
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
	ctx.lineWidth = this.property.lineWidth;
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
	ctx.lineWidth = this.property.lineWidth;
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



const vue = new Vue({
	el: '#panel',
	data:{
		text:'Text',
		dotSize:2,
		lineWidth: 1,
		fillColor:'black',
		strokeColor:'black',
		draw: draw_dot,
		enter: enter_expand,
		linger: linger_shrink,
		reEnter: enter_expand,

		menu1: true,
		menu2: true,
		menu3: true
	},
	methods:{
		setDraw: function(arg){
			this.draw = window[arg];
		},
		setEnter: function(arg){
			this.enter = window[arg];
		},
		setLinger: function(arg){
			this.linger = window[arg];
		},
		setReEnter: function(arg){
			this.reEnter = window[arg];
		},
		submit: function(){
			text_animation(this.text, this.draw, this.enter, this.linger, this.reEnter, this.dotSize, this.lineWidth, this.fillColor, this.strokeColor);
		},
		selectDraw: function(arg){
			if (this.draw===window[arg]) {
				return true
			}else{
				return false
			}
		},
		toggleMenu1: function(){
			this.menu1 = !this.menu1;
		},
		toggleMenu2: function(){
			this.menu2 = !this.menu2;
		},
		toggleMenu3: function(){
			this.menu3 = !this.menu3;
		}
	},
	computed:{
		selected_draw: function(){
			return this.draw.name
		},
		script: function(){
			return `
				&lt;<i class='red'>canvas</i> <i class='green'>id</i>=<i class='yellow'>'canvas'</i> <i class='green'>width</i>=<i class='yellow'>'700px'</i> <i class='green'>height</i>=<i class='yellow'>'300px'</i>>&lt;/<i class='red'>canvas</i>><br>
				&lt;<i class='red'>script</i> <i class='green'>src</i>=<i class='yellow'>'js/canvas.js'</i>> 
				<span>text_animation('${this.text}', ${this.draw.name}, ${this.enter.name}, ${this.linger.name}, ${this.reEnter.name}, ${this.dotSize}, ${this.lineWidth}, '${this.fillColor}', '${this.strokeColor}')</span>
				&lt;/<i class='red'>script</i>>
			`
		}
	}
});











