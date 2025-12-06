let position = 0;
let p = [];
let crf = 200;
let crs = 255;
let cw;
let ch;
let d;
let c;
let x;
let y;
let z;
let base;
let dist;
let speed = 0.005;
let num = 500;
let off = false;
let pane;

let clouds = [];
let cloudNoiseOffset = 0;
let cloudSpacing = 30;

let train = null;
let trainTimer = 0;
let trainNoiseOffset = 0;
let trainReady = true;
let trainSpeed = 3;

let hillHeight = 100;
let treeNoiseOffset = 0;

let angleStep = 0.1;
let radius = 100;

let sound = [];
let sound_len = 0;

let dayNightCycleDuration = 300000;
let dayColor, nightColor, hillDayColor, hillNightColor, treeDayColor, treeNightColor;

function preload() {
  sound[0] = loadSound('train_horn.mp3');
  sound[1] = loadSound('bird_chirp.mp3');
  sound[2] = loadSound('final_background.wav');
  sound[3] = loadSound('Flight-v2.mp3');
  sound_len = sound.length;
}

function setup() {
  cw = windowWidth;
  ch = windowHeight;
  dist = random(30, 80);
  createCanvas(windowWidth, windowHeight);

  dayColor = color("#87CEEB");
  nightColor = color("#0D1B2A");
  hillDayColor = color(60, 180, 75);
  hillNightColor = color(20, 60, 40);
  treeDayColor = color(34, 139, 34);
  treeNightColor = color(10, 50, 10);

  setupTweakpane();
  createBirds();
  createInitialClouds();
}

function getCurrentCycleColors() {
  let adjustedMillis = (millis() + dayNightCycleDuration / 2) % dayNightCycleDuration;
  let t = adjustedMillis / dayNightCycleDuration;
  let cycleProgress = t < 0.5 ? t * 2 : (1 - t) * 2;

  return {
    background: lerpColor(nightColor, dayColor, cycleProgress),
    hill: lerpColor(hillNightColor, hillDayColor, cycleProgress),
    tree: lerpColor(treeNightColor, treeDayColor, cycleProgress),
    birdMin: lerpColor(color(100), color(200), cycleProgress),
    birdMax: lerpColor(color(150), color(255), cycleProgress),
    cloud: lerpColor(color(100, 100, 120), color(220, 240, 255), cycleProgress)
  };
}

function createBirds() {
  p = [];
  for (let i = 0; i < num; i++) {
    let angle = i * angleStep;
    let r1 = radius + noise(i * 0.1) * 50;
    let r2 = radius + noise(i * 0.1 + 1000) * 50;
    d = noise(i) * 15;
    c = createVector(random(0, cw), random(0, ch));
    x = createVector(
      random(cos(noise(-dist * cos(angle) * r1)), sin(noise(-dist * cw * cos(angle) * r1))),
      random(cos(noise(dist * sin(angle) * r1)), sin(noise(dist * cw * sin(angle) * r1)))
    );
    y = createVector(
      random(cos(noise(-dist * cos(angle + PI / 4) * r2)), sin(noise(-dist * ch * cos(angle + PI / 4) * r2))),
      random(cos(noise(dist * sin(angle + PI / 4) * r2 + ch / 2)), sin(noise(dist * c * sin(angle + PI / 4) * r2 + ch / 2)))
    );
    let shade = map(noise(i * 0.1), 0, 1, 0, 1);
    p[i] = new Bird(c, d, x, y, shade);
  }
}

function draw() {
  let cycleColors = getCurrentCycleColors();
  background(cycleColors.background);
  noStroke();

  cloudNoiseOffset += 0.01;
  if (noise(cloudNoiseOffset) > 0.95 && clouds.length < 15) {
    let x = -200;
    if (clouds.every(cloud => abs(cloud.x - x) > cloudSpacing)) {
      clouds.push(new Cloud(x));
    }
  }

  for (let cloud of clouds) {
    cloud.move();
    cloud.display(cycleColors);
  }

  if (!train && trainReady) {
    trainNoiseOffset += 0.005;
    let waitTime = map(noise(trainNoiseOffset), 0, 1, 10000, 90000);
    trainTimer = millis() + waitTime;
    trainReady = false;
  }

  if (!train && millis() > trainTimer) {
    train = new Train();
  }

  drawHillsAndTrees();

  if (train) {
    train.update();
    train.display();
    if (train.hasEnteredScreen()) trainReady = false;
    if (train.isOffscreen()) {
      train = null;
      trainReady = true;
    }
  }

  if (off) return;

  for (let i = 0; i < num; i++) {
    p[i].updateColor(cycleColors);
    p[i].display();
    p[i].move();
  }

  position += speed;
  if (!sound[2].isPlaying()) {
    sound[2].setVolume(0.1);
    sound[2].play();
  }
  if (!sound[3].isPlaying()) {
    sound[3].setVolume(1.9);
    sound[3].play();
  }
}

class Bird {
  constructor(coords, diameter, offsetx, offsety, shade) {
    this.coords = coords;
    this.diam = diameter;
    this.offsetx = offsetx;
    this.offsety = offsety;
    this.shade = shade;
    this.col = color(255);
  }
  updateColor(cycleColors) {
    this.col = lerpColor(cycleColors.birdMin, cycleColors.birdMax, this.shade);
  }
  display() {
    fill(this.col);
    circle(this.coords.x, this.coords.y, this.diam);
  }
  move() {
    let x1 = position + this.offsetx.x;
    let y1 = position + this.offsetx.y;
    let x2 = position + this.offsety.x;
    let y2 = position + this.offsety.y;
    this.coords.x = map(noise(x1, y1, sin(x2), cos(y2)), 0, 1, 0, width);
    this.coords.y = map(noise(x2, y2, cos(y1), sin(x1)), 0, 1, 0, height);
  }
}

