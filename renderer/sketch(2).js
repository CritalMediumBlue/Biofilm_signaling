

// Physics engine constiables
const Engine = Matter.Engine,
	Bodies = Matter.Bodies,
	Body = Matter.Body,
	Composite = Matter.Composite,
	Runner = Matter.Runner,
	engine = Engine.create(),
	objects = Composite.create();

// Bacteria simulation parameters
let bacteria_array = [],
	P = 0.2, // Production of Comx //Should be 0.01 !!
	P2 = 0.2, // Production of Surfactin //Should be 0.01 !!
	P3 = 0.2 // Production of Matrix
	K = 2,    // Diffusion loops
	A = 2,  // Difussion + matter.js loops
	killThem = 0,
	bacteriaCounts = [];

// Grid settings
const GRID_CONFIG  = {
    SIZE: 60+1,
    RECT_SIZE: 60  //50 micrometers
};

function initArray(size, value) {
    return new Array(size).fill(0).map(() => new Array(size).fill(value));
}

let comxConc = initArray(GRID_CONFIG.SIZE, 0),
    surfConc = initArray(GRID_CONFIG.SIZE, 0),
	matrConc = initArray(GRID_CONFIG.SIZE, 0),
	cellConc = initArray(GRID_CONFIG.SIZE, 0);
	

// Additional parameters
const N = GRID_CONFIG.SIZE*GRID_CONFIG.RECT_SIZE; // 620x620 canvas  
let loops = 0,  // Simulation steps
	show_concentration = 1;

//p5.disableFriendlyErrors = true;
show_continuous=0; // 1 means that the color of the bacteria will be continous, 0 means binary


const NUM_BACTERIA = 1; // Define constant for the number of bacteria

// Function to create a bacterium
function createBacterium(x, y, size, angle, color, param1, param2, param4) {
	const bacterium = new Bacteria(x, y, size, angle, color, param1, param2, param4);
	bacteria_array.push(bacterium);
	bacterium.displayBacterium();
	return bacterium;
}

function setup() {
	

	// Create bacteria
	for (let y = 0; y < NUM_BACTERIA; y++) {
		createBacterium(random((N)/2, (N)/2), random((N)/2, (N)/2), random(25,55), random(0, PI), "pink", 2.5, 0.5, 1, 1);
	}
	

	createCanvas(N, N);
	pixelDensity(1);
	world = engine.world;
	Runner.run(engine);
	Composite.add(world, objects);
	engine.gravity.y = 0;

	// Define engine settings
	engine.positionIterations = 8; // The bigger the slower, but the accuracy increases
	engine.constraintIterations = 2; // The bigger the slower, but the accuracy increases
	engine.velocityIterations = 8; // The bigger the slower, but the accuracy increases
	

	background(255);
	strokeWeight(1);
}

let final = Array(GRID_CONFIG.SIZE).fill(null).map(() => Array(GRID_CONFIG.SIZE).fill(0)); 

	function diffusion(initial, constant) {
		const diffusionConstant = constant ;
	
		for(let k = 0; k <= K; k++) {
			// Zero the edges of the final array (absorbing Dirichlet boundary conditions)
			for(let j = 0; j <= GRID_CONFIG.SIZE-1; j++) {
				final[0][j] = final[GRID_CONFIG.SIZE-1][j] = final[j][0] = final[j][GRID_CONFIG.SIZE-1] = 0;
			}
			final[GRID_CONFIG.SIZE-1][GRID_CONFIG.SIZE-1] = final[GRID_CONFIG.SIZE-1][GRID_CONFIG.SIZE-2];
			final[0][GRID_CONFIG.SIZE-1] = final[0][GRID_CONFIG.SIZE-2];
			final[0][0] = final[0][1];
			final[GRID_CONFIG.SIZE-1][0] = final[GRID_CONFIG.SIZE-1][1];
	
			// Iterate through interior grid points
			for(let i = 1; i <= GRID_CONFIG.SIZE-2; i++) {
				for(let j = 1; j <= GRID_CONFIG.SIZE-2; j++) {
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
		for (let i =0;  i < bacteria_array.length; i++){
		bacteria_array[i].displayBacterium(); 
		bacteria_array[i].move();
		bacteria_array[i].reproduce();
		bacteria_array[i].grow();
		bacteria_array[i].differentiation();
		bacteria_array[i].internal_circuit();
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
		for (let j = 0; j < GRID_CONFIG.SIZE; j++) {
			for (let i = 0; i < GRID_CONFIG.SIZE; i++) {
			  let colorValue;
			  switch (show_concentration) {
				case 0:
				  colorValue = 255 - comxConc[i][j] *(255 /30);
				  fill(255, colorValue, 255, 255);
				  break;
				case 1:
				  colorValue = 255 - surfConc[i][j] * (100);
				  fill(colorValue, 255, colorValue, 255);
				  break;
				case 2:
				  colorValue = 255 - matrConc[i][j] ;
				  fill(colorValue, colorValue, 255, 255);
				  break;

				  
			  }
			  rect(GRID_CONFIG.RECT_SIZE * i + 1, GRID_CONFIG.RECT_SIZE * j + 1, GRID_CONFIG.RECT_SIZE, GRID_CONFIG.RECT_SIZE);
			}
		  }
	  }

	  // P5.js infinite loop that shows the state of the simulation
	  function animate() {
		for(let a = 0; a <= A; a++) {

			for (let i = 0; i < bacteria_array.length; i++) {

				bacteria_array[i].produce_signal();
				
			}
			comxConc = diffusion(comxConc, 0.125);
			surfConc = diffusion(surfConc, 0.125);
			matrConc = diffusion(matrConc, 0.001);
		}
	
		drawGrid();
		updateBacteria();
	
		for (let i = 0; i < 4; i++) {
			Engine.update(engine, 1);
		}
		countBacteriaColors();
		requestAnimationFrame(animate);

	
		

}

function countBacteriaColors() {
	let pinkCount = 0, blueCount = 0, greenCount = 0, grayCount = 0;

	bacteria_array.forEach(bacteria => {
		switch (bacteria.body.label) {
			case "pink": pinkCount++; break;
			case "blue": blueCount++; break;
			case "green": greenCount++; break;
			case "gray" : grayCount++; break;
		}
	});

	bacteriaCounts.push([pinkCount, blueCount, greenCount, grayCount]);
}
function arrayToCSV(data) {
    return data.map(row => row.join(",")).join("\n");
}
function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8," + arrayToCSV([["pink", "blue", "green", "gray"], ...bacteriaCounts]);
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bacteria_counts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

requestAnimationFrame(animate);
	





