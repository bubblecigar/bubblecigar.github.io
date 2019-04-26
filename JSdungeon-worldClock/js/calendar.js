// the timeZoneData is imported in the header by
// <script src="js/timeZoneNames.js"></script>
const zoneObject = timeZoneData.main["en"].dates.timeZoneNames.zone;
let currentZone = zoneObject;
let timeZoneArray = [];
let date = new Date();

initialize();

function initialize(){
	document.querySelector('#title').addEventListener('click',(e)=>{
			document.querySelector('#menu').classList.remove('hide');
		},false);
	document.querySelector('li').addEventListener('dblclick',function(e){
		this.remove();
	},true);
	updateInfo(document.querySelector('li'));
	setInterval(()=>{
		date = new Date();
		let list = document.querySelectorAll('li');
		for (let li of list){
			updateInfo(li);
		}
	},1000)

}

function writeMenu(text){ 
	const menu = document.querySelector('#menu');
	const option = document.createElement('span');
	option.textContent = text;
	option.addEventListener('click', (e)=>{
		currentZone = currentZone[e.target.textContent];
		timeZoneArray.push(e.target.textContent);
		if (currentZone.exemplarCity) {
			menu.classList.add('hide');
			try{
				appendClock();	
			}catch(e){
				if (e instanceof RangeError) {
					alert("Sorry, this area is not supported in the browser.")
				}
			}
			currentZone = zoneObject;
			timeZoneArray = [];
			enlist(currentZone);
		}else{
			enlist(currentZone);
		}	
	} ,false)
	menu.appendChild(option);
}

function enlist(zoneObject){
	const menu = document.querySelector('#menu');
	menu.innerHTML = '';
	for (let keys in zoneObject){
		writeMenu(keys);
	}
}

function appendClock(){
	let temp = document.querySelector('template').content.cloneNode(true);

	temp.querySelector('li').dataset.timezone = timeZoneArray.join('/');
	temp.querySelector(".city").textContent = currentZone.exemplarCity.toUpperCase();
	temp.querySelector(".date").textContent = date.toLocaleDateString('en',{
			day:'numeric',
			month: 'short',
			year: 'numeric',
			timeZone:timeZoneArray.join('/')
		});
	temp.querySelector(".time").textContent = date.toLocaleTimeString('en',{
			hour12: false,
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZone:timeZoneArray.join('/')
		});
	temp.querySelector('li').addEventListener('dblclick',function(e){
		this.remove();
	},true);

	document.querySelector('ul').appendChild(temp);

}

function updateInfo(li){
	const timezone = li.dataset.timezone;
	li.querySelector('.date').textContent = date.toLocaleDateString('en',{
			day:'numeric',
			month: 'short',
			year: 'numeric',
			timeZone: timezone
		});
	li.querySelector('.time').textContent = date.toLocaleTimeString('en',{
			hour12: false,
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZone: timezone
		});
}

enlist(zoneObject);