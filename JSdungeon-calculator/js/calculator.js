/*
	Calculator API: 
	
	following code would generate a simple calculator with minimum functionality

--HTML------------------------------------------
	<div id="calc">
		<div id="equation"></div>
		<div id="buffer"></div>
		<div id="keys"></div>
	</div>

--JavaScript------------------------------------
	<script>
		const c = new Calculator(document.querySelector("#calc"));
	</script>
------------------------------------------------

	construct keys for clicking input by creating HTML element within the <#keys>, ex:

	<div id='keys'>
		<div id='key-1'>1<div>
		<div id='key-2'>2<div>...
	</div>
	
*/

class Calculator{
	constructor(calc_DOM){
		this.dom = calc_DOM,
		this.equation = ['0'],
		this.isOperator = false,
		this.isEvaluated = false,
		//鍵盤輸入
		document.addEventListener('keydown',(e)=>{
			//keydown 特效
			this.keyDown_interface(e);
		}),
		document.addEventListener("keyup",(e)=>{
			//keyup 特效
			let li = this.dom.querySelectorAll('.keyDown');
			if(li.length>0){
				for (let el of li){
					el.classList.remove('keyDown');

				}
			}
			let input = e.key;
			switch (input) {
				case '-':
					input = '−';
					break;
				case '/':
					input = '÷';
					break;
				case '*':
					input = '×';
					break;
				case 'Backspace':
					input = '⌫';
					break;
				case 'Enter':
					input = '=';
					break;
				default:
					//do nothing
					break;
			}
			if (this.isEvaluated) {
				this.equation = [this.equation[this.equation.length-1]];
				this.isEvaluated = false;
			}
			this.action = input;
		}),
		//滑鼠點擊觸發
		calc_DOM.querySelector('#keys').addEventListener('click',(e)=>{
			if (e.target.id !== 'keys' && this.isEvaluated) {
				this.equation = [this.equation[this.equation.length-1]];
				this.isEvaluated = false;
			}
			if (e.target.id !== 'keys'){
				this.action = e.target.textContent;
			}
		})
	}

	keyDown_interface(e){
		let key = e.key;
		switch (key) {
			case '+':
				key = 'add';
				break;
			case '-':
				key = 'minus';
				break;
			case '*':
				key = 'multi';
				break;
			case '/':
				key = 'divide';
				break;
			case 'Enter':
			case '=':
				key = 'equal';
				break;
			case 'Backspace':
				key = 'backward';
				break;
			case '.':
				key = 'dot';
				break;
			default:
				//do nothing
				break;
		}
		key = 'key-' + key;
		let target = this.dom.querySelector(`#${key}`);
		if (target) {
			target.classList.add('keyDown');
		}
	}

	// AC (all clear) method
	allClear(){
		this.equation = ['0'];
		this.isOperator = false;
		this.dom.querySelector("#equation").textContent = this.equation_string;
	}
	// ⌫ backward method
	backward(){
		this.equation.pop();
		if(this.equation.length === 0){
			this.equation = ['0']
		}
		let cur = this.equation[this.equation.length - 1];
		if(cur==='+'||cur==='−'||cur==='×'||cur==='÷'){
			this.isOperator = true;
		}else {
			this.isOperator = false;
		}
		this.dom.querySelector("#equation").textContent = this.equation_string;
	}

	//called when operator(including =) turn true
	process_string(){
		let eq = [...this.equation];
		let eq2 = [];
		let buffer = '';

		while(eq.length > 0){
			if( eq[0] === '+' || eq[0] === '−' || eq[0] === '×' || eq[0] === '÷' || eq[0] === '='){
				eq2.push(`${parseFloat(buffer)}`);
				eq2.push(eq.shift());
				buffer = '';
			}else{
				buffer += eq.shift();
			}
		}
		this.equation = eq2;
	}

	//verify if a newly added point is valid
	is_Valid_point(){
		let eq_str = this.equation.join("");
		let op = eq_str.lastIndexOf('=');
		eq_str.lastIndexOf('+') > op ? op = eq_str.lastIndexOf('+') : {};
		eq_str.lastIndexOf('−') > op ? op = eq_str.lastIndexOf('−') : {};
		eq_str.lastIndexOf('×') > op ? op = eq_str.lastIndexOf('×') : {};
		eq_str.lastIndexOf('÷') > op ? op = eq_str.lastIndexOf('÷') : {};
		let str2 = eq_str.slice(op+1);
		return (!str2.includes('.'))
	}

	// calculation method
	get answer(){
		let str = this.equation.join('');
		str = str.replace(/−/g, '-');
		str = str.replace(/×/g, '*');
		str = str.replace(/÷/g, '/');
		str = str.replace(/=/g, '');
		return parseFloat(eval(str).toFixed(5))
	}
	// the string shown in #equation
	get equation_string(){
		let str = this.equation.join("");
		str = str.replace(/[+]/g, ' + ');
		str = str.replace(/−/g, ' - ');
		str = str.replace(/×/g, ' × ');
		str = str.replace(/÷/g, ' ÷ ');
		str = str.replace(/=/g, ' = ');
		return str.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}
	// the string shown in #buffer
	get buffer_string(){
		let eq_str = this.equation.join("");
		let op = eq_str.lastIndexOf('=');
		eq_str.lastIndexOf('+') > op ? op = eq_str.lastIndexOf('+') : {};
		eq_str.lastIndexOf('−') > op ? op = eq_str.lastIndexOf('−') : {};
		eq_str.lastIndexOf('×') > op ? op = eq_str.lastIndexOf('×') : {};
		eq_str.lastIndexOf('÷') > op ? op = eq_str.lastIndexOf('÷') : {};
		let str1 = eq_str.slice(0,op);
		let str2 = eq_str.slice(op+1);
		str2 = parseFloat(str2);
		if(str2 === 0){}else if(!str2) {str2 = ''}
		let b_str;
		op === -1 ? b_str = str2 : b_str = eq_str[op] + ' ' + str2;
		if (b_str === ''){b_str = '0'}
		return b_str.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}

	// execute action acording to the input
	set action(input){
		switch (input) {
			case 'AC':
				this.allClear();
				break;
			case '⌫':
				this.backward();
				break;
			case '=':
				if (this.isOperator) {
					this.equation.pop();
				}
				this.equation.push(input);
				this.process_string();
				this.equation.push(this.answer);
				this.isEvaluated = true;
				this.isOperator = false;
				this.dom.querySelector("#equation").textContent = this.equation_string;
				break;
			case '+':
			case '−':
			case '×':
			case '÷':
				if(this.isOperator){
					this.equation.pop();
					this.equation.push(input);
				}else{
					this.equation.push(input);
					this.isOperator = true;
				}
				this.process_string();
				this.dom.querySelector("#equation").textContent = this.equation_string;
				break;
			case '.':
				if(this.is_Valid_point()){
					this.equation.push(input);
					this.isOperator = false;
				}
				break;
			// numbers
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
			case '00':
				this.equation.push(input);
				this.isOperator = false;
				break;
			default:
				//other cases
				break;
		}
		//display current equation and buffer string fot the user
		this.dom.querySelector("#buffer").textContent = this.buffer_string;
	}

}

const c = new Calculator(document.querySelector("#calc"));
