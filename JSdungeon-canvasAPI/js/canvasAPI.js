// DOM binding
	//mode
const ModeOptionsList = document.querySelectorAll('#options-mode li');
for (var i = ModeOptionsList.length - 1; i >= 0; i--) {
	ModeOptionsList[i].addEventListener('click',function(e){
		mode = this.id;
		this.parentNode.querySelector('.selected').classList.remove('selected');
		this.className = 'selected';
	},false)
}

let textStamp = '';
document.querySelector('#fillText').addEventListener('click',function(e){
		let panel = popInputPanel(e.pageX,e.pageY);
		panel.type = 'text';
		panel.style.width='100px';
		panel.placeholder = '輸入文字';
	}
,false);

	//style
document.querySelector('#fillStyle').addEventListener('click',()=>{
	property = 'fillStyle';
	popColorPatette();
},false);
document.querySelector('#strokeStyle').addEventListener('click',()=>{
	property = 'strokeStyle';
	popColorPatette();
},false);
document.querySelector('#shadeStyle').addEventListener('click',()=>{
	property = 'shadowColor';
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	popColorPatette();
},false);
document.querySelector('#lineWidth').addEventListener('click',function(e){
		let panel = popInputPanel(e.pageX,e.pageY);
		panel.type = 'number';
		panel.style.width='40px';
		panel.placeholder = '單位：px';
		panel.value = parseInt(ctx.lineWidth);
	}
,false);
document.querySelector('#setLineDash').addEventListener('click',function(e){
		let panel = popInputPanel(e.pageX,e.pageY);
		panel.type = 'number';
		panel.style.width='40px';
		panel.placeholder = '間隔：px';
		panel.value = !ctx.getLineDash()[0] ? 0 : ctx.getLineDash()[0];
	}
,false);

	//methods
document.querySelector('#clearAll').addEventListener('click',
	()=>{
		clearAll();
		recordImage();
},false);
document.querySelector('#undo').addEventListener('click',
	()=>{
		undoImage();
},false);
document.querySelector('#redo').addEventListener('click',
	()=>{
		redoImage();
},false);
document.querySelector('#downLoad').addEventListener('click',function(e){
	let url = canvas.toDataURL('image/png');
	this.href = url;
},false);



// dynamic DOM
function popInputPanel(x,y){
	let panel = document.querySelector("#input-panel");
	if (panel.className.includes('hide')) {
		panel.classList.remove('hide');
	}
	panel.style.left = x;
	panel.style.top = y;
	panel.focus();
	return panel
}
function hideInputPanel(){
	let panel = document.querySelector("#input-panel");
	if (!panel.className.includes('hide')) {
		panel.classList.add('hide');
	}
}
createInputPanel();
function createInputPanel(){
	let panel = document.createElement('input');
	panel.id = 'input-panel';
	panel.className = 'hide';
	document.querySelector('body').appendChild(panel);
	panel.addEventListener('blur',()=>{
		hideInputPanel();
		panel.value = '';
	},false)
	panel.addEventListener('keydown',(e)=>{
		console.log(e.target.value);
		if (e.key==='Enter') {
			if (e.target.type === 'text') {
				textStamp = e.target.value;
			}else if(e.target.type === 'number' && e.target.placeholder === '單位：px'){
				ctx.lineWidth = e.target.value;
				document.querySelector('#lineWidth').style.setProperty('--var',`'${e.target.value}px'`);
			}else{
				ctx.setLineDash([e.target.value,e.target.value]);
				document.querySelector('#setLineDash').style.setProperty('--var',`'${e.target.value}px'`);
			}
			panel.blur();
		}
	},false)
}


function popColorPatette(){
	let menu = document.querySelector('#menu');
	if (menu.className.includes('hide')) {
		menu.classList.remove('hide');
	}
	setTimeout(()=>{
		menu.focus();
	},1000);
}
function hideColorPalette(){
	let menu = document.querySelector('#menu');
	if (!menu.className.includes('hide')) {
		menu.classList.add('hide');
	}
}

