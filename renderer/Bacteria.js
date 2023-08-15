class Bacteria {
	constructor(x, y, l, angle, phenotype, sinR,slrR,sinI,sinR_slrR ) {

		var p = l / 2, longitud_de_reproduccion = randomGaussian(60, 5), largo_max, largo_min, longitudActual,
			sensibilidad_to_comX=randomGaussian(70, 20), //The smaller the more sensible
			sensibilidad_to_surfactin=randomGaussian(0.9, 0.4), //The higher the more sensible
			SinR = sinR, // inhibits matrix genes  arround 500 molecules per cell
			SlrR = slrR, // inhibits motility genes arround 500 molecules per cell
			SinI = sinI, // inhibits SinR arround 500 molecules per cell
			SinR_SlrR = sinR_slrR, // complex
			as = 0.04, //SinR production rate   30 min-1 = 0.0225 loop-1
			ar = 1, //SlrR production rate    20 min-1 =  0.015 loop-1
			d_SinR, d_SlrR, d_SinR_SlrR, bs = 0.01,  //SinR degradiation rate 
			br = 0.01, //SlrR degradiation rate
			bc = 0.002, //complex degradiation rate
			Kf = 0.1, //complex formation rate
			Kd = 0.001, //complex degradation rate
			SinR_Array = [], SinR_times = [], SlrR_Array = [], Complex_Array = [];

		var options = {
			restitution: 1,
			friction:1,
			frictionStatic:1,
			chamfer: p,
			angle: angle,
			frictionAir: 0.85,
			label: phenotype,
			density: 0.005,
			slop:0.01,
		};
		

	

	
		this.body = Bodies.rectangle(x, y, 10+5, l+1, options);
		Composite.add(objects, this.body);
			

		this.grow = function() {
			// If the bacteria isn't labeled as "green", let it grow
			if (this.body.label !== "green") {
				const growthFactorY = 1 + 0.031;  // Growth rate along the Y-axis
				const originalAngle = this.body.angle;  // Store the original angle before scaling
		
				// Temporarily align the bacteria vertically for consistent growth
				Body.rotate(this.body, -originalAngle);
				
				// Grow the bacteria along the Y-axis
				Body.scale(this.body, 1, growthFactorY);
		
				// Restore the bacteria's original orientation
				Body.rotate(this.body, originalAngle);
			}
		};
		
		
		

		this.move = function() {
			// Apply random torque to the bacterium's body
			const TORQUE_VALUE = 40;
			this.body.torque = randomGaussian(0, TORQUE_VALUE);
		
			// Apply random force to the bacterium's body
			const FORCE_VALUE = 2;
			let force = randomGaussian(0, FORCE_VALUE);
			Body.applyForce(
				this.body, 
				{ x: this.body.position.x, y: this.body.position.y },  
				{ x: force, y: force }
			);
		};
		


		// Helper function to get color based on bacterium label
function getColorBasedOnLabel(label) {
    switch (label) {
        case "pink":
            return { fillColor: color(235, 130, 203), strokeColor: color(54, 0, 99) };
        case "green":
            return { fillColor: color(25, 185, 35), strokeColor: color(0, 20, 0) };
        case "blue":
            return { fillColor: color(35, 255, 255), strokeColor: color(0, 0, 200) };
        default:
            return { fillColor: color(255, 255, 255), strokeColor: color(0, 0, 0) };
    }
}

this.displayBacterium = function () {
    let colors;

    if (show_continuous === 1) {
        if (this.body.label === "green") {
            colors = { fillColor: color(0, 255, 0, 200), strokeColor: color(0) };
        } else {
            // Constants for clarity
            const FILL_INTENSITY1 = 30;
            const FILL_INTENSITY2 = 10;

            colors = {
                fillColor: color(SinR * SinR * FILL_INTENSITY1, 255, SlrR *SlrR* FILL_INTENSITY2, 200),
                strokeColor: color(0)
            };
        }
    } else {
        colors = getColorBasedOnLabel(this.body.label);
    }

    const { fillColor, strokeColor } = colors;
    fill(fillColor);
    stroke(strokeColor);

    const originalAngle = this.body.angle;
    Body.rotate(this.body, -originalAngle);
    longitudActual = this.body.bounds.max.y - this.body.bounds.min.y;
    Body.rotate(this.body, originalAngle);

    push();
    rectMode(CENTER);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    strokeWeight(3);

    // Constants for clarity
    const RECT_WIDTH = 10;
    const RECT_CORNER_RADIUS = 10;

    rect(0, 0, RECT_WIDTH, longitudActual - 5, RECT_CORNER_RADIUS);
    pop();
};

		

		

		this.reproduce = function () {
			if (longitudActual >= longitud_de_reproduccion) {
				//	current_positionx=this.body.position.x;
				//	current_positiony=this.body.position.y;
				var move = longitudActual / 4;
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
				longitudActual = largo_max - largo_min;
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


			if ( sensibilidad_to_comX <= 5*comX_conc[cx][cy] && this.body.label == "pink") {
				this.body.label = "green";
			}

		};

		this.signaling_response_to_surfactin = function () {



			if (SinR*7 < sensibilidad_to_surfactin && this.body.label !== "green") {
				this.body.label = "blue";
			} else if (SinR*7 >= sensibilidad_to_surfactin && this.body.label !== "green"){
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
			d_SlrR = ar*(surf_conc[cx][cy]) - br * SlrR - Kf * SlrR * SinR + Kd * SinR_SlrR;
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