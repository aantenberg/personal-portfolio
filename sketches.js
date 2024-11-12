var watchingYouSketch = function(p) {
  class Eye {
    constructor(pos, rad = 40, irisRad = 15, pupilRad = 4) {
      this.pos = pos;
      this.rad = rad;
      this.irisRad = irisRad;
      this.pupilRad = pupilRad
      this.pupilCenter = p.createVector(pos.x, pos.y);
    }
    
    update() {
      const vecFromCenter = p.createVector(p.mouseX - this.pos.x, p.mouseY - this.pos.y);
      vecFromCenter.setMag(Math.min(vecFromCenter.mag(), this.rad - this.irisRad));
      vecFromCenter.add(this.pos);
      this.pupilCenter.x = p.lerp(this.pupilCenter.x, vecFromCenter.x, 0.1);
      this.pupilCenter.y = p.lerp(this.pupilCenter.y, vecFromCenter.y, 0.1);
    }
    
    draw() {
      this.update();
      p.noStroke();
      p.fill(255);
      p.circle(this.pos.x, this.pos.y, this.rad * 2);
      p.fill(48, 180, 240);
      p.circle(this.pupilCenter.x, this.pupilCenter.y, this.irisRad * 2);
      p.fill(51);
      p.circle(this.pupilCenter.x, this.pupilCenter.y, this.pupilRad * 2);
    }
  }
  let eyes = [];
  p.setup = function() {
    let parentDiv = document.getElementById("watchingyousketch");
  let canvasWidth = parentDiv.clientWidth;
  const canvasHeight = 400;
  const numRows = 8;
  const numCols = 18;
  let gap = (canvasWidth / numCols) / 6;
  const eyeRadius = (canvasWidth / numCols) / 2 - gap;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      eyes.push(new Eye(p.createVector(eyeRadius + gap + j * canvasWidth / numCols, eyeRadius + gap + i * canvasHeight / numRows), eyeRadius, eyeRadius / 2, eyeRadius / 2 - 2));
    }
  }
  let result = p.createCanvas(canvasWidth, canvasHeight);
  result.parent("watchingyousketch");
  p.noStroke();
  }

  p.draw = function() {
    p.background(20, 0, 60);
  eyes.forEach(eye => eye.draw());
  }
}

var fairyDustSketch = function(p) {
class Particle {
  constructor(pos, vel = p.createVector(0, 0), acc = p.createVector(0, 0.003), r = 0.5, lifetime = 40) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.r = r;
    this.lifetime = lifetime;
    this.remainingFrames = lifetime;
    this.c = p.color(255, 255, 100 + Math.random() * 155);
  }
  
  step() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.remainingFrames--;
  }
  
  calculateAlpha() {
    return (this.remainingFrames / this.lifetime) * 255;
  }
  
  draw() {
    this.c.setAlpha(this.calculateAlpha());
    p.fill(this.c);
    p.circle(this.pos.x, this.pos.y, this.r * 2);
  }
  
  shouldShow() {
    return this.remainingFrames > 0;
  }
  
  // inFrame() {
  //   return this.pos.x <= CANVAS_WIDTH && this.pos.y <= CANVAS_HEIGHT;
  // }
}
var particles = [];
p.setup = function() {
  let parentDiv = document.getElementById("fairydustparent");
  const CANVAS_WIDTH = parentDiv.clientWidth;
const CANVAS_HEIGHT = 400;
  let canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  p.noStroke();
  canvas.parent('fairydustparent');
}

function spawnParticles(pos, num) {
  for (let i = 0; i < num; i++) {
    const angle = (-1.75 * Math.random() * Math.PI) + (3 * Math.PI / 8);
    const vel = p.createVector(Math.cos(angle) / 10, Math.sin(angle) / 6);
    particles.push(new Particle(pos, vel));
  }
}

p.draw = function() {
  p.background(0);
  if (0 < p.mouseX && p.mouseX < p.width && 0 < p.mouseY && p.mouseY < p.height) {
    spawnParticles(p.createVector(p.mouseX, p.mouseY), 25);
  }
  particles.forEach(particle => particle.step());
  particles.forEach(particle => particle.draw());
  particles = particles.filter(particle => particle.shouldShow())
}
}

var sketch1 = new p5(watchingYouSketch);
var sketch2 = new p5(fairyDustSketch)
