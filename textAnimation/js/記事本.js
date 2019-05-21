a.draw = function dot(){
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = this.property.fillColor;

	ctx.arc(a.coordinate.x,a.coordinate.y,a.property.radius,0,2*Math.PI);
	ctx.fill();

	ctx.restore();
}

a.draw = function linkingDot(){
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

a.enter = function expand(){
	a.timer.counter ++;
	a.property.radius = initial_radius*(a.timer.counter/a.timer.duration);
	if (a.property.radius >= initial_radius) {
		a.motion = 'linger';
		a.timer.counter = 0;
	}
}

a.enter = function emitting(){
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


a.linger = function shrinking (){
// if monitoringObject collide with it, change motion to exit
	a.monitoringObjects.forEach((obj)=>{
		let _x = obj.coordinate.x - a.coordinate.x;
		let _y = obj.coordinate.y - a.coordinate.y;
		let dist = Math.pow(_x*_x+_y*_y,0.5);
		if (dist<=a.property.radius+obj.property.radius) {
			a.property.radius *= 0.97;
		}else if (a.property.radius<=initial_radius) {
			a.property.radius *= 1.03;
		}
	});
}

a.linger = function scattering (){
	// if monitoringObject collide with it, change motion to exit
	a.monitoringObjects.forEach((obj)=>{
		let _x = obj.coordinate.x - a.coordinate.x;
		let _y = obj.coordinate.y - a.coordinate.y;
		let dist = Math.pow(_x*_x+_y*_y,0.5);

		if (dist<=a.property.radius+obj.property.radius && a.timer.counter===0) {
			
			let angle = Math.random()*Math.PI*2;
			a.coordinate.dx = Math.cos(angle);
			a.coordinate.dy = Math.sin(angle);

			a.timer.counter ++;		
		}else{
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
	});
}

a.linger = function antiGravity (){
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

a.linger = function gravity(){
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

a.linger = function magnetic(){
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




