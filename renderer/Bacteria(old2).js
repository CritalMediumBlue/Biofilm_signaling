class Bacteria {
	constructor(x, y, l, angle, phenotype, sinR,slrR,sinI,sinR_slrR ) {

		var longitud_de_reproduccion = randomGaussian(70,10), largo_max, largo_min, longitud_actual,
			sensibilidad_to_pink=randomGaussian(30,5),
			sensibilidad_to_surfactina=randomGaussian(2,0.1),
			//time_to_repr,
			//	current_positionx,
			SinR = sinR, // inhibits matrix genes  arround 500 molecules per cell
			SlrR = slrR, // inhibits motility genes arround 500 molecules per cell
			SinI = sinI, // inhibits SinR arround 500 molecules per cell
			SinR_SlrR = sinR_slrR, // complex
			as = 0.04, //SinR production rate   30 min-1 = 0.0225 loop-1
			ar = 0.1, //SlrR production rate    20 min-1 =  0.015 loop-1
			d_SinR, d_SlrR, d_SinR_SlrR, bs = randomGaussian(0.01, 0.0005),  //SinR degradiation rate 
			br = 0.01, //SlrR degradiation rate
			bc = 0.002, //complex degradiation rate
			Kf = 0.1, //complex formation rate
			Kd = 0.001, //complex degradation rate
			Area = "Inicial",
			SinR_Array = [], SinR_times = [], SlrR_Array = [], Complex_Array = [], yellow_selection, selected = false;


		var options = {
			restitution: 1,
			friction:0,
			frictionStatic:0,
			chamfer: 4,
			angle: angle,
			frictionAir: 0.000000001,
			label: phenotype,
			density: 0.000000005,
		};
		

		this.clicked = function () {
			let d = dist(mouseX, mouseY, this.body.position.x, this.body.position.y);
			if (d < 15) {
				console.log("Clicked");

				selected = true;
				yellow_selection = true;
			}

		}; 

		this.deselect = function () {
			yellow_selection = false;
		};


		this.body = Bodies.rectangle(x, y, 10+8, l, options);
		Composite.add(objects, this.body);
			

		this.grow = function () {
			let bodyX=this.body.position.x;
			let bodyY=this.body.position.y;

			if (bodyX<=0){
				bodyX=1;
			}
			if (bodyY<=0){
				bodyY=1;
			}


			if (this.body.label !== "green"){
			let cx = Math.floor(bodyX / pixel_size); //coordinates for pink concentration must be an integer
			let cy = Math.floor(bodyY / pixel_size);

			var Substrate = (-u0[cx][cy]*0.8+3.7) ;
			if (Substrate<=0){
				Substrate=0;
			}
			var scaleY = 1+((0.031)*Substrate/((1+Substrate)+randomGaussian(0,0.01)))*0.2;
			//if (scaleY<1){
			//	scaleY=1;
			//}
			let original_angle = this.body.angle;
			Body.rotate(this.body, -original_angle);
			Body.scale(this.body, 1, scaleY);
			largo_max = this.body.bounds.max.y;
			largo_min = this.body.bounds.min.y;
			longitud_actual = largo_max - largo_min;
			Body.rotate(this.body, original_angle);
			}
		}; 

		this.move = function () {
			let torque = 0.000002;
			this.body.torque = random(-torque, torque);
		
		};


		this.show_1 = function () {
			if (this.body.label == "pink") {
				fill(235, 130, 203);
				stroke(54, 0, 99);
			} else if (this.body.label == "green") {
				fill(25, 185, 35); //gren
				stroke(0, 20, 0); //green
			} else if (this.body.label == "blue") {
				fill(35, 255, 255); //blue
				stroke(0, 0, 200); //blue
			}
			
			if (yellow_selection) {
				fill(253, 208, 23, 255);
				stroke(251, 117, 23);
			}




			let original_angle = this.body.angle;
			Body.rotate(this.body, -this.body.angle);
			largo_max = this.body.bounds.max.y;
			largo_min = this.body.bounds.min.y;
			longitud_actual = largo_max - largo_min;
			Body.rotate(this.body, original_angle);

			push();
			rectMode(CENTER);
			translate(this.body.position.x, this.body.position.y);
			rotate(this.body.angle);
			strokeWeight(3);
			rect(0, 0, 10, largo_max - largo_min-5, 4);
			pop();

		};

		this.reproduce = function () {
			if (longitud_actual >= longitud_de_reproduccion) {
				//	current_positionx=this.body.position.x;
				//	current_positiony=this.body.position.y;
				var move = longitud_actual / 4;
				let New_Bacteria = new Bacteria(this.body.position.x - move * sin(this.body.angle),
					this.body.position.y + move * cos(this.body.angle),
					(longitud_de_reproduccion / 2)-1,
					this.body.angle + PI,
					this.body.label, SinR,SlrR,SinI,SinR_SlrR);


				Body.translate(this.body, { x: move * sin(this.body.angle), y: -move * cos(this.body.angle) });
				var scaleY = 0.5;
				let original_angle = this.body.angle;
				Body.rotate(this.body, -this.body.angle);
				Body.scale(this.body, 1, scaleY);
				largo_max = this.body.bounds.max.y;
				largo_min = this.body.bounds.min.y;
				longitud_actual = largo_max - largo_min;
				Body.rotate(this.body, original_angle);
				Composite.add(objects, New_Bacteria);
				bacteria_array.push(New_Bacteria);
				//time_to_repr=1;
				//console.log("I was born!");
			}
		};

		this.produce_pink = function () {

			let bodyX=this.body.position.x;
			let bodyY=this.body.position.y;

			if (bodyX<=0){
				bodyX=1;
			}
			if (bodyY<=0){
				bodyY=1;
			}

			let cx = Math.floor(bodyX / pixel_size); //coordinates for pink concentration must be an integer
			let cy = Math.floor(bodyY / pixel_size);

			
				u0[cx][cy] = u0[cx][cy] + 0.3 ; 


		};

		this.produce_surfactin = function () {

			
			
			let bodyX=this.body.position.x;
			let bodyY=this.body.position.y;

			if (bodyX<=0){
				bodyX=1;
			}
			if (bodyY<=0){
				bodyY=1;
			}

			if (this.body.label == "green") {
				let cx = Math.floor(bodyX / pixel_size); //coordinates for pink concentration must be an integer
				let cy = Math.floor(bodyY / pixel_size);
				n0[cx][cy] = n0[cx][cy] +0.002 ; 
			}
		};

		this.Area_category=function(){

			let bodyx=this.body.position.x;
			let bodyy=this.body.position.y;

			//console.log(bodyx,bodyy,(pixel_size/2) );

			if (bodyx < (pixel_size/2)) {
				Area="Outside";

			} else if (bodyy < (pixel_size/2)){
				Area="Outside";
				
			} else if (this.body.position.x < pixel_size && this.body.position.x > (pixel_size/2)){
				Area="Left";
			}else if (this.body.position.y < pixel_size && this.body.position.y > (pixel_size/2)){
				Area="Up";
			}else if (this.body.position.y > pixel_size && this.body.position.x > pixel_size){
				Area="Normal";
			} else  {
				Area="wtf";
			}
		}
		this.Rearrange=function(){
			if (Area=="Outside"){
				return 0;
			} else if (Area=="Left"){
				return 1;
			} else if (Area=="Up"){
				return 2;
			} else if (Area=="Normal"){
				return 3;
			} else if (Area == "wtf"){
				return 4;
			}



		}


		this.Move_from_up_to_left = function() {

			let original_angle = this.body.angle;
			Body.rotate(this.body, -this.body.angle);
			largo_max = this.body.bounds.max.y;
			largo_min = this.body.bounds.min.y;
			longitud_actual = largo_max - largo_min;
			Body.rotate(this.body, original_angle);

			let new_bac1=new Bacteria(-this.body.position.y+pixel_size ,this.body.position.x ,longitud_actual,original_angle+PI/2,phenotype, sinR,slrR,sinI,sinR_slrR);
			bacteria_array.push(new_bac1);
			//console.log("copied from up to left");

		}
		this.Move_from_left_to_up = function() {

			let original_angle = this.body.angle;
			Body.rotate(this.body, -this.body.angle);
			largo_max = this.body.bounds.max.y;
			largo_min = this.body.bounds.min.y;
			longitud_actual = largo_max - largo_min;
			Body.rotate(this.body, original_angle);

			let new_bac1=new Bacteria(this.body.position.y ,-this.body.position.x+pixel_size ,longitud_actual,original_angle+PI/2,phenotype, sinR,slrR,sinI,sinR_slrR);
			bacteria_array.push(new_bac1);
		//	console.log("copied from left to up");

		}




		this.isOffScreen = function () {

			

			let boundary=1;

			if (this.body.position.x < boundary) {

				let original_angle = this.body.angle;
				Body.rotate(this.body, -this.body.angle);
				largo_max = this.body.bounds.max.y;
				largo_min = this.body.bounds.min.y;
				longitud_actual = largo_max - largo_min;
				Body.rotate(this.body, original_angle);

				let new_bac1=new Bacteria(this.body.position.y ,boundary ,longitud_actual,original_angle-PI/2,phenotype, sinR,slrR,sinI,sinR_slrR);
				bacteria_array.push(new_bac1);
				console.log("1 bacteria has been jumped");
				salto=1;
				return true;
			}
			else if (this.body.position.x >= N - 300) {
				
				return true;
			}
			else if (this.body.position.y < boundary) {

				let original_angle = this.body.angle;
				Body.rotate(this.body, -this.body.angle);
				largo_max = this.body.bounds.max.y;
				largo_min = this.body.bounds.min.y;
				longitud_actual = largo_max - largo_min;
				Body.rotate(this.body, original_angle);

				let new_bac1=new Bacteria(boundary, this.body.position.x,longitud_actual,original_angle+PI/2,phenotype, sinR,slrR,sinI,sinR_slrR);
				bacteria_array.push(new_bac1);
				console.log("1 bacteria has been jumped");
				salto=1;


				return true;
			}
			else if (this.body.position.y >= N - 300) {
				return true;
			} else {
				return false;
			}
		};

		this.kill_em = function () {
			if (this.body.position.x <= this.body.position.y) {
				
				return true;
			}
		};


		/* this.teletransportation_at_the_boundary = function () {


			if (this.body.position.x <= (pixel_size/2)) {
				
				return true;
			}
		};
 */

		
		this.signaling_response_to_pink = function () {
			let bodyX=this.body.position.x;
			let bodyY=this.body.position.y;

			if (bodyX<=0){
				bodyX=1;
			}
			if (bodyY<=0){
				bodyY=1;
			}

			let cx = Math.floor(bodyX / pixel_size); //coordinates for pink concentration must be an integer
			let cy = Math.floor(bodyY / pixel_size);


			if ( sensibilidad_to_pink <= 5*u0[cx][cy] && this.body.label == "pink") {
				this.body.label = "green";
			}

		};

		this.signaling_response_to_surfactin = function () {



			if (SinR < sensibilidad_to_surfactina && this.body.label !== "green") {
				this.body.label = "blue";
			} else if (SinR >= sensibilidad_to_surfactina && this.body.label !== "green"){
				this.body.label = "pink";
			}

		};

		this.removeFromWorld = function () {
			Composite.remove(objects, this.body);
			//console.log("1 bacteria has been deleted");
		};

		this.internal_circuit = function () {

			if (this.body.label!=="green"){

			let bodyX=this.body.position.x;
			let bodyY=this.body.position.y;

			if (bodyX<=0){
				bodyX=1;
			}
			if (bodyY<=0){
				bodyY=1;
			}

			let cx = Math.floor(bodyX / pixel_size); //coordinates for surf concentration must be an integer
			let cy = Math.floor(bodyY / pixel_size);

			d_SinR = (as / (1 + SlrR*10)) - bs * SinR - Kf * SlrR * SinR + Kd * SinR_SlrR;
			d_SlrR = ar*(n0[cx][cy])*0.2 - br * SlrR - Kf * SlrR * SinR + Kd * SinR_SlrR;
			d_SinR_SlrR = -bc * SinR_SlrR + Kf * SinR * SlrR - Kd * SinR_SlrR;


			SinR = SinR + d_SinR;
			SlrR = SlrR + d_SlrR;
			SinR_SlrR = SinR_SlrR + d_SinR_SlrR;
			SinR_Array.push(SinR);

			let myhours = loops*56.25/3600;
			let my_life = myhours.toFixed(2);
	

			SinR_times.push(my_life);
			SlrR_Array.push(SlrR);
			Complex_Array.push(SinR_SlrR);

		}
			
		};

		this.show_internal_circuit = function () {
			if (selected == true) {


				if (chart_exists == true) {
					chart.destroy();
					console.log("chart has been destroyed");
					chart_exists = false;

				}

				ctx = document.getElementById('chart').getContext('2d');
				chart = new Chart(ctx, {
					type: 'line',
					data: {
						labels: SinR_times,
						datasets: [{
							label: 'SinR',
							data: SinR_Array, pointRadius: 1,
							pointHoverRadius: 1
						}, {
							label: 'SlrR',
							data: SlrR_Array, pointRadius: 1,
							pointHoverRadius: 1
						},
						{
							label: 'Complex',
							data: Complex_Array, pointRadius: 1,
							pointHoverRadius: 1
						}]
					},
					options: {
						animation: {
							duration: 0
						},
						plugins: {
							customCanvasBackgroundColor: {
								color: 'white',
							}
						}
					}, plugins: [plugin],
				});
				chart_exists = true;
				console.log("chart_exists");

				console.log(selected);

				selected = false;
			}

		};
	}
}