let property = '';
let palette_ctx = createColorPalette();
function createColorPalette(){
	let menu = document.createElement('div');
	menu.innerHTML = `
		<i class="fas fa-caret-right" style='color:white'></i>
	`;
	menu.id = 'menu';
	menu.tabIndex = -1;
	menu.className = 'hide';
	let palette = document.createElement('canvas');
	palette.id='palette';
	palette.setAttribute('width','200px');
	palette.setAttribute('height','200px');
	menu.appendChild(palette);

	let c = palette.getContext('2d');
	c.globalCompositeOperation = 'lighten';

	// 黑白色條
	let linearGrad = c.createLinearGradient(10,0,190,0);
	linearGrad.addColorStop(0,'black');
	linearGrad.addColorStop(1,'white');
	c.fillStyle = linearGrad;
	c.fillRect(15,185,170,20);	
	// c.stroke();


	// RGB 色相環
	let center = createPt();
	center.x = 100;
	center.y = 90;
	let radius = 90;
	c.strokeStyle = 'rgba(0,0,0,0)';
	for(let i=0; i<12; i++){

		let rad1 = i*(Math.PI/6);
		let rad2 = (i+1)*(Math.PI/6);
		let color;
		let radialGrad = c.createRadialGradient(100,100,0,100,100,radius);

		switch (i) {
			case 0:
				color = `rgba(255,0,0`;
				break;
			case 1:
				color = `rgba(255,0,127`;
				break;
			case 2:
				color = `rgba(255,0,255`;
				break;
			case 3:
				color = `rgba(127,0,255`;
				break;
			case 4:
				color = `rgba(0,0,255`;
				break;
			case 5:
				color = `rgba(0,127,255`;
				break;
			case 6:
				color = `rgba(0,255,255`;
				break;
			case 7:
				color = `rgba(0,255,127`;
				break;
			case 8:
				color = `rgba(0,255,0`;
				break;
			case 9:
				color = `rgba(127,255,0`;
				break;
			case 10:
				color = `rgba(255,255,0`;
				break;
			case 11:
				color = `rgba(255,127,0`;
				break;
			default:
				// statements_def
				break;
		}
		radialGrad.addColorStop(1,color+',1)');
		radialGrad.addColorStop(0,color+',0)');
		
		c.fillStyle = radialGrad;

		c.beginPath();
		c.arc(center.x,center.y,radius,rad1,rad2);
		c.lineTo(center.x,center.y);
		c.closePath();
		c.fill();
		c.stroke();
	}

	palette.addEventListener('mousemove',function(e){
		let px = c.getImageData(e.offsetX,e.offsetY,1,1).data;
		let rgba = `rgba(${px[0]},${px[1]},${px[2]},${px[3]/255})`;
		// console.log(rgba);
		menu.style.color = rgba;
	},false)
	palette.addEventListener('click',function(e){
		let px = c.getImageData(e.offsetX,e.offsetY,1,1).data;
		let rgba = `rgba(${px[0]},${px[1]},${px[2]},${px[3]/255})`;
		console.log(property, rgba);
		if (property) {
			ctx[property] = rgba;
			if (property==='shadowColor') {
				document.getElementById('shadeStyle').style.setProperty('--var',rgba);
				document.getElementById('menu').style.setProperty('--var',rgba);
			}else{
				document.getElementById(property).style.setProperty('--var',rgba);
			}
		}
	},false)

	menu.querySelector("i.fa-caret-right").addEventListener('click',hideColorPalette,false);

	menu.addEventListener('blur',()=>{
		hideColorPalette();
	},false)

	document.querySelector('body').appendChild(menu);
}


//globle variables
function createPt(x,y){
	return {x:x,y:y}
}
const startPt = createPt();
const endPt = createPt();
const start_client = createPt();
const end_client = createPt();

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

//options
let mode;
mode = 'fillRect';
// mode = 'strokeRect';
// mode = 'clearRect';
// mode = 'straightLine';
// mode = 'strokeCircle';
// mode = 'fillCircle';
// mode = 'createShadowBall';
// mode = 'fillText';
// mode = 'drawImage';
// mode = 'createDynamicBall';
// mode = 'pencil';

// const modeList = ['fillRect','strokeRect','clearRect','straightLine','strokeCircle','fillCircle','createShadowBall','fillText','drawImage','createDynamicBall','pencil'];

