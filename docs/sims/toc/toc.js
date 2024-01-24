/*

Title: Tragedy of the Commons Version 3
In this version:

Each agent evaluates its surroundings to locate the region with the highest resource amount.
Agents move towards this region, demonstrating a preference for areas with more resources.

TODO: Fix the bug where the cows all go up to the left
*/

// should be divisible by resourceSize
let canvasWidth = 600;
let drawHeight = 400;
let canvasHeight = 460;

// list of cows
let agents = [];
// list of cells for grass health
let resource = [];
let resourceSize = 10; // size of each grass cell both x and y
let regenerationRate = 0.005;
// slider for the number of cows
let agentSlider;
let gridWidth, gridHeight;
let simulationRunning = true;

function setup() {
  
  const canvas = createCanvas(canvasWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(16);
  
  startStopButton = createButton('Start/Stop');
  startStopButton.position(10, drawHeight + 30);
  startStopButton.mousePressed(toggleSimulation);

  resetButton = createButton('Reset');
  resetButton.position(100, drawHeight + 30);
  resetButton.mousePressed(resetSimulation);
  
  // how many grids cells wide and high
  gridWidth = width / resourceSize;
  gridHeight = drawHeight / resourceSize;
  
  // slider to control the number of cows in the field
  agentSlider = createSlider(1, 100, 50);
  agentSlider.position(170, drawHeight + 5);
  agentSlider.size(canvasWidth - 190);

  initializeResources();
}

function draw() {
  if (!simulationRunning) return;

  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight-drawHeight);
  
  // draw the grass
  displayResources();
  // display the cows
  updateAgents();
  
  fill('black');
  text('Number of Cows: ' + agentSlider.value(), 10, drawHeight+20)
}

function initializeResources() {
  resource = [];
  
  // for each cell of grass, set it to be a random float
  for (let x = 0; x < width; x += resourceSize) {
    for (let y = 0; y < drawHeight; y += resourceSize) {
      resource.push({ x, y, amount: random(0, 1)*.75 + .25 });
    }
  }
}

function updateAgents() {
  
  // get a new value for the cow count
  let numAgents = agentSlider.value();
  
  // if the slider has changed lower, pop cows off the list
  while (agents.length > numAgents) {
    agents.pop();
  }
  
  // if the slider has gone up, push some new ones on the list
  while (agents.length < numAgents) {
    agents.push(new Agent(random(width), random(drawHeight)));
  }

  // for every cow, update the direction, grass level and show the position
  for (let agent of agents) {
    agent.update();
    agent.show();
  }
}

// draw all the grass cells
function displayResources() {
  for (let r of resource) {
    r.amount = constrain(r.amount + regenerationRate, 0, 1);
    // red green blue
    fill(100, 255 * r.amount, 100);
    rect(r.x, r.y, resourceSize, resourceSize);
  }
}

class Agent {
  
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.speed = 2;
    // start each agent in a random direction
    this.dir = createVector(random(-1,1), random(-1,1));
  }

  update() {
    
    // Find the greenest nearby region
    let targetResource = null;
    let maxAmount = 0;
    
    // calculate the direction of the greenest cell around
    for (let r of resource) {
      let d = dist(this.pos.x, this.pos.y, r.x, r.y);
      if (d < resourceSize * 2 && r.amount > maxAmount) {
        maxAmount = r.amount;
        targetResource = r;
      }
    }

    if (targetResource) {
      // calculate the direction
      let dir = createVector(targetResource.x - this.pos.x, 
                             targetResource.y - this.pos.y);
      dir.setMag(this.speed);
      this.pos.add(dir);
    }

    // don't go outside the canvas region
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, drawHeight);

    for (let r of resource) {
      if (dist(this.pos.x, this.pos.y, r.x, r.y) < resourceSize) {
        r.amount -= 0.1;
        r.amount = max(r.amount, 0);
      }
    }
  }

  show() {
    // console.log(this.pos.x, this.pos.y)
    //noStroke();
    fill('tan');
    circle(this.pos.x, this.pos.y, 15);
  }
}

function toggleSimulation() {
  simulationRunning = !simulationRunning;
}

function resetSimulation() {
  initializeResources();
  agents = [];
  // draw the grass
  displayResources();
  // display the cows
  updateAgents();
}