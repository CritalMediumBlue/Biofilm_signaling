
class Bacteria {
	constructor(x, y, l, angle, phenotype, sinR,slrR,sinI,sinR_slrR ) {

		var p = l / 2, longitud_de_reproduccion = randomGaussian(60, 5), largo_max, largo_min, longitud_actual,
			sensibilidad_to_pink=randomGaussian(25,5),
			sensibilidad_to_surfactina=randomGaussian(1.5,0.05),
			//time_to_repr,
			//	current_positionx,
			SinR = sinR, // inhibits matrix genes  arround 500 molecules per cell
			SlrR = slrR, // inhibits motility genes arround 500 molecules per cell
			SinI = sinI, // inhibits SinR arround 500 molecules per cell
			SinR_SlrR = sinR_slrR, // complex
			as = randomGaussian(0.04, 0.002), //SinR production rate   30 min-1 = 0.0225 loop-1
			ar = randomGaussian(0.1, 0.005), //SlrR production rate    20 min-1 =  0.015 loop-1
			d_SinR, d_SlrR, d_SinR_SlrR, bs = randomGaussian(0.01, 0.0005),  //SinR degradiation rate 
			br = randomGaussian(0.01,0.0005), //SlrR degradiation rate
			bc = randomGaussian(0.002,0.0001), //complex degradiation rate
			Kf = randomGaussian(0.1,0.005), //complex formation rate
			Kd = randomGaussian(0.001,0.0001), //complex degradation rate
			SinR_Array = [], SinR_times = [], SlrR_Array = [], Complex_Array = [], yellow_selection, selected = false;

		var options = {
			restitution: 1,
			friction:1,
			frictionStatic:1,
			chamfer: p,
			angle: angle,
			frictionAir: 0.01,
			label: phenotype,
			density: 0.000005,
			//inertia: Infinity,
			//inverseInertia: Infinity,
			slop:0.01,
			//isStatic: true 
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


		this.body = Bodies.rectangle(x, y, 10+7, l+3, options);
		Composite.add(objects, this.body);
			

		//this.setInertia(particle, Infinity);
		this.grow = function () {
			if (this.body.label !== "green"){
			let cx = Math.floor(this.body.position.x / 40); //coordinates for pink concentration must be an integer
			let cy = Math.floor(this.body.position.y / 40);

			var scaleX = 1;
			var Substrate = (-u0[cx][cy]+0.5) ;
			var scaleY = 1+(0.031)*Substrate/(1+Substrate);
			if (scaleY<1){scaleY=0}
			let original_angle = this.body.angle;
			Body.rotate(this.body, -original_angle);
			Body.scale(this.body, scaleX, scaleY);
			largo_max = this.body.bounds.max.y;
			largo_min = this.body.bounds.min.y;
			longitud_actual = largo_max - largo_min;
			Body.rotate(this.body, original_angle);
			}
		};

		this.move = function () {
			let torque = 0.002;
			let force=0.0001;
			this.body.torque = random(-torque, torque);
			//Matter.Body.update(this.body, 20, 1, 1)
			//Matter.Body.applyForce(body, position, force)
			
			//this.body.velocity.x=1000;
			
			//Matter.Body.update(this.body, 20, 1, 1);
			//Matter.Body.update(this.body, 20, 1, 1);
			Body.applyForce(this.body, {x: this.body.position.x, y: this.body.position.y},  {x: random(-force, force), y: random(-force, force)});
			Body.setVelocity(this.body, {x:random(-200,200),y:random(-200,200)} );

			//Matter.Body.update(this.body, 20, 1, 1);
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
			rect(0, 0, 10, largo_max - largo_min-5, 10);
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

			let cx = Math.floor(this.body.position.x / 40); //coordinates for pink concentration must be an integer
			let cy = Math.floor(this.body.position.y / 40);
				u0[cx][cy] = u0[cx][cy] + 0.005 ;


		};

		this.produce_surfactin = function () {


			if (this.body.label == "green") {
				let cx = Math.floor(this.body.position.x / 40); //coordinates for pink concentration must be an integer
				let cy = Math.floor(this.body.position.y / 40);
				n0[cx][cy] = n0[cx][cy] +0.04 ; 
			}
		};

		this.isOffScreen = function () {
				/* let my_x=this.body.position.x;
				let my_y=this.body.position.y;
				let original_angle = this.body.angle; */
			/* if (this.body.position.x <= 50) {
				
				Matter.Body.setPosition(this.body, { x:my_y , y:my_x });
				Matter.Body.setAngle(this.body, original_angle+PI/2);
				//return true;
			}
			 
			 if (this.body.position.y <= 50) {
				
				Matter.Body.setPosition(this.body, { x:my_y , y:my_x });
				
				Matter.Body.setAngle(this.body, original_angle-PI/2);
			} */
			 if (this.body.position.y >= N - 200) {
				return true;
			} else if (this.body.position.x >= N - 200) {
				return true;
			} else {
				return false;
			}
		};

		
		this.signaling_response_to_pink = function () {


			let cx = Math.floor(this.body.position.x / 40); //coordinates for pink concentration must be an integer
			let cy = Math.floor(this.body.position.y / 40);


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
		};

		this.internal_circuit = function () {

			if (this.body.label!=="green"){

			

			let cx = Math.floor(this.body.position.x / 40); //coordinates for surf concentration must be an integer
			let cy = Math.floor(this.body.position.y / 40);

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
			//	console.log(SinR);
			//console.log(SlrR);
			//console.log(SinR_SlrR);
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