// function selectMode(i){
// 	mode = modeList[i];
// }

// default setting
ctx.lineCap = 'round';
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;

let random_mode = false;
document.querySelector('#random').addEventListener('click',function(){
	random_mode = !random_mode;
	if (random_mode) {
		this.classList.add('selected');
	}else{
		this.classList.remove('selected');
	}
},false);

function rollAll(){
	rollColor();
	rollLineWidth();
}
function rollColor(){
	let r,g,b,a;
	r = Math.floor(Math.random()*255);
	g = Math.floor(Math.random()*255);
	b = Math.floor(Math.random()*255);
	a = Math.random();
	ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
	r = Math.floor(Math.random()*255);
	g = Math.floor(Math.random()*255);
	b = Math.floor(Math.random()*255);
	a = Math.random();
	ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
	r = Math.floor(Math.random()*255);
	g = Math.floor(Math.random()*255);
	b = Math.floor(Math.random()*255);
	a = Math.random();
	ctx.shadowColor = `rgba(${r},${g},${b},${a})`;

	document.querySelector('#fillStyle').style.setProperty('--var',ctx.fillStyle);
	document.querySelector('#strokeStyle').style.setProperty('--var',ctx.strokeStyle);
	document.querySelector('#shadeStyle').style.setProperty('--var',ctx.shadowColor);
}
function rollLineWidth(){
	let w = Math.floor(Math.random()*30);
	ctx.lineWidth = w;
	ctx.setLineDash([ctx.lineWidth*1,ctx.lineWidth*2]);
	let fs = Math.floor(Math.random()*50);
	ctx.font = `${fs}px sans-serif`;

	document.querySelector('#lineWidth').style.setProperty('--var',`"${ctx.lineWidth}px"`);
	document.querySelector('#setLineDash').style.setProperty('--var',`"${ctx.getLineDash()[0]}px"`);
}



// accept object with render() function, the render() function should return boolean, false to end animating of that object
const animationLayer = {
	animatedObjects:[],
	addAnimatableObject: function(obj){
		this.animatedObjects.push(obj);
		this.animate();
	},
	timeInterval: 10,
	animate: function(){
		if (this.animatedObjects.length>0) {
			this.on = true;
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
		}
		this.on = false;
	},
	on: false
}



// redo and undo
const doneStack = [];
const undoStack = [];
function recordImage(){
	let fullScreen = ctx.getImageData(0,0,parseInt(canvas.getAttribute('width')),parseInt(canvas.getAttribute('height')));
	doneStack.push(fullScreen);
}
function undoImage(){
	let s = doneStack.pop();
	if (s) {
		undoStack.push(s);
	}
	clearAll();
	if (doneStack[doneStack.length-1]) {
		ctx.putImageData(doneStack[doneStack.length-1],0,0);
	}
}
function redoImage(){
	let s = undoStack.pop();
	if (s) {
		doneStack.push(s);
	}
	clearAll();
	if (doneStack[doneStack.length-1]) {
		ctx.putImageData(doneStack[doneStack.length-1],0,0);
	}
}



// hinting listeners
let hinter = createHinter();
function createHinter(){
	let _hinter = document.createElement('div');
	_hinter.textContent = ' ';
	_hinter.id = 'hinter';
	_hinter.style.position = 'fixed';
	_hinter.style.pointerEvents = 'none';
	// _hinter.style.border = '1px dashed black';
		
	document.querySelector("body").appendChild(_hinter);
	return _hinter;
}
function moveHinter(){
	hinter.style.opacity = 1;
	hinter.style.width = Math.pow(Math.pow(start_client.x-end_client.x,2)+Math.pow(start_client.y-end_client.y,2),0.5);
	let rad = Math.atan((start_client.y-end_client.y)/(start_client.x-end_client.x));

	hinter.style.transformOrigin = 'left';
	if (end_client.x-start_client.x>0) {
		hinter.style.transform = `rotate(${rad}rad)`;
	}else {
		hinter.style.transform = `rotate(${rad+Math.PI}rad)`;
	}
	hinter.style.left = start_client.x;
	hinter.style.top = start_client.y;
}
function hideHinter(){
	hinter.style.display = 'none';
	hinter.style.border = '0';
	hinter.style.opacity = 0;
}
function showHinter(){
	hinter.style.width = 0;
	hinter.style.display = 'block';
	hinter.style.border = '1px dashed black';
	hinter.style.opacity = 0;
}


