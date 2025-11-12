let popSound;
const circleColors = [
  '#90f1ef', // 淺藍
  '#ffd6e0', // 淺粉
  '#ffef9f', // 淺黃
  '#c1fba4', // 淺綠
  '#7bf1a8'  // 深綠 (得分顏色)
];

const canvasBackgroundColor = '#90f1ef';
const numCircles = 30;
let circles = [];
let score = 0; // 得分變數

function preload() {
  popSound = loadSound('pop.mp3',
    () => console.log('✅ 音效載入成功'),
    (err) => console.error('❌ 音效載入失敗', err)
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(canvasBackgroundColor);

  textAlign(LEFT, TOP);
  textSize(32);
  fill('#003049');
  text("1234567", 20, 20);

  for (let i = 0; i < numCircles; i++) {
    circles.push(new Bubble());
  }
}

function draw() {
  background(canvasBackgroundColor);

  // 左上角文字
  fill('#003049');
  textSize(32);
  text("412730334", 20, 20);

  // 右上角得分
  textAlign(RIGHT, TOP);
  text(`Score: ${score}`, width - 20, 20);
  textAlign(LEFT, TOP);

  // 顯示所有氣泡
  for (let bubble of circles) {
    bubble.move();
    bubble.show();
  }
}

function mousePressed() {
  userStartAudio(); // 確保可播放音效

  for (let bubble of circles) {
    if (!bubble.bursted) {
      let d = dist(mouseX, mouseY, bubble.x, bubble.y);
      if (d < bubble.diameter / 2) {
        bubble.burst();

        // 判斷顏色加減分
        if (bubble.baseColor === '#7bf1a8') {
          score++;
        } else {
          score--;
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Bubble 類別
class Bubble {
  constructor() {
    this.reset();
  }

  move() {
    if (!this.bursted) {
      this.y -= this.speed;
      this.x += sin(frameCount * 0.01 + this.xOffset) * this.speed * 0.3;

      if (this.y < -this.diameter / 2) {
        this.reset();
      }
    } else {
      // 更新粒子位置
      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 5;
      }

      // 當粒子透明度消失，重置氣泡
      if (this.particles.length > 0 && this.particles[0].alpha <= 0) {
        this.reset();
      }
    }
  }

  burst() {
    this.bursted = true;

    // 播放音效
    if (popSound && !popSound.isPlaying()) {
      popSound.rate(random(0.95, 1.05));
      popSound.setVolume(0.5);
      popSound.play();
    }

    // 在氣球原本位置產生粒子爆破
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: random(-3, 3),
        vy: random(-3, 3),
        alpha: 255,
        color: this.color
      });
    }
  }

  show() {
    if (this.bursted) {
      noStroke();
      for (let p of this.particles) {
        fill(p.color.levels[0], p.color.levels[1], p.color.levels[2], p.alpha);
        ellipse(p.x, p.y, 10, 10);
      }
    } else {
      // 顯示氣泡
      fill(this.color);
      ellipse(this.x, this.y, this.diameter);

      // 氣泡內的小白方塊裝飾
      let radius = this.diameter / 2;
      let squareSize = this.diameter / 6;
      let squareCenterX = this.x + radius / 2;
      let squareCenterY = this.y - radius / 2;
      let whiteAlpha = map(this.alpha, 50, 200, 100, 200);
      fill(255, 255, 255, whiteAlpha);
      noStroke();
      rectMode(CENTER);
      rect(squareCenterX, squareCenterY, squareSize, squareSize);
      rectMode(CORNER);
    }
  }

  reset() {
    this.x = random(width);
    this.y = random(height, height + 200);
    this.diameter = random(50, 200);
    this.speed = random(0.5, 3.5);
    this.baseColor = random(circleColors);
    this.color = color(this.baseColor);
    this.alpha = random(50, 200);
    this.color.setAlpha(this.alpha);
    this.xOffset = random(100);
    this.bursted = false;
    this.particles = [];
  }
}
