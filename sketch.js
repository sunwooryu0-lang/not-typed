let poster;
let font;
let state = 0;  // 0=포스터 / 1=타이핑 / 2=입력 안내 / 3=입력 모드
let messageLines = ["I am Not Typed", "I am Written"];
let typedLines = ["", ""];
let typingIndex = 0;
let lineIndex = 0;
let userInput = "";

let baseW = 1920;
let baseH = 1080;

function preload() {
  poster = loadImage('NotTyped_Web.png');         // 포스터 이미지
  font = loadFont('NotTyped_font.ttf');     // 손글씨 폰트
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(scaleSize(100));
}

function draw() {
  background(255);

  // 0. 포스터 화면
  if (state === 0) {
    imageMode(CENTER);
    let scaleFactor = min(width / baseW, height / baseH);
    let displayW = baseW * scaleFactor;
    let displayH = baseH * scaleFactor;
    image(poster, width / 2, height / 2, displayW, displayH);
  }

  // 1. 타이핑 애니메이션
  else if (state === 1) {
    fill(0);
    textSize(scaleSize(100));

    let lineSpacing = scaleSize(120);
    let startY = height / 2 - lineSpacing / 2;

    for (let i = 0; i < typedLines.length; i++) {
      text(typedLines[i], width / 2, startY + i * lineSpacing);
    }

    // 타이핑 로직
    if (frameCount % 4 === 0 && lineIndex < messageLines.length) {
      let currentMessage = messageLines[lineIndex];
      if (typingIndex < currentMessage.length) {
        typedLines[lineIndex] += currentMessage.charAt(typingIndex);
        typingIndex++;
      } else {
        lineIndex++;
        typingIndex = 0;
      }
    }
  }

  // 2. 입력 안내 화면
  else if (state === 2) {
    fill(0);
    textSize(scaleSize(60));
    text("Type the sentence you want to display.", width / 2, height / 2 - scaleSize(50));

    textSize(scaleSize(40));
    fill(150);
    text("(Click anywhere to start typing)", width / 2, height / 2 + scaleSize(50));
  }

  // 3. 입력 모드 화면
  else if (state === 3) {
    background(255);
    textAlign(LEFT, TOP);
    fill(0);
    textSize(scaleSize(80));

    let marginX = scaleSize(200);
    let marginY = scaleSize(200);
    let lineHeight = scaleSize(100);

    let lines = userInput.split("\n");
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], marginX, marginY + i * lineHeight);
    }

    // 깜빡이는 커서
    let cursorVisible = frameCount % 60 < 30;
    if (cursorVisible) {
      let lastLine = lines[lines.length - 1];
      let cursorX = marginX + textWidth(lastLine);
      let cursorY = marginY + (lines.length - 1) * lineHeight;
      stroke(0);
      strokeWeight(2);
      line(cursorX, cursorY, cursorX, cursorY + lineHeight * 0.8);
    }
  }
}

function mousePressed() {
  if (state === 0) {
    state = 1; // 포스터 → 타이핑 화면
  } else if (state === 1) {
    state = 2; // 타이핑 → 안내 화면
  } else if (state === 2) {
    state = 3; // 안내 → 입력 모드
    userInput = "";
  }
}

function keyPressed() {
  if (state === 3) {
    if (keyCode === BACKSPACE) {
      userInput = userInput.slice(0, -1);
    } else if (keyCode === ENTER || keyCode === RETURN) {
      userInput += "\n";
    }
  }
}

function keyTyped() {
  if (state === 3) {
    if (key !== 'Backspace' && key !== 'Enter' && key !== 'Return') {
      userInput += key;
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function scaleSize(val) {
  let scaleFactor = min(width / baseW, height / baseH);
  return val * scaleFactor;
}