// hinting listeners
let body = document.querySelector('body');
body.addEventListener('mousedown',(e)=>{

	start_client.x = e.clientX;
	start_client.y = e.clientY;
	showHinter();
},false)
body.addEventListener('mousemove',(e)=>{
	end_client.x = e.clientX;
	end_client.y = e.clientY;
	moveHinter();
},false)
body.addEventListener('mouseup',(e)=>{
	hideHinter();
},false);

// drawing listeners
canvas.addEventListener('mousedown',(e)=>{
	startPt.x = e.offsetX;
	startPt.y = e.offsetY;
	draw_startingPhase(mode);
},false)
canvas.addEventListener('mousemove',(e)=>{
	endPt.x = e.offsetX;
	endPt.y = e.offsetY;
	draw_movingPhase(mode,e);
},false)
canvas.addEventListener('mouseup',(e)=>{
	draw_endingPhase(mode);
	recordImage();
},false);

function draw_startingPhase(mode){

	if (random_mode) {
		rollAll();
	}

	switch (mode) {
		case 'pencil':
			ctx.beginPath(startPt.x,startPt.y);
			break;
		case 'clearRect':
			ctx.beginPath(startPt.x,startPt.y);
			break;
		default:
			// donothing
			break;
	}
}
function draw_movingPhase(mode,e){
	switch (mode) {
		case 'pencil':
			if (e.buttons) {
				leavingTrace();
			}
			break;
		case 'clearRect':
			if (e.buttons) {
				clearRect();
			}
			break;
		default:
			// donothing
			break;
	}
}
function draw_endingPhase(mode){
	if (animationLayer.animatedObjects.length > 0) {
		if (random_mode) {
			rollAll();
		}
	}
	switch (mode) {
		case 'fillRect':
			fillRect();
			break;
		case 'strokeRect':
			strokeRect();
			break;
		case 'straightLine':
			straightLine();
			break;
		case 'strokeCircle':
			strokeCircle();
			break;
		case 'fillCircle':
			fillCircle();
			break;
		case 'createShadowBall':
			createShadowBall();
			break;
		case 'fillText':
			fillText(textStamp);
			break;
		case 'drawImage':
			drawImage(img);
			break;
		case 'createDynamicBall':
			let b = createDynamicBall();
			animationLayer.addAnimatableObject(b);
			break;
		case 'createDynamicCorn':
			let c = createDynamicCorn();
			animationLayer.addAnimatableObject(c);
			break;
		case 'createMarchingAnimal':
			let m = createMarchingAnimal();
			animationLayer.addAnimatableObject(m);
			break;
		case 'createDynamicCircle':
			let d = createDynamicCircle();
			animationLayer.addAnimatableObject(d);
			break;
		default:
			// donothing
			break;
	}
}

// drawing functions
function clearAll(){
	ctx.clearRect(0,0,parseInt(canvas.getAttribute('width')),parseInt(canvas.getAttribute('height')));
}

function leavingTrace(){
	ctx.lineTo(endPt.x,endPt.y);
	ctx.stroke();
}

