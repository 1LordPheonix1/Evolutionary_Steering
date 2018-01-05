let vehicles = [];
let children = [];
let plants = [];
let poison = [];
const numPlants = 200, numPoison = 30, numVehicles = 15;
const plantsRate = 0.3, poisonRate = 0.1;
const maxPoison = 500;
let currentPoison = poisonRate;

let debug;

function setup() {
	createCanvas(1280, 720);
	// Create Vehicles
	for(let i=0; i<numVehicles; i++) {
		vehicles.push(new Vehicle(random(width), random(height)));
	}

	// Create plants & poison
	for(let i=0; i<numPlants; i++) {
		plants.push(createVector(random(width), random(height)));
	}
	for(let i=0; i<numPoison; i++) {
		poison.push(createVector(random(width), random(height)));
	}

	// Debug checkbox
	debug = select('#debug');
}

function mousePressed() {
	plants.push(createVector(mouseX, mouseY));
}

function draw() {
	background(51);

	// Add more plants and poison
	if(random(1) < plantsRate) {plants.push(createVector(random(width), random(height)));}
	if(random(1) < currentPoison) {poison.push(createVector(random(width), random(height)));}

	// Draw plants
	fill(0, 255, 0);
	noStroke();
	for(let i=0; i<plants.length; i++) {
		ellipse(plants[i].x, plants[i].y, 6, 6);
	}

	// Draw Poison
	fill(255, 0, 0);
	noStroke();
	for(let i=0; i<poison.length; i++) {
		ellipse(poison[i].x, poison[i].y, 6, 6);
	}

	// Vehicle functions
	for(let i=vehicles.length-1; i>= 0; i--) {
		vehicles[i].boundaries();
		vehicles[i].behaviors(plants, poison);
		vehicles[i].update();
		vehicles[i].display();

		let child = vehicles[i].cloneSelf();
		if(child !== null) {
			children.push(child);
		}

		if(vehicles[i].dead()) {
			plants.push(createVector(vehicles[i].pos.x, vehicles[i].pos.y));
			vehicles.splice(i, 1);
		}
	}

	// Add children to vehicle array
	for(let i=0; i<children.length; i++) {
		vehicles.push(children[i]);
	}

	// Reset children
	children = [];

	// If too many poison, lower poison rate
	if(poison.length > maxPoison) {
		currentPoison = 0;
	} else if(poison.length < maxPoison) {
		currentPoison = poisonRate;
	}
}