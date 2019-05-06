// mario audio file, from https://themushroomkingdom.net/media/smb/wav
const coinSound = new Audio('audio/smb_coin.wav');
const bumpSound = new Audio('audio/smb_bump.wav');
const warning = new Audio('audio/smb_mariodie.wav');
const fireworks = new Audio('audio/smb_fireworks.wav');
const fireball = new Audio('audio/smb_fireball.wav');
const jump = new Audio('audio/smb_jump-super.wav');
const vine = new Audio('audio/smb_vine.wav');
const powerup = new Audio('audio/smb_powerup.wav');

const backgroundMusic = new Audio('https://ia800504.us.archive.org/15/items/SuperMarioBros.ThemeMusic/SuperMarioBros.ogg');
backgroundMusic.loop = true;

// play background music after the audio file is completely loaded

initialize();
function initialize(){
	const audioPromise = backgroundMusic.play();
	if (audioPromise !== null) {
		audioPromise.catch(()=>{
			console.log('Audio not ready yet');
			setTimeout(()=>{initialize()},1000)
		})
	}	
}

// the vue instance is FOCUSABLE, and need to be focused to catch the user's keydown
new Vue({
	el:'#vue',
	data:{
		scene: 0,	
		score: 0,
		countUp: 0,
		stage: 1,
		num1: 0,
		num2: 0,
		op: '+',
		input : [],
		highlight: false,
		fadeOut: false
	},
	methods:{
		shiftScene: function(){
			this.fadeOut = true;
			if (this.scene===0) {
				jump.play();
			}
			if (this.scene===2) {
				jump.play();
			}
			setTimeout(()=>{
				this.fadeOut = false;
				this.scene = (this.scene+1)%3;
				if (this.scene === 0) {
					backgroundMusic.play();
				}
				if (this.scene === 1) {
					setTimeout(()=>{},500);
					this.gameStart();
				}
			},500);
		},
		newCase: function(){
			// 位數 Math.pow(10,this.stage)
			if (this.countUp <= 20) {
				this.stage = 1
			}else if (this.countUp <= 40) {
				this.stage = 2
			}else{
				this.stage = 3
			}
			this.num1 = Math.floor(Math.random()*Math.pow(10,this.stage));
			this.num2 = Math.floor(Math.random()*Math.pow(10,this.stage));
			switch (Math.floor(Math.random()*4)){
				case 0:
					this.op = '+';
					break;
				case 1:
					this.op = '-';
					break;
				case 2:
					this.op = '×';
					break;
				case 3:
					this.op = '÷';
					this.validateCase();
					break;
			}
		},
		// 	除數題目的答案需在小數點兩位
		validateCase: function(){
			while ((this.correctAns*100)%1 !== 0 || this.num2 === 0){
				this.num1 = Math.floor(Math.random()*Math.pow(10,this.stage));
				this.num2 = Math.floor(Math.random()*Math.pow(10,this.stage));
			}
		},
		gameStart: function(){
			this.countUp = 0;
			this.score = 0;
			this.input = [];
			this.newCase();
			const timerID = setInterval(()=>{
				this.countUp++;
				if (this.countUp >= 60) {
					backgroundMusic.pause();
					warning.play();
					clearInterval(timerID);
					this.shiftScene();
				}
			},1000);
		},
		keydown: function(){
			if (this.scene === 1){
				switch(event.key){
					case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '.': case '-':
						fireball.play();
						this.input.push(event.key);
						break;
					case 'Backspace':
						this.input.pop();
						bumpSound.play();
						break;
					case 'Enter':
						this.submit();
						break;
				}
			}else{
				if (event.key === 'Enter') {
					this.highlight = true;
				}
			}
		},
		keyup: function(){
			if (this.scene === 0 || this.scene === 2 ) {
				if (event.key === 'Enter') {
					this.highlight = false;
					this.shiftScene();
				}
			}
		},
		submit: function(){
			// stage1,2 答對+1 stage3 答對+5
			if (this.inputAns === '' || this.inputAns != this.correctAns) {
				fireworks.play();
				// 答錯-1 最低0分
				this.score--;
				if (this.score < 0) this.score = 0;
				this.createAnimation(3);
			}else if (this.inputAns == this.correctAns) {
				if (this.stage !== 3){
					coinSound.play();
					this.score += 1;
					this.createAnimation(1);
				}
				if (this.stage === 3){
					powerup.play();
					this.score += 5;
					this.createAnimation(2);
				} 
			}
			//產生新題目 清空輸入欄位
			this.input = [];
			this.newCase();
		},
		// createAnimation:
		// type 1 => score + 1
		// type 2 => score + 5
		// type 3 => score - 1
		createAnimation: function(type){
			let node = document.createElement('div');
			node.className = 'state';
			if (type === 1) {
				node.textContent = 'score + 1';
				node.style.color = 'green';
			}else if(type === 2){
				node.textContent = 'score + 5';
				node.style.color = 'green';
			}else{
				node.textContent = 'score - 1';
				node.style.color = 'red';
			}
			document.querySelector('#scene-2').appendChild(node);
			setTimeout(()=>{
				node.className = 'show state';
			},10);
			setTimeout(()=>{
				node.remove();
			},1100);
		}
	},
	computed:{
		correctAns: function(){
			let operator = '';
			switch (this.op){
				case '+':
					operator = '+';
					break;
				case '-':
					operator = '-';
					break;
				case '×':
					operator = '*';
					break;
				case '÷':
					operator = '/';
					break;
			}
			return eval(this.num1+operator+this.num2);
		},
		inputAns: function(){
			return this.input.join('');
		},
		countDown: function(){
			let timeLeft = 60 - this.countUp;
			if (timeLeft === 60){
				return '01 : 00'
			}else if (timeLeft >= 10){
				return '00 : ' + timeLeft
			}else{
				return '00 : 0' + timeLeft
			}
		},
		ghostShouldHide: function(){
			return (this.input.length !== 0)
		}
	}
});