function createDynamicBall(){

	ctx.beginPath();
	let center = createPt();
	center.x = 0.5*(startPt.x + endPt.x);
	center.y = 0.5*(startPt.y + endPt.y);
	let radius = 0.5*Math.pow((startPt.x - endPt.x)*(startPt.x - endPt.x) + (startPt.y - endPt.y)*(startPt.y - endPt.y),0.5);
	let vx = (endPt.x - startPt.x) > 0 ? (endPt.x - startPt.x + 5) : (endPt.x - startPt.x - 5);

	return {
		x:center.x,
		y:center.y,
		vx:vx,
		vy:0,
		ax:0,
		ay:90,
		r:radius,
		t:0.1,
		color:ctx.fillStyle,
		render: function(){
			ctx.beginPath();
			ctx.arc(this.x,this.y,radius,0,Math.PI*2);
			ctx.fillStyle = this.color;
			ctx.fill();
			if (Math.abs(this.vx) >= 1 || Math.abs(this.vy) >= this.ay*this.t*2) {
				// setTimeout(()=>{
				// 	this.move(this.t);
				// 	this.render();	
				// },this.t*1000);
				this.move(this.t);
				// this.render();
				return true
			}else {
				return false
			}
			
		},
		move: function(sec){
			console.log(this.x, this.y);
			console.log(this.vx, this.vy);
			console.log(this.ax, this.ay);
			this.x = this.x + (this.vx*sec + this.ax*sec*sec);
			this.y = this.y + (this.vy*sec + this.ay*sec*sec);
			this.vx = this.vx + (this.ax*sec);
			this.vy = this.vy + (this.ay*sec);
			this.interAct();
		},
		// interact with the boundary && velocity decay
		interAct: function(){
			if (this.x<=0) {
				this.vx = this.vx*-1;
				this.x = this.x*-1;
				this.vx *= .9;
			}
			if (this.x>=parseInt(canvas.getAttribute('width'))) {
				this.vx = this.vx*-1;
				this.x = 2*parseInt(canvas.getAttribute('width')) - this.x;
				this.vx *= .9;
			}
			if (this.y<=0) {
				this.vy = this.vy*-1;
				this.y = this.y*-1;		
				this.vy *= .9;	
			}
			if (this.y>=parseInt(canvas.getAttribute('height'))) {
				this.vy = this.vy*-1;
				this.y = 2*parseInt(canvas.getAttribute('height')) - this.y;
				this.vy *= .9;
			}
			this.vx *= .99;
			this.vy *= .99;
			
		}
	}
}

function drawImage(img){
	let width = endPt.x - startPt.x;
	let height = endPt.y - startPt.y;
	ctx.drawImage(img,startPt.x,startPt.y,width,height);
}

function fillText(str){
	let width = endPt.x - startPt.x;
	let height = endPt.y - startPt.y;
	let fs =  Math.pow((width*width+height*height),0.5);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	ctx.font = `${fs}px sans-serif`;
	ctx.fillText(str,startPt.x,startPt.y);
}

function createShadowBall(){
	ctx.beginPath();
	let center = createPt();
	center.x = 0.5*(startPt.x + endPt.x);
	center.y = 0.5*(startPt.y + endPt.y);
	let radius = 0.5*Math.pow((startPt.x - endPt.x)*(startPt.x - endPt.x) + (startPt.y - endPt.y)*(startPt.y - endPt.y),0.5);

	let radGrad = ctx.createRadialGradient(
		center.x,center.y,radius*0,
		center.x,center.y,radius*1,
		);

	radGrad.addColorStop(0,ctx.fillStyle);
	radGrad.addColorStop(1,ctx.strokeStyle);
	ctx.save();
	ctx.fillStyle = radGrad;

	ctx.arc(center.x,center.y,radius,0,Math.PI*2);
	ctx.fill();
	ctx.restore();
}

function fillCircle(){
	ctx.beginPath();
	let center = createPt();
	center.x = 0.5*(startPt.x + endPt.x);
	center.y = 0.5*(startPt.y + endPt.y);
	let radius = 0.5*Math.pow((startPt.x - endPt.x)*(startPt.x - endPt.x) + (startPt.y - endPt.y)*(startPt.y - endPt.y),0.5);
	ctx.arc(center.x,center.y,radius,0,Math.PI*2);
	ctx.fill();
}

function strokeCircle(){
	ctx.beginPath();
	let center = createPt();
	center.x = 0.5*(startPt.x + endPt.x);
	center.y = 0.5*(startPt.y + endPt.y);
	let radius = 0.5*Math.pow((startPt.x - endPt.x)*(startPt.x - endPt.x) + (startPt.y - endPt.y)*(startPt.y - endPt.y),0.5);
	ctx.arc(center.x,center.y,radius,0,Math.PI*2);
	ctx.stroke();

	console.log(center.x,center.y);
}

function straightLine(){
	ctx.beginPath();
	ctx.moveTo(startPt.x,startPt.y);
	ctx.lineTo(endPt.x,endPt.y);
	ctx.stroke();
}

