

class Bacteria {


	static as = 0.04;
	static ar = 1;
	static bs = 0.01;
	static br = 0.01;
	static bc = 0.002;
	static Kf = 0.1;
	static Kd = 0.001;
	static TORQUE_VALUE = 45;
	static FORCE_VALUE = 2;
	static RECT_WIDTH = 10;
	static RECT_CORNER_RADIUS = 10;
	static OFFSCREEN_MARGIN=200;
	static FILL_INTENSITY1 = 30;
	static FILL_INTENSITY2 = 10;


    constructor(x, y, l, angle, phenotype, sinR, slrR, sinR_slrR) {
        this.initializeAttributes(sinR, slrR, sinR_slrR);
        this.body = this.createBody(x, y, l, angle, phenotype);
        Composite.add(objects, this.body);
		
	
			
    }

    initializeAttributes(sinR, slrR, sinR_slrR) {
        this.longitud_de_reproduccion = randomGaussian(70, 11);
        this.sensibilidad_to_comX = randomGaussian(23, 4);
        this.sensibilidad_to_surfactin = randomGaussian(0.9, 0.20);
        this.setGeneAttributes(sinR, slrR, sinR_slrR);
		this.growthRate =1+randomGaussian(0.031, 0.008);
    }

    setGeneAttributes(sinR, slrR, sinR_slrR) {
        this.SinR = sinR;
        this.SlrR = slrR;
        this.SinR_SlrR = sinR_slrR;
    }

    

    createBody(x, y, l, angle, phenotype) {
        const options = {
            restitution: 1,
            friction: 1,
            frictionStatic: 1,
            chamfer: 0.5,
            angle: angle,
            frictionAir: 0.85,
            label: phenotype,
            density: 0.005,
            slop: 0.01
        };
        return Bodies.rectangle(x, y, Bacteria.RECT_WIDTH + 5, l + 1, options);
    }

    grow() {
        if (this.body.label !== "green") {
            this.growYAxis();
        }
    }

    growYAxis() {
        const originalAngle = this.body.angle;
        Body.rotate(this.body, -originalAngle);
        Body.scale(this.body, 1, this.growthRate);
        Body.rotate(this.body, originalAngle);
    }

    move() {
        this.body.torque = randomGaussian(0, Bacteria.TORQUE_VALUE);
        const force = randomGaussian(0, Bacteria.FORCE_VALUE);
        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, { x: force, y: force });
    }

    displayBacterium() {
        const colors = this.getColors();
        this.setColorsAndDrawRect(colors.fillColor, colors.strokeColor);
    }

    getColors() {
        if (show_continuous) {
            return this.body.label === "green" ?
                { fillColor: color(0, 255, 0, 200), strokeColor: color(0) } :
                { fillColor: color(this.SinR * this.SinR * Bacteria.FILL_INTENSITY1, 255, this.SlrR * this.SlrR * Bacteria.FILL_INTENSITY2, 200), strokeColor: color(0) };
        }
        return getColorBasedOnLabel(this.body.label);
    }

    setColorsAndDrawRect(fillColor, strokeColor) {
        fill(fillColor);
        stroke(strokeColor);
        this.prepareForDrawing();
        rect(0, 0, Bacteria.RECT_WIDTH, this.longitudActual - 5, Bacteria.RECT_CORNER_RADIUS);
        pop();
    }

    prepareForDrawing() {
        const originalAngle = this.body.angle;
        Body.rotate(this.body, -originalAngle);
        this.longitudActual = this.body.bounds.max.y - this.body.bounds.min.y;
        Body.rotate(this.body, originalAngle);
        push();
        rectMode(CENTER);
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        strokeWeight(3);
    }


		reproduce() {
			if (this.longitudActual < this.longitud_de_reproduccion) return;
	
			const offspringDetails = this.calculateOffspringDetails();
			
			const offspringBacterium = new Bacteria(
				offspringDetails.x, offspringDetails.y, offspringDetails.size, 
				offspringDetails.angle, this.body.label, 
				this.SinR, this.SlrR, this.SinR_SlrR
			);
	
			this.adjustAfterReproduction(offspringDetails.moveDistance);
			Composite.add(objects, offspringBacterium);
			bacteria_array.push(offspringBacterium);
		}
	
		calculateOffspringDetails() {
			const moveDistance = this.longitudActual / 4;
			return {
				x: this.body.position.x - moveDistance * sin(this.body.angle),
				y: this.body.position.y + moveDistance * cos(this.body.angle),
				size: (this.longitud_de_reproduccion / 2) - 1,
				angle: this.body.angle + PI,
				moveDistance
			};
		}
	
		adjustAfterReproduction(distance) {
			Body.translate(this.body, {
				x: distance * sin(this.body.angle),
				y: -distance * cos(this.body.angle)
			});
			this.resizeBacterium(0.5);
		}
	
		resizeBacterium(scaleY) {
			const originalAngle = this.body.angle;
			Body.rotate(this.body, -originalAngle);
			Body.scale(this.body, 1, scaleY);
			this.longitudActual = this.body.bounds.max.y - this.body.bounds.min.y;
			Body.rotate(this.body, originalAngle);
		}
	
		// For the following methods, we can use the 'getGridPosition' method 
		// to avoid repetition of grid position calculations.
		getGridPosition() {
			return {
				x: Math.floor(this.body.position.x / GRID_CONFIG.RECT_SIZE),
				y: Math.floor(this.body.position.y / GRID_CONFIG.RECT_SIZE)
			};
		}
	
		produce_pink() {
			const { x, y } = this.getGridPosition();
			comX_conc[x][y] += P;
		}
	
		produce_surfactin() {
			const { x, y } = this.getGridPosition();
			surf_conc[x][y] += (this.body.label === "green") ? P2 : 0;
		}
	
		isOffScreen() {
			
			return this.body.position.x <= Bacteria.OFFSCREEN_MARGIN || this.body.position.x >= N - Bacteria.OFFSCREEN_MARGIN || 
				   this.body.position.y <= Bacteria.OFFSCREEN_MARGIN || this.body.position.y >= N - Bacteria.OFFSCREEN_MARGIN;
		}
	
		signaling_response_to_pink() {
			const { x, y } = this.getGridPosition();
			if (this.sensibilidad_to_comX <= 5 * comX_conc[x][y] && this.body.label === "pink") {
				this.body.label = "green";
			}
		}
	
		signaling_response_to_surfactin() {
			if (this.body.label !== "green") {
				this.body.label = this.SinR * 7 < this.sensibilidad_to_surfactin ? "blue" : "pink";
			}
		}
	
		removeFromWorld() {
			Composite.remove(objects, this.body);
		}
	
		internal_circuit() {
			const { x, y } = this.getGridPosition();
	
			const d_SinR = (Bacteria.as / (1 + this.SlrR * 10)) - (Bacteria.bs * this.SinR) - 
							(Bacteria.Kf * this.SlrR * this.SinR) + (Bacteria.Kd * this.SinR_SlrR);
			const d_SlrR = (Bacteria.ar * surf_conc[x][y]) - (Bacteria.br * this.SlrR) - 
							(Bacteria.Kf * this.SlrR * this.SinR) + (Bacteria.Kd * this.SinR_SlrR);
			const d_SinR_SlrR = -Bacteria.bc * this.SinR_SlrR + 
								 (Bacteria.Kf * this.SinR * this.SlrR) - (Bacteria.Kd * this.SinR_SlrR);
	
			this.SinR += d_SinR;
			this.SlrR += d_SlrR;
			this.SinR_SlrR += d_SinR_SlrR;
		}
	
	}
	

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