function createInitialClouds() {
  let maxAttempts = 2000;
  let attempts = 0;
  while (clouds.length < 10 && attempts < maxAttempts) {
    let x = random(-200, width);
    if (clouds.every(cloud => abs(cloud.x - x) > cloudSpacing)) {
      clouds.push(new Cloud(x));
    }
    attempts++;
  }
}

function drawPineTree(x, baseY, treeWidth, treeHeight, treeColor) {
  let layers = 3;
  let layerHeight = treeHeight / layers;
  fill(treeColor);
  for (let i = 0; i < layers; i++) {
    let layerTop = baseY - (i + 1) * layerHeight + i * 5;
    let layerBottom = baseY - i * layerHeight + i * 5;
    let layerW = treeWidth * (1.2 - i * 0.3);
    triangle(
      x - layerW / 2, layerBottom,
      x + layerW / 2, layerBottom,
      x, layerTop
    );
  }
  fill(101, 67, 33);
  rect(x - treeWidth * 0.1, baseY, treeWidth * 0.2, treeHeight * 0.2);
}

function drawHillsAndTrees() {
  let cycleColors = getCurrentCycleColors();
  noStroke();
  fill(cycleColors.hill);
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let nx = x * 0.005;
    let y = height - hillHeight - noise(nx) * 50;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  treeNoiseOffset += 0.002;
  for (let x = 0; x < width; x += 3) {
    let n = noise(x * 0.01 + treeNoiseOffset);
    if (n > 0.55) {
      let baseY = height - hillHeight - noise(x * 0.005) * 50;
      let treeScale = map(n, 0.55, 1, 0.5, 2);
      let treeHeight = 40 * treeScale;
      let treeWidth = 12 * treeScale;
      drawPineTree(x, baseY, treeWidth, treeHeight, cycleColors.tree);
    }
  }
}

class Cloud {
  constructor(startX) {
    this.x = startX || -200;
    this.y = random(height * 0.1, height * 0.9);
    this.size = random(100, 180);
    let noiseVal = noise(this.x * 0.01);
    let eased = pow(1 - noiseVal, 2);
    this.speed = map(eased, 0, 1, 25, 350) / 60;
    this.shapeSeed = random(1000);
    this.ovalCount = floor(map(noise(this.shapeSeed), 0, 1, 3, 7));
  }
  move() {
    this.x += this.speed;
    if (this.x > width + 200) {
      this.x = -250;
      this.y = random(height * 0.1, height * 0.5);
      this.size = random(100, 180);
      let noiseVal = noise(this.x * 0.01);
      let eased = pow(1 - noiseVal, 2);
      this.speed = map(eased, 0, 1, 25, 350) / 60;
      this.shapeSeed = random(1000);
      this.ovalCount = floor(map(noise(this.shapeSeed), 0, 1, 3, 7));
    }
  }
  display(cycleColors) {
    noStroke();
    for (let i = 0; i < this.ovalCount; i++) {
      let n = noise(this.shapeSeed + i);
      let offsetX = map(n, 0, 1, -this.size * 0.6, this.size * 0.6);
      let offsetY = map(noise(this.shapeSeed - i), 0, 1, -20, 20);
      let alpha = map(noise(this.shapeSeed + i * 2), 0, 1, 80, 180);
      let radiusX = map(noise(this.shapeSeed + i * 3), 0, 1, this.size * 0.3, this.size * 0.6);
      let radiusY = map(noise(this.shapeSeed + i * 4), 0, 1, this.size * 0.2, this.size * 0.5);
      let angle = map(noise(this.shapeSeed + i * 5), 0, 1, -PI / 4, PI / 4);
      fill(cycleColors.cloud.levels[0], cycleColors.cloud.levels[1], cycleColors.cloud.levels[2], alpha);
      push();
      translate(this.x + offsetX, this.y + offsetY);
      rotate(angle);
      ellipse(0, 0, radiusX, radiusY);
      pop();
    }
  }
}

class Train {
  constructor() {
    this.blocks = [];
    this.totalWidth = 0;
    this.x = -1500;
    this.y = height - 40;
    this.speed = trainSpeed;
    this.timer = 0;
    let count = floor(random(10, 40));
    for (let i = 0; i < count; i++) {
      let w = random(30, 80);
      let h = random(30, 80);
      this.blocks.push({ w, h });
      this.totalWidth += w;
    }
  }
  update() {
    this.x += this.speed;
    if (this.hasEnteredScreen() && !this.isOffscreen()) {
      if (this.timer === 0) {
        sound[0].setVolume(0.1);
        sound[0].play();
        this.timer = random(30, 90);
      }
    }
    if (this.timer > 0) {
      this.timer--;
    }
  }
  display() {
    let drawX = this.x;
    for (let block of this.blocks) {
      fill(0);
      rect(drawX, this.y - block.h, block.w, block.h);
      drawX += block.w;
    }
  }
  isOffscreen() {
    return this.x > width + 200;
  }
  hasEnteredScreen() {
    return this.x > -100;
  }
}

function setupTweakpane() {
  pane = new Tweakpane.Pane();
  pane.addInput({ num }, 'num', { min: 100, max: 2000, step: 50 }).on('change', (ev) => {
    num = ev.value;
    createBirds();
  });
  pane.addInput({ speed }, 'speed', { min: 0.001, max: 0.02, step: 0.001 }).on('change', (ev) => {
    speed = ev.value;
  });
  pane.addInput({ trainSpeed }, 'trainSpeed', { min: 1, max: 10, step: 0.5 }).on('change', (ev) => {
    trainSpeed = ev.value;
  });
}