function clearRect(){
	let width = ctx.lineWidth;
	ctx.clearRect(endPt.x-width,endPt.y-width,width*2,width*2);
}
function strokeRect(){
	let width = endPt.x - startPt.x;
	let height = endPt.y - startPt.y;
	ctx.strokeRect(startPt.x,startPt.y,width,height);
}
function fillRect(){
	let width = endPt.x - startPt.x;
	let height = endPt.y - startPt.y;
	ctx.fillRect(startPt.x,startPt.y,width,height);
}

function createDynamicCorn(){
	let center = createPt();
	center.x = 0.5*(startPt.x + endPt.x);
	center.y = 0.5*(startPt.y + endPt.y);
	let radius = 0.5*Math.pow((startPt.x - endPt.x)*(startPt.x - endPt.x) + (startPt.y - endPt.y)*(startPt.y - endPt.y),0.5);
	let color = ctx.fillStyle;

	return{
		x:center.x,
		y:center.y,
		r:radius,
		color: color,
		offX: (endPt.x - startPt.x)/radius,
		offY: (endPt.y - startPt.y)/radius,
		render: function(){
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
			ctx.fillStyle = this.color;
			ctx.fill();
			this.move();
			if (this.r <= 0) {
				return false
			}else {
				return true
			}
		},
		move: function(){
			this.x += this.offX;
			this.y += this.offY;
			this.r --;
			if (this.r <= 0) {
				this.r = 0;
			}
		}
	}
}

function createMarchingAnimal(){
	let center = createPt();
	center.x = 0.5*(startPt.x + endPt.x);
	center.y = 0.5*(startPt.y + endPt.y);
	let radius = 0.5*Math.pow((startPt.x - endPt.x)*(startPt.x - endPt.x) + (startPt.y - endPt.y)*(startPt.y - endPt.y),0.5);
	let color = ctx.fillStyle;

	return{
		x:center.x,
		y:center.y,
		r:radius,
		color: color,
		offX: 0,
		offY: 0,
		life: 200,
		render: function(){
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
			ctx.fillStyle = this.color;
			ctx.fill();
			this.move();
			if (this.life <= 0) {
				return false
			}else {
				return true
			}
		},
		move: function(){
			if (this.life%5 === 0) {
				this.offX = 10*(Math.random());
				this.offY = 10*(Math.random()); 
				let dir = Math.floor(8*(Math.random()));
				switch (dir) {
					case 0:
						this.offY = 0;
						break;
					case 1:
						//do nothing
						break;
					case 2:
						this.offX = 0;
						break;
					case 3:
						this.offX = -this.offX;
						break;
					case 4:
						this.offX = -this.offX;
						this.offY = 0;
						break;
					case 5:
						this.offX = -this.offX;
						this.offY = -this.offY;
						break;
					case 6:
						this.offX = 0;
						this.offY = -this.offY;
						break;
					case 7:
						this.offY = -this.offY;
						break;
					default:
						// statements_def
						break;
				}
			}
			this.x += this.offX;
			this.y += this.offY;
			this.life --;
			if (this.life <= 0) {
				this.life = 0;
			}
		}
	}
}

function createDynamicCircle(){
	let center = createPt();
	center.x = 0.5*(startPt.x + endPt.x);
	center.y = 0.5*(startPt.y + endPt.y);
	let radius = 0.5*Math.pow((startPt.x - endPt.x)*(startPt.x - endPt.x) + (startPt.y - endPt.y)*(startPt.y - endPt.y),0.5);
	const color = ctx.fillStyle;

	return{
		x:center.x,
		y:center.y,
		r:radius,
		r_interval: radius/8,
		color: color,
		life: 210,
		render: function(){
			if (this.life%30 != 0) {
				this.life--;
				return true
			}else{
				ctx.beginPath();
				ctx.moveTo(this.x,this.y);
				ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
				ctx.fillStyle = this.color;
				ctx.fill();
			}
			
			this.move();
			if (this.r <= 0) {
				return false
			}else{
				return true
			}
		},
		move: function(){
			this.r -= this.r_interval;
			this.life--;
			if (this.r <= 0 ) {this.r = 0}
		}
	}
}