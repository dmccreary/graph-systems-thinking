/*

Prompt:
Create a simulation of the tragedy of the commons using p5.js.


To simulate the tragedy of the commons in p5.js, 
we'll create a scenario where multiple agents 
(representing individuals) consume a shared 
resource (like grass in a field). The resource 
regenerates over time, but if consumed too rapidly, 
it can deplete, demonstrating the tragedy of overuse.

In this simulation:

The field is divided into small squares, 
each representing a resource unit that regenerates over time.
Agents move randomly and consume the resource they are on.
If the resource is over-consumed (agents consume faster 
    than regeneration), it depletes.
This sketch provides a simple visual representation 
of the tragedy of the commons. Adjust parameters 
like the number of agents, regeneration rate, and 
consumption rate to see different outcomes.
*/

let agents = [];
let resource = [];
let resourceSize = 10;
let regenerationRate = 0.005; // Rate at which resource regenerates

function setup() {
  createCanvas(600, 600);
  // Initialize resource grid
  for (let x = 0; x < width; x += resourceSize) {
    for (let y = 0; y < height; y += resourceSize) {
      resource.push({ x, y, amount: 1 });
    }
  }
  // Create agents
  for (let i = 0; i < 20; i++) {
    agents.push(new Agent(random(width), random(height)));
  }
}

function draw() {
  background(220);
  // Regenerate and draw resources
  for (let r of resource) {
    r.amount = constrain(r.amount + regenerationRate, 0, 1);
    fill(100, 255 * r.amount, 100);
    rect(r.x, r.y, resourceSize, resourceSize);
  }
  // Update and draw agents
  for (let agent of agents) {
    agent.update();
    agent.show();
  }
}

class Agent {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.speed = random(1, 3);
  }

  update() {
    // Move randomly
    this.pos.x += random(-this.speed, this.speed);
    this.pos.y += random(-this.speed, this.speed);
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    // Consume resource
    for (let r of resource) {
      if (dist(this.pos.x, this.pos.y, r.x, r.y) < resourceSize) {
        r.amount -= 0.1; // Consumption rate
        r.amount = max(r.amount, 0);
      }
    }
  }

  show() {
    fill(0);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}
