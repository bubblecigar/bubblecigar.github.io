
hms = {
	hours : 0,
	minutes : 0,
	seconds : 0
}


const hour_hand = document.getElementById("hour-hand");
const minute_hand = document.getElementById("minute-hand");
const second_hand = document.getElementById("second-hand");

function updateTime(){
	const t = new Date();
	hms.hours = t.getHours();
	hms.minutes = t.getMinutes();
	hms.seconds = t.getSeconds();
}

function setHands(){
	const tot_sec = hms.hours*60*60 + hms.minutes*60 + hms.seconds;
	hour_hand.setAttribute("style",`
		transform : rotate(${(tot_sec/120 -90)}deg)
		`);
	minute_hand.setAttribute("style",`
		transform : rotate(${(tot_sec/10)}deg)
		`);
	second_hand.setAttribute("style",`
		transform : rotate(${(tot_sec*6 -180)}deg)
		`);
}

function initialize(){
	setInterval(()=>{updateTime();setHands()},1000);
	setTimeout(()=>{document.getElementById("clock").setAttribute("style","display:block")}, 1000);
};

initialize();