// Physics engine variables
var Engine = Matter.Engine,
	Bodies = Matter.Bodies,
	Body = Matter.Body,
	Composite = Matter.Composite,
	Runner = Matter.Runner,
	engine = Engine.create(),
	objects = Composite.create();

// Bacteria simulation parameters
var bacteria_array = [],
	P = 0.007, // Production of Comx
	P2 = 0.7, // Production of Surfactin
	K = 5,    // Diffusion loops
	A = 100;  // Difussion + matter.js loops

// Grid settings
const GRID_SIZE = 51;
const RECT_SIZE = 30;
var comX_conc = new Array(GRID_SIZE).fill(0).map(() => new Array(GRID_SIZE).fill(0)),
	surf_conc = new Array(GRID_SIZE).fill(0).map(() => new Array(GRID_SIZE).fill(0));

	

// Additional parameters
const N = 1530; // 620x620 canvas  GRID_SIZE*RECT_SIZE
var loops = 0,  // Simulation steps
	show_concentration = 2;

p5.disableFriendlyErrors = true;
show_continuous=0; // 1 means that the color of the bacteria will be continous, 0 means binary


const NUM_BACTERIA = 5; // Define constant for the number of bacteria

// Function to create a bacterium
function createBacterium(x, y, size, angle, color, param1, param2, param3, param4) {
	const bacterium = new Bacteria(x, y, size, angle, color, param1, param2, param3, param4);
	bacteria_array.push(bacterium);
	bacterium.show_1();
	return bacterium;
}

function setup() {
	
	noLoop(); // The simulation do not start until I execute loop()
	for (let i = 0; i < GRID_SIZE; i++) {
		comX_conc[i] = new Array(GRID_SIZE).fill(0);
		surf_conc[i] = new Array(GRID_SIZE).fill(0);
	}

	// Create bacteria
	for (let y = 0; y < NUM_BACTERIA; y++) {
		createBacterium(random((N*2)/5, (N*3)/5), random((N*2)/5, (N*3)/5), 40, random(0, PI), "pink", 2.5, 0.5, 1, 1);
	}

	createCanvas(N, N);
	pixelDensity(1);
	world = engine.world;
	Runner.run(engine);
	Composite.add(world, objects);
	engine.gravity.y = 0;

	// Define engine settings
	engine.positionIterations = 10; // The bigger the slower, but the accuracy increases
	engine.constraintIterations = 2; // The bigger the slower, but the accuracy increases
	engine.velocityIterations = 10; // The bigger the slower, but the accuracy increases
	

	background(255);
	strokeWeight(1);
}

let final = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)); 

	function diffusion(initial) {
		const diffusionConstant = 0.5 * 0.5* 0.5 ;
	
		for(let k = 0; k <= K; k++) {
			// Zero the edges of the final array (absorbing Dirichlet boundary conditions)
			for(let j = 0; j <= 50; j++) {
				final[0][j] = final[50][j] = final[j][0] = final[j][50] = 0;
			}
			final[50][50] = final[50][49];
			final[0][50] = final[0][49];
			final[0][0] = final[0][1];
			final[50][0] = final[50][1];
	
			// Iterate through interior grid points
			for(let i = 1; i <= 49; i++) {
				for(let j = 1; j <= 49; j++) {
					const current = initial[i][j];
					final[i][j] = current + diffusionConstant * ((initial[i+1][j] + initial[i][j+1] + initial[i-1][j] + initial[i][j-1]) - 4 * current);
				}
			}
	
			// Swap initial and final arrays
			[initial, final] = [final, initial];
		}
	
		return initial; // Return the modified array
	}
	
	

	// Do all the activities that related to bacterial metabolism and signalling
	function updateBacteria() {
		for (var i =0;  i < bacteria_array.length; i++){
		bacteria_array[i].show_1(); 
		bacteria_array[i].move();
		bacteria_array[i].reproduce();
		bacteria_array[i].grow();
		bacteria_array[i].signaling_response_to_pink();
		bacteria_array[i].signaling_response_to_surfactin();
		if(bacteria_array[i].isOffScreen()){
		bacteria_array[i].removeFromWorld();
		bacteria_array.splice(i,1);
		i--;
		}
		}
	  }

	  //Show the concentrations of the signalling molecules
	  function drawGrid() {
		stroke(150);
		strokeWeight(0.5);
		for (var j = 0; j < GRID_SIZE; j++) {
			for (var i = 0; i < GRID_SIZE; i++) {
			  let colorValue;
			  switch (show_concentration) {
				case 0:
				  colorValue = 255 - comX_conc[i][j] * (255 / 3);
				  fill(255, colorValue, 255, 255);
				  break;
				case 1:
				  colorValue = 255 - surf_conc[i][j] * (255 / 1);
				  fill(colorValue, 255, colorValue, 255);
				  break;
				case 2:
				  fill(255, 255, 255, 255);
				  break;
			  }
			  rect(RECT_SIZE * i + 1, RECT_SIZE * j + 1, RECT_SIZE, RECT_SIZE);
			}
		  }
	  }

	  // P5.js infinite loop that shows the state of the simulation
	  function animate() {
		for(var a = 0; a <= A; a++) {
			for (var i = 0; i < bacteria_array.length; i++) {
				const bacteria = bacteria_array[i];
				bacteria.produce_pink();
				bacteria.produce_surfactin();
				bacteria.internal_circuit();
			}
			comX_conc = diffusion(comX_conc);
			surf_conc = diffusion(surf_conc);
		}
	
		drawGrid();
		updateBacteria();
	
		for (var i = 0; i < 15; i++) {
			Engine.update(engine, 1);
		}
		requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
	





