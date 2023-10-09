// Constants and Configurations

const DIRECTIONS = {UP: {x: 0, y: -1}, DOWN: {x: 0, y: 1}, LEFT: {x: -1, y: 0}, RIGHT: {x: 1, y: 0}, STAY: {x: 0, y: 0}};// Directions object defining four possible directions agents can move in.
const CAPACITY = 2;// Threshold capacity for the number of agents allowed in a cell before they are more likely to move.
const RANDOM_WALK_PROBABILITY = 0.005; // Probability that an agent will randomly move even if the cell is below capacity.
const NUM_AGENTS = 1; // Number of agents in the simulation.
const GRID_SIZE = 64;// Size of the grid (GRID_SIZE x GRID_SIZE). power of 2: 32, 64, 128, 256, 512
const CELL_PIXEL_SIZE = 35;// Size of each cell in pixels when displayed.
const GROWTH_RATE = 1.005; // The rate at which agents grow
const REPRODUCTION_THRESHOLD = 2.0; // Size threshold for reproduction



// Agent Class Definition

// Class representing an individual agent.
class Agent {
    constructor(x, y, size, reproduction_threshold) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.reproduction_threshold=reproduction_threshold;
       
    }
    grow() {
        this.size = this.size*GROWTH_RATE;
    }
    reproduce() {
        if (this.size >= this.reproduction_threshold) {
            // Create child and halve parent size
            agentArray.push(new Agent(this.x, this.y, this.reproduction_threshold/2,gaussianRandom(2,0.5) ));
            this.size /= 2;
        }
    }
    // Method to move the agent based on grid conditions.
    randomWalk() {
        const density = grid[this.y][this.x];
        const shouldMove = density > CAPACITY || Math.random() < RANDOM_WALK_PROBABILITY;
        const directionKeys = Object.keys(DIRECTIONS);
        if (shouldMove) {

            for (let k = 0; k < density; k++) {
            
                

            const direction = DIRECTIONS[directionKeys[Math.floor(Math.random() * directionKeys.length)]];

            // Calculate new potential positions for x and y.
            const newX = this.x + direction.x;
            const newY = this.y + direction.y;
            
            // Handle boundary conditions and update positions.
            if (newX < 0) {
                // Reflects the agent to y-axis (0,y) due to radial symmetry at top-left corner.
                [this.x, this.y] = [Math.abs(newY), 0];
            } else if (newX >= GRID_SIZE) {
                // Standard boundary condition for right side.
                this.x = GRID_SIZE - 1;
            } else  if (newY < 0) {
                // Reflects the agent to x-axis (x,0) due to radial symmetry at top-left corner.
                [this.x, this.y] = [0, Math.abs(newX)];
            } else if (newY >= GRID_SIZE) {
                // Standard boundary condition for bottom side.
                this.y = GRID_SIZE - 1;
            } else {
                [this.x, this.y] = [newX, newY]
            }

        }

        }
    }
}

// Initialize agents and grid

// Create an array of agents, initially positioned at the grid center.
const agentArray = Array.from({length: NUM_AGENTS}, () => new Agent(0,0,1,gaussianRandom(2,0.5)));

// Initialize a 2D grid array with zero density in each cell.
let grid = Array.from({length: GRID_SIZE}, () => Array(GRID_SIZE).fill(0));

// p5.js setup and draw functions

// Setup the canvas size.
function setup() {
    createCanvas(GRID_SIZE * CELL_PIXEL_SIZE + 2, GRID_SIZE * CELL_PIXEL_SIZE + 2);

    
}

// Main loop for the simulation.
function draw() {
    // Move each agent on the grid based on the rules defined in the randomWalk method.
    agentArray.forEach(agent => {
        agent.randomWalk();
        agent.grow();
        agent.reproduce();
    });

    // Reset grid density to zero for all cells.
    grid.forEach(row => row.fill(0));

    // Update the grid with the new agent positions.
    agentArray.forEach(agent => grid[agent.y][agent.x] += 1);

    // Visualization of the grid based on agent density.
    stroke(255);
    strokeWeight(0.08);
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            // Calculate the grayscale color based on the number of agents in each cell.
            if (grid[y][x]>CAPACITY){
            const colorValue=((grid[y][x]-CAPACITY) / (CAPACITY)) * 255;
            fill(colorValue, 50, 50);
            }else{
            const colorValue = (grid[y][x] / (CAPACITY)) * 255;
            fill(colorValue, colorValue, colorValue);
            }
            // Draw each cell.
            rect(CELL_PIXEL_SIZE * x + 1, CELL_PIXEL_SIZE * y + 1, CELL_PIXEL_SIZE, CELL_PIXEL_SIZE);
        }
    }
}

function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}
