var watchingYouSketch = function (p) {
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
  p.setup = function () {
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

  p.draw = function () {
    p.background(20, 0, 60);
    eyes.forEach(eye => eye.draw());
  }
}

var fairyDustSketch = function (p) {
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
  p.setup = function () {
    let parentDiv = document.getElementById("fairydustsketch");
    const CANVAS_WIDTH = parentDiv.clientWidth;
    const CANVAS_HEIGHT = 400;
    let canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.noStroke();
    canvas.parent('fairydustsketch');
  }

  function spawnParticles(pos, num) {
    for (let i = 0; i < num; i++) {
      const angle = (-1.75 * Math.random() * Math.PI) + (3 * Math.PI / 8);
      const vel = p.createVector(Math.cos(angle) / 10, Math.sin(angle) / 6);
      particles.push(new Particle(pos, vel));
    }
  }

  p.draw = function () {
    p.background(50);
    if (0 < p.mouseX && p.mouseX < p.width && 0 < p.mouseY && p.mouseY < p.height) {
      spawnParticles(p.createVector(p.mouseX, p.mouseY), 25);
    }
    particles.forEach(particle => particle.step());
    particles.forEach(particle => particle.draw());
    particles = particles.filter(particle => particle.shouldShow())
  }
}

var molnarSketch = function (p) {
  p.setup = function () {
    let parentDiv = document.getElementById('molnarsketch');
    let canvasWidth = parentDiv.clientWidth;
    const canvas = p.createCanvas(canvasWidth, canvasWidth);
    p.fill(0);
    p.strokeWeight(2);
    p.frameRate(30);
    const colors = [
      p.color(255, 0, 0),
      p.color(255, 255, 0),
      p.color(255, 255, 255),
      p.color(0, 0, 255),
      p.color(255, 0, 255),
      p.color(0, 255, 255),
    ];
    const colorIndex = p.int(p.random() * colors.length);
    p.stroke(colors[colorIndex])
    canvas.parent('molnarsketch');
  }
  const numLayers = 10;

  let erraticFactor = 5;
  p.draw = function () {
    const mouseInBounds =
      p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height;
    updateErraticFactor(mouseInBounds);
    const shouldRedraw = erraticFactor > 0 || mouseInBounds;
    if (shouldRedraw) {
      p.background(0);
      erraticRect(0, 0, p.width, p.height, erraticFactor, numLayers);
    }
  }

  function updateErraticFactor(mouseInBounds) {
    if (mouseInBounds) {
      erraticFactor++;
    } else if (erraticFactor > 0) {
      erraticFactor /= 1.1;
      if (erraticFactor < 1) {
        erraticFactor = 0;
      }
    }
  }

  function erraticRect(x, y, w, h, factor, numLayers) {
    let distFromEdgeX = 10;
    let distFromEdgeY = 10;
    for (let i = 0; i < numLayers; i++) {
      const left = x + distFromEdgeX;
      const right = x + w - distFromEdgeX;
      const top = y + distFromEdgeY;
      const bottom = y + h - distFromEdgeY;
      singleLayer(left, right, top, bottom, factor);
      distFromEdgeX += w / (2 * numLayers);
      distFromEdgeY += h / (2 * numLayers);
    }
  }
  function singleLayer(left, right, top, bottom, factor) {
    let randomOffset = generateOffset(factor);
    p.beginShape();
    p.vertex(left + randomOffset.x, top + randomOffset.y);
    randomOffset = generateOffset(factor);
    p.vertex(right + randomOffset.x, top + randomOffset.y);
    randomOffset = generateOffset(factor);
    p.vertex(right + randomOffset.x, bottom + randomOffset.y);
    randomOffset = generateOffset(factor);
    p.vertex(left + randomOffset.x, bottom + randomOffset.y);
    p.endShape(p.CLOSE);
  }

  function generateOffset(factor) {
    let randomOffset = p.createVector(p.random(), p.random());
    randomOffset.mult(factor / 20);
    return randomOffset;
  }
}

var sketch1 = new p5(watchingYouSketch);
var sketch2 = new p5(fairyDustSketch)
var sketch3 = new p5(molnarSketch)
