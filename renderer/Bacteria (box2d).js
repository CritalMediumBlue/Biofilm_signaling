import { b2BodyDef, b2PolygonShape, b2BodyType, b2FixtureDef, b2World } from './libraries/box2d.ts/build/box2d.js';

class Bacteria {
	constructor(x, y, l, angle, phenotype, sinR,slrR,sinI,sinR_slrR ) {

		var p = l / 2, longitud_de_reproduccion = randomGaussian(60, 5), largo_max, largo_min, longitud_actual,
			sensibilidad_to_surfactin=random(8,700),
			sensibilidad_to_2=randomGaussian(0.31, 0.15),
			//time_to_repr,
			//	current_positionx,
			SinR = sinR, // inhibits matrix genes  arround 500 molecules per cell
			SlrR = slrR, // inhibits motility genes arround 500 molecules per cell
			SinI = sinI, // inhibits SinR arround 500 molecules per cell
			SinR_SlrR = sinR_slrR, // complex
			as = 0.04, //SinR production rate   30 min-1 = 0.0225 loop-1
			ar = 0.1, //SlrR production rate    20 min-1 =  0.015 loop-1
			d_SinR, d_SlrR, d_SinR_SlrR, bs = 0.01,  //SinR degradiation rate 
			br = 0.01, //SlrR degradiation rate
			bc = 0.002, //complex degradiation rate
			Kf = 0.1, //complex formation rate
			Kd = 0.001, //complex degradation rate
			SinR_Array = [], SinR_times = [], SlrR_Array = [], Complex_Array = [];

	
		



			let bodyDef = new b2BodyDef();
			bodyDef.type = b2BodyType.b2_dynamicBody;
			bodyDef.position.Set(x, y);
			bodyDef.angle = angle;
	
			let polygonShape = new b2PolygonShape();
			polygonShape.SetAsBox(5 + 2.5, l / 2);  // Half width and half height
	
			let fixtureDef = new b2FixtureDef();
			fixtureDef.shape = polygonShape;
			fixtureDef.density = 0.005;
			fixtureDef.friction = 1;
			fixtureDef.restitution = 1;
			// Additional fixture settings can be added based on your options
	
			this.body = world.CreateBody(bodyDef);
			this.body.CreateFixture(fixtureDef);
			this.body.SetUserData({label: phenotype});


		//this.setInertia(particle, Infinity);
		this.grow = function() {
			if (this.body.GetUserData().label !== "green") {
				// Adjusting the size in Box2D.ts can be a bit trickier. You might have to destroy the old fixture and add a new one with modified dimensions.
				// However, if your bacterium doesn't frequently change its size, it's advisable to consider other modeling approaches.
				// Below is a placeholder for growth; you might need to customize it further:

				let newHeight = l * 1.031;  // An increment by 3.1%
				polygonShape.SetAsBox(5 + 2.5, newHeight / 2);
				this.body.DestroyFixture(this.body.GetFixtureList());
				this.body.CreateFixture(fixtureDef);
			}
		};

		this.move = function () {
			let torque = 0.09;
			let force=0.0009;
			this.body.torque = random(-torque, torque);
			//Matter.Body.update(this.body, 20, 1, 1)
			//Matter.Body.applyForce(body, position, force)
			Body.setAngularVelocity(this.body, random(-20,20));
			
			//this.body.velocity.x=1000;
			
			//Matter.Body.update(this.body, 20, 1, 1);
			//Matter.Body.update(this.body, 20, 1, 1);
			Body.applyForce(this.body, {x: this.body.position.x, y: this.body.position.y},  {x: random(-force, force), y: random(-force, force)});
			Body.setVelocity(this.body, {x:random(-200,200),y:random(-200,200)} );

			//Matter.Body.update(this.body, 20, 1, 1);
		};

		this.measure = function () {
			largo_max = this.body.bounds.max.y;
			largo_min = this.body.bounds.min.y;
			longitud_actual = largo_max - largo_min;
		};

		this.show_1 = function () {

			if(show_continuous==1){

			if (this.body.label == "green") {
				fill(0, 255,0, 200); //gren
			} else  {
				fill(SinR*SinR*50, 50, SlrR*SlrR*0.7, 200); 
				
			
			}

			stroke(0);
		} else if (show_continuous==0){
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
			}
		};

		this.produce_pink = function () {

			let cx = Math.floor(this.body.position.x / 30); //coordinates for pink concentration must be an integer
			let cy = Math.floor(this.body.position.y / 30);

		
				comX_conc[cx][cy] = comX_conc[cx][cy] + P ; //The bacteria adds a little amount each frame
			//} 


		};

		this.produce_surfactin = function () {

			let cx = Math.floor(this.body.position.x / 30); //coordinates for pink concentration must be an integer
			let cy = Math.floor(this.body.position.y / 30);

			if (this.body.label == "green") {
				surf_conc[cx][cy] = surf_conc[cx][cy] +P2 ; 
			}
		};

		this.isOffScreen = function () {
			if (this.body.position.x <= 200) {
				return true;
			}
			else if (this.body.position.x >= N - 200) {
				return true;
			}
			else if (this.body.position.y <= 200) {
				return true;
			}
			else if (this.body.position.y >= N - 200) {
				return true;
			} else {
				return false;
			}
		};

		
		this.signaling_response_to_pink = function () {


			let cx = Math.floor(this.body.position.x / 30); //coordinates for pink concentration must be an integer
			let cy = Math.floor(this.body.position.y / 30);


			if ( sensibilidad_to_surfactin <= 5*comX_conc[cx][cy] && this.body.label == "pink") {
				this.body.label = "green";
			}

		};

		this.signaling_response_to_surfactin = function () {



			if (SinR*3 < sensibilidad_to_2 && this.body.label !== "green") {
				this.body.label = "blue";
			} else if (SinR*3 >= sensibilidad_to_2 && this.body.label !== "green"){
				this.body.label = "pink";
			}

		};

		this.removeFromWorld = function () {
			Composite.remove(objects, this.body);
		};

		this.internal_circuit = function () {

			let cx = Math.floor(this.body.position.x / 30); //coordinates for surf concentration must be an integer
			let cy = Math.floor(this.body.position.y / 30);

			d_SinR = (as / (1 + SlrR*10)) - bs * SinR - Kf * SlrR * SinR + Kd * SinR_SlrR;
			d_SlrR = ar*(surf_conc[cx][cy])*0.2 - br * SlrR - Kf * SlrR * SinR + Kd * SinR_SlrR;
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


			//	console.log(SinR);
			//console.log(SlrR);
			//console.log(SinR_SlrR);
		};


	}
}