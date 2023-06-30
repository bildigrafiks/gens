//https://api.openweathermap.org/data/2.5/weather?lat={41.43}&lon={1.59}&appid={49825ff466b207391d701124b9f22ede}

/* TEXT TO SHAPES - reworked textToPoints function
Jeff Thompson | 2021 | jeffreythompson.org 
FONT: TGL BY PETER WIEGEL, SIL Open Font License, 1.1
http://www.peter-wiegel.de/TGL_0-16.html */
/*
// make voids move without overlapping
// https://youtu.be/uAfw-ko3kB8
https://github.com/CodingTrain/website-archive/blob/main/beginners/p5js/7.6-object-communication-1/P5/sketch.js
https://github.com/CodingTrain/website-archive/tree/main/beginners/p5js/7.7-object-communication-2/P5
*/

p5.disableFriendlyErrors = true;

let letters; // LIST OF SHAPES
let inputTextFocus;
let cnv;

// VARIABLES FOR FONT PRELOADING
let font;
let inFSize = 600;

// TEXT TO POINTS SETTINGS
let msg = "gens",
  fSize = inFSize,
  sampleF = 0.3,
  offValue = 50,
  strokeSize,
  minTempHue,
  maxminTempHue,
  blackOut = false,
  blackFill = false;

let drawingPoints = [];

let xoff, yoff;
let xz = 0.0;
let yz = 10.0;

// MIN/MAX VARIABLES TO GET BOUNDING BOX
let minX, minY, maxX, maxY;
let wordWidth = 300,
  wordHeight = 700;

// OPEN ARRAYS FOR VORTEX POINTS
let amountV = 3;
let vortexX = [],
  vortexY = [],
  vortexR,
  minVortexDist = 275,
  grow,
  inc = 2.5,
  flexibility = 0.0025;

let json;

let weather;
let temp, clouds, description, humidity, windSpeed, weatherID, rain;

let slider1,
  slider2,
  slider3,
  slider4,
  slider5,
  slider6,
  slider3Label,
  slider6Label,
  inputText,
  descriptionText,
  checkOutline,
  checkFill;
let perlinRadius;

let osc, playing, freq;

// PRELOAD FONTS FOR TEXT TO POINTS
function preload() {
  font = loadFont("data/Version_0.5_10-3.ttf");
}

function setup() {
  // CREATE CANVAS FOR GRAPHICS
  let url =
    "https://api.openweathermap.org/data/2.5/weather?lat=41.47394756042913&lon=1.61413424614867&appid=49825ff466b207391d701124b9f22ede&units=metric&lang=ca";

  cnv = createCanvas(
    windowWidth,
    windowHeight
  );

  let d = new Date();

  document.getElementById("insertDate").innerHTML = `Ultima actualización: ${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`;
  frameRate(30);
  colorMode(RGB);

  bgColor = color(240, 240, 240);
  activeColor = color(240, 100, 100);
  fillColor = color(0, 0, 100);

  // CALL FUNCTION FOR GETTING TEXT POINTS
  slider1 = select("#slider1");
  slider2 = select("#slider2");
  slider3 = select("#slider3");
  slider4 = select("#slider4");
  slider5 = select("#slider5");
  slider6 = select("#slider6");
  inputText = select("#inputText");
  descriptionText = select("#descriptionText");
  checkFill = select("#blackFill");
  checkOutline = select("#blackOutline");
  slider3Label = select("#slider3label");
  slider6Label = select("#slider6label");
  slider3Label.html(`<b>Mida</b> ${fSize} pt`);
  drawText();
  loadJSON(url, gotData);
}

function draw() {
  clear();
    //scale(1.45);
    //translate(-280,-200);
  //background(bgColor);
  for (p of drawingPoints) {
    //points loop
    p.move();
    p.grow();
    if (blackOut && !blackFill) {
      p.blackOutline();
    } else if (blackFill && !blackOut) {
      p.blackFilling();
    } else if (blackFill && blackOut) {
      p.blackFilling();
    } else {
      p.normalApp();
    }
    p.display();
  }
  xz += inc;
  yz += inc;
  inputTextFocus = document.getElementById("inputText");
}

function ns(x, y, z, scale_, min_, max_) {
  return map(noise(x * scale_, y * scale_, z * scale_), 0, 1, min_, max_);
}

let tempR, tempG, tempB, tempSR, tempSG, tempSB;

class drawingPoint {
  constructor(x, y, r) {
    this.inX = x;
    this.inY = y;
    this.inRadius = 7.5;

    this.inA = 0;
    this.maxA = 50;

    this.aV = 255;

    this.inR = tempR;
    this.inG = tempG;
    this.inB = tempB;
    
    this.rV = this.inR;
    this.gV = this.inG;
    this.bV = this.inB;
    this.inStroke = color(tempSR, tempSG, tempSB);
  }

  changeColor(){
    this.inR = tempR;
    this.inG = tempG;
    this.inB = tempB;
    
    this.rV = this.inR;
    this.gV = this.inG;
    this.bV = this.inB;
    this.inStroke = color(tempSR, tempSG, tempSB);
  }

  
  grow() {
    this.d1 = dist(this.x, this.y, vortexX[0], vortexY[0]);
    this.d2 = dist(this.x, this.y, vortexX[1], vortexY[1]);
    this.d3 = dist(this.x, this.y, vortexX[2], vortexY[2]);

    if (this.d1 < vortexR) {
      this.r = this.inRadius + map(this.d1, 0, vortexR, grow, 0);
      this.aV = map(this.d1, 0, vortexR, this.maxA, this.inA);
    } else if (this.d2 < vortexR) {
      this.r = this.inRadius + map(this.d2, 0, vortexR, grow, 0);
      this.aV = map(this.d2, 0, vortexR, this.maxA, this.inA);
    } else if (this.d3 < vortexR) {
      this.r = this.inRadius + map(this.d3, 0, vortexR, grow, 0);
      this.aV = map(this.d3, 0, vortexR, this.maxA, this.inA);
    } else {
      this.aV = this.inA;
      this.r = this.inRadius;
    }
  }

  blackOutline() {
    this.rV = 250;
    this.gV = 250;
    this.bV = 250;
    document.body.style.setProperty('--bg-color',`rgb(${this.rV},${this.gV},${this.bV})`)
    this.stroke = 10;
  }

  blackFilling() {
    this.rV = 0;
    this.gV = 0;
    this.bV = 0;
    this.aV = 255;
    this.stroke = 0;
  }

  normalApp() {
    this.rV = this.inR;
    this.gV = this.inG;
    this.bV = this.inB;
    this.stroke = this.inStroke;
  }

  move() {
    this.xoff = ns(
      this.inX,
      this.inY,
      xz,
      flexibility,
      -perlinRadius,
      perlinRadius
    );
    this.yoff = ns(
      this.inY,
      this.inX,
      yz,
      flexibility,
      -perlinRadius,
      perlinRadius
    );
    this.x = this.inX + this.xoff;
    this.y = this.inY + this.yoff;
  }

  display() {
    fill(this.rV, this.gV, this.bV, this.aV);
    stroke(this.stroke);
    strokeWeight(0.5);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}

function drawText() {
  let currentY = height / 2 + 100 - offValue;
  drawingPoints = [];
  // SET TEXT OPTIONS
  let options = {
    x: width / 2 - 450 - offValue, // START OF TEXT
    y: currentY,
    fontSize: fSize, // FONT SIZE (default textSize() value)
    sampleFactor: sampleF, // SPACING OF POINTS (default 0.1)
    simplifyThreshold: 0.0, // COLLINEAR POINTS (default 0)
  };

  // CONVERT TEXT TO SHAPES
  letters = textToShapes(font, msg, options);
  let allX = [],
    allY = [];
  for (let i = 0; i < letters.length; i++) {
    //LOOP LETTERS

    let shapes = letters[i];

    if (msg[i] == "$") {
      currentY += wordHeight;
      console.log(currentY);
    }

    for (let j = 0; j < shapes.length; j++) {
      //LOOP SHAPES IN LETTER

      let shape = shapes[j];
      for (let k = 0; k < shape.length; k++) {
        //LOOP POINTS

        let x = shape[k].x;
        let y = shape[k].y;
        allX.push(shape[k].x);
        allY.push(shape[k].y);
        drawingPoints.push(new drawingPoint(x, y));
      }
    }
  }

  minX = min(allX);
  maxX = max(allX);
  minY = min(allY);
  maxY = max(allY);
  wordWidth = dist(minX, minY, maxX, minY);
  wordHeight = dist(minX, minY, minX, maxY);
}

// SIZES CHANGE WITH WINDOW SIZE
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawingPoints = [];
  clear();
  drawText();
  updateVortex();
}

// CREATE NEW VORTEXES
function updateVortex() {
  let newVX, newVY;
  vortexX = [];
  vortexY = [];
  for (let n = 0; n < amountV; n++) {
    newVX = round(
      random(
        minX + n * (wordWidth / amountV),
        maxX - (amountV - (n + 1)) * (wordWidth / amountV)
      )
    );
    newVY = round(random(minY, maxY));

    while (
      n > 0 &&
      newVX - vortexX[n - 1] < vortexR * 2 &&
      newVX < wordWidth + vortexR * 2
    ) {
      newVX++;
    }
    while (
      n < amountV &&
      vortexY[n + 1] - newVY > vortexR * 3 &&
      newVY > wordHeight
    ) {
      newVY--;
    }
    vortexX.push(newVX);
    vortexY.push(newVY);
  }
  if (vortexX.length > amountV) {
    vortexX.splice(0, amountV);
    vortexY.splice(0, amountV);
  }
}

function gotData(data) {
  weather = data;

  temp = weather.main.temp;
  clouds = weather.clouds.all;
  description = weather.weather[0].description;
  humidity = weather.main.humidity;
  windSpeed = weather.wind.speed;
  weatherID = weather.cod;

  //SETTING RAIN VALUE FROM WEATHER ID
  if (weatherID == 200 || weatherID == 300 || weatherID == 230) {
    // light drizze
    rain = 0;
  } else if (weatherID == 301 || weatherID == 231) {
    // drizzle
    rain = 10;
  } else if (weatherID == 302 || weatherID == 232) {
    // heavy drizze
    rain = 15;
  } else if (
    weatherID == 500 ||
    weatherID == 310 ||
    weatherID == 600 ||
    weatherID == 612 ||
    weatherID == 615 ||
    weatherID == 620
  ) {
    // light rain
    rain = 20;
  } else if (
    weatherID == 201 ||
    weatherID == 311 ||
    weatherID == 501 ||
    weatherID == 601 ||
    weatherID == 611 ||
    weatherID == 616
  ) {
    // rain
    rain = 30;
  } else if (
    weatherID == 312 ||
    weatherID == 202 ||
    weatherID == 502 ||
    weatherID == 503 ||
    weatherID == 511 ||
    weatherID == 602
  ) {
    // heavy rain
    rain = 40;
  } else if (weatherID == 504 || weatherID == 321 || weatherID == 312) {
    // extreme rain
    rain = 50;
  } else if (
    weatherID == 520 ||
    weatherID == 531 ||
    weatherID == 602 ||
    weatherID == 620
  ) {
    // light shower rain
    rain = 60;
  } else if (
    weatherID == 521 ||
    weatherID == 313 ||
    weatherID == 613 ||
    weatherID == 621
  ) {
    // shower rain
    rain = 70;
  } else if (weatherID == 522 || weatherID == 314 || weatherID == 622) {
    // heavy shower rain
    rain = 80;
  } else {
    rain = 0;
  }

  // ACCESS HTML SLIDERS
  let slider1Label = select("#slider1label");
  let slider2Label = select("#slider2label");
  let slider4Label = select("#slider4label");
  let slider5Label = select("#slider5label");
  //let slider6Label = select("#slider6label");

  // SETTING PERLIN RADIUS FROM WIND SPEED
  perlinRadius = round(map(windSpeed, 0.0, 20.0, 70, 300));
  slider1.value(perlinRadius);
  slider1Label.html(`<b>Vent</b> ${windSpeed}m/s`);
  if (perlinRadius > 150) {
    sampleF = round(map(perlinRadius, 150, 300, 0.65, 1.3));
  }

  // SETTING FLEXIBILITY FROM RAIN
  flexibility = map(rain, 0, 80, 0.004, 0.0075);
  slider2.value(flexibility);
  slider2Label.html(`<b>Pluja</b> ${rain}%`);

  // SETTING GROWTH RANGE FROM HUMIDITY
  vortexR = map(humidity, 0, 100, 75, 275);
  slider4.value(vortexR);
  slider4Label.html(`<b>Humitat</b> ${humidity}%`);

  // SETTING GROWTH FROM CLOUD COVERAGE
  grow = map(clouds, 0, 100, 15, 100);
  slider5.value(grow);
  slider5Label.html(`<b>Nuvolositat</b> ${clouds}%`);

  // SETTING DESCRIPTION AT THE TOP
  descriptionText.html(
    `<b><a href="https://openweathermap.org/technology" target="_blank">Mediona, Alt Penedès</a></b>. ${description}.<br>Long:${weather.coord.lon} Lat: ${weather.coord.lat}  Temp: ${temp} ℃. Humitat: ${humidity} %.<br>Nuvolositat: ${clouds} %. Velocitat del vent: ${windSpeed} m/s.`
  );


  if (temp <= 5) {
    tempR = 90;
    tempG = 75;
    tempB = 255;
    tempSR = 245;
    tempSG = 240;
    tempSB = 235;
  } else if (temp > 5 && temp <= 15) {
    tempR = 255;
    tempG = 164;
    tempB = 205;
    tempSR = 165;
    tempSG = 160;
    tempSB = 155;
  } else if (temp > 15 && temp <= 30) {
    tempR = 255;
    tempG = 250;
    tempB = 0;
    tempSR = 76;
    tempSG = 99;
    tempSB = 89;
  } else if (temp > 30) {
    tempR = 255;
    tempG = 90;
    tempB = 0;
    tempSR = 45;
    tempSG = 45;
    tempSB = 45;
  }
  slider6Label.html(`<b>Temperatura</b> ${temp}º`);
  drawText();
  updateVortex();
  noLoop();
  loop();
}

function changeText() {
  msg = inputText.value();
  drawText();
  console.log(msg);
}

function keyPressed() {
  //PRESS COMMAND FOR PAUSE
  if (keyCode === 93) {
    noLoop();
    cursor(ARROW);
    //PRESS OPTION FOR RESUME
  } else if (keyCode === 18) {
    loop();
    noCursor();
    //PRESS RIGHT ARROW TO MOVE VORTEXES
  } else if (keyCode === 39) {
    updateVortex();
  } else if (keyCode === 13 && document.activeElement === inputTextFocus) {
    msg += "$";
    inputText.value(msg);
    console.log(msg);
  } 
}

function updateSlider1() {
  perlinRadius = slider1.value();
}

function updateSlider2() {
  flexibility = slider2.value();
  
}

function updateSlider3() {
  fSize = slider3.value();
  slider3Label.html(`<b>Mida</b> ${fSize} pt`);
  drawText();
}

function updateSlider4() {
  vortexR = slider4.value();
}

function updateSlider5() {
  grow = slider5.value();
}

function updateSlider6() {
  temp = slider6.value();
  if (temp <= 5) {
    tempR = 90;
    tempG = 75;
    tempB = 255;
    tempSR = 245;
    tempSG = 240;
    tempSB = 235;
  } else if (temp > 5 && temp <= 15) {
    tempR = 255;
    tempG = 164;
    tempB = 205;
    tempSR = 165;
    tempSG = 160;
    tempSB = 155;
  } else if (temp > 15 && temp <= 30) {
    tempR = 255;
    tempG = 250;
    tempB = 0;//https://api.openweathermap.org/data/2.5/weather?lat={41.43}&lon={1.59}&appid={49825ff466b207391d701124b9f22ede}

    /* TEXT TO SHAPES - reworked textToPoints function
    Jeff Thompson | 2021 | jeffreythompson.org 
    FONT: TGL BY PETER WIEGEL, SIL Open Font License, 1.1
    http://www.peter-wiegel.de/TGL_0-16.html */
    /*
    // make voids move without overlapping
    // https://youtu.be/uAfw-ko3kB8
    https://github.com/CodingTrain/website-archive/blob/main/beginners/p5js/7.6-object-communication-1/P5/sketch.js
    https://github.com/CodingTrain/website-archive/tree/main/beginners/p5js/7.7-object-communication-2/P5
    */
    
    p5.disableFriendlyErrors = true;
    
    let letters; // LIST OF SHAPES
    let inputTextFocus;
    let cnv;
    
    // VARIABLES FOR FONT PRELOADING
    let font;
    let inFSize = 600;
    
    // TEXT TO POINTS SETTINGS
    let msg = "gens",
      fSize = inFSize,
      sampleF = 0.3,
      offValue = 50,
      strokeSize,
      minTempHue,
      maxminTempHue,
      blackOut = false,
      blackFill = false;
    
    let drawingPoints = [];
    
    let xoff, yoff;
    let xz = 0.0;
    let yz = 10.0;
    
    // MIN/MAX VARIABLES TO GET BOUNDING BOX
    let minX, minY, maxX, maxY;
    let wordWidth = 300,
      wordHeight = 700;
    
    // OPEN ARRAYS FOR VORTEX POINTS
    let amountV = 3;
    let vortexX = [],
      vortexY = [],
      vortexR,
      minVortexDist = 275,
      grow,
      inc = 2.5,
      flexibility = 0.0025;
    
    let json;
    
    let weather;
    let temp, clouds, description, humidity, windSpeed, weatherID, rain;
    
    let slider1,
      slider2,
      slider3,
      slider4,
      slider5,
      slider6,
      slider3Label,
      slider6Label,
      inputText,
      descriptionText,
      checkOutline,
      checkFill;
    let perlinRadius;
    
    let osc, playing, freq;
    
    // PRELOAD FONTS FOR TEXT TO POINTS
    function preload() {
      font = loadFont("data/Version_0.5_10-3.ttf");
    }
    
    function setup() {
      // CREATE CANVAS FOR GRAPHICS
      let url =
        "https://api.openweathermap.org/data/2.5/weather?lat=41.47394756042913&lon=1.61413424614867&appid=49825ff466b207391d701124b9f22ede&units=metric&lang=ca";
    
      cnv = createCanvas(
        windowWidth,
        windowHeight
        //,SVG
      );
    
      let d = new Date();
    
      document.getElementById("insertDate").innerHTML = `Ultima actualización: ${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`;
      frameRate(30);
      colorMode(RGB);
    
      bgColor = color(240, 240, 240);
      activeColor = color(240, 100, 100);
      fillColor = color(0, 0, 100);
    
      // CALL FUNCTION FOR GETTING TEXT POINTS
      slider1 = select("#slider1");
      slider2 = select("#slider2");
      slider3 = select("#slider3");
      slider4 = select("#slider4");
      slider5 = select("#slider5");
      //slider6 = select("#slider6");
      inputText = select("#inputText");
      descriptionText = select("#descriptionText");
      checkFill = select("#blackFill");
      checkOutline = select("#blackOutline");
      slider3Label = select("#slider3label");
      slider6Label = select("#slider6label");
      slider3Label.html(`<b>Mida</b> ${fSize} pt`);
      drawText();
      loadJSON(url, gotData);
    }
    
    function draw() {
      clear();
        //scale(1.45);
        //translate(-280,-200);
      //background(bgColor);
      for (p of drawingPoints) {
        //points loop
        p.move();
        p.grow();
        if (blackOut && !blackFill) {
          p.blackOutline();
        } else if (blackFill && !blackOut) {
          p.blackFilling();
        } else if (blackFill && blackOut) {
          p.blackFilling();
        } else {
          p.normalApp();
        }
        p.display();
      }
      xz += inc;
      yz += inc;
      inputTextFocus = document.getElementById("inputText");
    }
    
    function ns(x, y, z, scale_, min_, max_) {
      return map(noise(x * scale_, y * scale_, z * scale_), 0, 1, min_, max_);
    }
    
    let tempR, tempG, tempB, tempSR, tempSG, tempSB;
    
    class drawingPoint {
      constructor(x, y, r) {
        this.inX = x;
        this.inY = y;
        this.inRadius = 7.5;
    
        this.inA = 0;
        this.maxA = 50;
    
        this.aV = 255;
    
        this.inR = tempR;
        this.inG = tempG;
        this.inB = tempB;
        
        this.rV = this.inR;
        this.gV = this.inG;
        this.bV = this.inB;
        this.inStroke = color(tempSR, tempSG, tempSB);
      }
    
      changeColor(){
        this.inR = tempR;
        this.inG = tempG;
        this.inB = tempB;
        
        this.rV = this.inR;
        this.gV = this.inG;
        this.bV = this.inB;
        this.inStroke = color(tempSR, tempSG, tempSB);
      }
    
      
      grow() {
        this.d1 = dist(this.x, this.y, vortexX[0], vortexY[0]);
        this.d2 = dist(this.x, this.y, vortexX[1], vortexY[1]);
        this.d3 = dist(this.x, this.y, vortexX[2], vortexY[2]);
    
        if (this.d1 < vortexR) {
          this.r = this.inRadius + map(this.d1, 0, vortexR, grow, 0);
          this.aV = map(this.d1, 0, vortexR, this.maxA, this.inA);
        } else if (this.d2 < vortexR) {
          this.r = this.inRadius + map(this.d2, 0, vortexR, grow, 0);
          this.aV = map(this.d2, 0, vortexR, this.maxA, this.inA);
        } else if (this.d3 < vortexR) {
          this.r = this.inRadius + map(this.d3, 0, vortexR, grow, 0);
          this.aV = map(this.d3, 0, vortexR, this.maxA, this.inA);
        } else {
          this.aV = this.inA;
          this.r = this.inRadius;
        }
      }
    
      blackOutline() {
        this.rV = 250;
        this.gV = 250;
        this.bV = 250;
        document.body.style.setProperty('--bg-color',`rgb(${this.rV},${this.gV},${this.bV})`)
        this.stroke = 10;
      }
    
      blackFilling() {
        this.rV = 0;
        this.gV = 0;
        this.bV = 0;
        this.aV = 255;
        this.stroke = 0;
      }
    
      normalApp() {
        this.rV = this.inR;
        this.gV = this.inG;
        this.bV = this.inB;
        this.stroke = this.inStroke;
      }
    
      move() {
        this.xoff = ns(
          this.inX,
          this.inY,
          xz,
          flexibility,
          -perlinRadius,
          perlinRadius
        );
        this.yoff = ns(
          this.inY,
          this.inX,
          yz,
          flexibility,
          -perlinRadius,
          perlinRadius
        );
        this.x = this.inX + this.xoff;
        this.y = this.inY + this.yoff;
      }
    
      display() {
        fill(this.rV, this.gV, this.bV, this.aV);
        stroke(this.stroke);
        strokeWeight(0.5);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
      }
    }
    
    function drawText() {
      let currentY = height / 2 + 100 - offValue;
      drawingPoints = [];
      // SET TEXT OPTIONS
      let options = {
        x: width / 2 - 450 - offValue, // START OF TEXT
        y: currentY,
        fontSize: fSize, // FONT SIZE (default textSize() value)
        sampleFactor: sampleF, // SPACING OF POINTS (default 0.1)
        simplifyThreshold: 0.0, // COLLINEAR POINTS (default 0)
      };
    
      // CONVERT TEXT TO SHAPES
      letters = textToShapes(font, msg, options);
      let allX = [],
        allY = [];
      for (let i = 0; i < letters.length; i++) {
        //LOOP LETTERS
    
        let shapes = letters[i];
    
        if (msg[i] == "$") {
          currentY += wordHeight;
          console.log(currentY);
        }
    
        for (let j = 0; j < shapes.length; j++) {
          //LOOP SHAPES IN LETTER
    
          let shape = shapes[j];
          for (let k = 0; k < shape.length; k++) {
            //LOOP POINTS
    
            let x = shape[k].x;
            let y = shape[k].y;
            allX.push(shape[k].x);
            allY.push(shape[k].y);
            drawingPoints.push(new drawingPoint(x, y));
          }
        }
      }
    
      minX = min(allX);
      maxX = max(allX);
      minY = min(allY);
      maxY = max(allY);
      wordWidth = dist(minX, minY, maxX, minY);
      wordHeight = dist(minX, minY, minX, maxY);
    }
    
    // SIZES CHANGE WITH WINDOW SIZE
    function windowResized() {
      resizeCanvas(windowWidth, windowHeight);
      drawingPoints = [];
      clear();
      drawText();
      updateVortex();
    }
    
    // CREATE NEW VORTEXES
    function updateVortex() {
      let newVX, newVY;
      vortexX = [];
      vortexY = [];
      for (let n = 0; n < amountV; n++) {
        newVX = round(
          random(
            minX + n * (wordWidth / amountV),
            maxX - (amountV - (n + 1)) * (wordWidth / amountV)
          )
        );
        newVY = round(random(minY, maxY));
    
        while (
          n > 0 &&
          newVX - vortexX[n - 1] < vortexR * 2 &&
          newVX < wordWidth + vortexR * 2
        ) {
          newVX++;
        }
        while (
          n < amountV &&
          vortexY[n + 1] - newVY > vortexR * 3 &&
          newVY > wordHeight
        ) {
          newVY--;
        }
        vortexX.push(newVX);
        vortexY.push(newVY);
      }
      if (vortexX.length > amountV) {
        vortexX.splice(0, amountV);
        vortexY.splice(0, amountV);
      }
    }
    
    function gotData(data) {
      weather = data;
    
      temp = weather.main.temp;
      clouds = weather.clouds.all;
      description = weather.weather[0].description;
      humidity = weather.main.humidity;
      windSpeed = weather.wind.speed;
      weatherID = weather.cod;
    
      //SETTING RAIN VALUE FROM WEATHER ID
      if (weatherID == 200 || weatherID == 300 || weatherID == 230) {
        // light drizze
        rain = 0;
      } else if (weatherID == 301 || weatherID == 231) {
        // drizzle
        rain = 10;
      } else if (weatherID == 302 || weatherID == 232) {
        // heavy drizze
        rain = 15;
      } else if (
        weatherID == 500 ||
        weatherID == 310 ||
        weatherID == 600 ||
        weatherID == 612 ||
        weatherID == 615 ||
        weatherID == 620
      ) {
        // light rain
        rain = 20;
      } else if (
        weatherID == 201 ||
        weatherID == 311 ||
        weatherID == 501 ||
        weatherID == 601 ||
        weatherID == 611 ||
        weatherID == 616
      ) {
        // rain
        rain = 30;
      } else if (
        weatherID == 312 ||
        weatherID == 202 ||
        weatherID == 502 ||
        weatherID == 503 ||
        weatherID == 511 ||
        weatherID == 602
      ) {
        // heavy rain
        rain = 40;
      } else if (weatherID == 504 || weatherID == 321 || weatherID == 312) {
        // extreme rain
        rain = 50;
      } else if (
        weatherID == 520 ||
        weatherID == 531 ||
        weatherID == 602 ||
        weatherID == 620
      ) {
        // light shower rain
        rain = 60;
      } else if (
        weatherID == 521 ||
        weatherID == 313 ||
        weatherID == 613 ||
        weatherID == 621
      ) {
        // shower rain
        rain = 70;
      } else if (weatherID == 522 || weatherID == 314 || weatherID == 622) {
        // heavy shower rain
        rain = 80;
      } else {
        rain = 0;
      }
    
      // ACCESS HTML SLIDERS
      let slider1Label = select("#slider1label");
      let slider2Label = select("#slider2label");
      let slider4Label = select("#slider4label");
      let slider5Label = select("#slider5label");
      //let slider6Label = select("#slider6label");
    
      // SETTING PERLIN RADIUS FROM WIND SPEED
      perlinRadius = round(map(windSpeed, 0.0, 20.0, 70, 300));
      slider1.value(perlinRadius);
      slider1Label.html(`<b>Vent</b> ${windSpeed}m/s`);
      if (perlinRadius > 150) {
        sampleF = round(map(perlinRadius, 150, 300, 0.65, 1.3));
      }
    
      // SETTING FLEXIBILITY FROM RAIN
      flexibility = map(rain, 0, 80, 0.004, 0.0075);
      slider2.value(flexibility);
      slider2Label.html(`<b>Pluja</b> ${rain}%`);
    
      // SETTING GROWTH RANGE FROM HUMIDITY
      vortexR = map(humidity, 0, 100, 75, 275);
      slider4.value(vortexR);
      slider4Label.html(`<b>Humitat</b> ${humidity}%`);
    
      // SETTING GROWTH FROM CLOUD COVERAGE
      grow = map(clouds, 0, 100, 15, 100);
      slider5.value(grow);
      slider5Label.html(`<b>Nuvolositat</b> ${clouds}%`);
    
      // SETTING DESCRIPTION AT THE TOP
      descriptionText.html(
        `<b><a href="https://openweathermap.org/technology" target="_blank">Mediona, Alt Penedès</a></b>. ${description}.<br>Long:${weather.coord.lon} Lat: ${weather.coord.lat}  Temp: ${temp} ℃. Humitat: ${humidity} %.<br>Nuvolositat: ${clouds} %. Velocitat del vent: ${windSpeed} m/s.`
      );
    
    
      if (temp <= 5) {
        tempR = 90;
        tempG = 75;
        tempB = 255;
        tempSR = 245;
        tempSG = 240;
        tempSB = 235;
      } else if (temp > 5 && temp <= 15) {
        tempR = 255;
        tempG = 164;
        tempB = 205;
        tempSR = 165;
        tempSG = 160;
        tempSB = 155;
      } else if (temp > 15 && temp <= 30) {
        tempR = 255;
        tempG = 250;
        tempB = 0;
        tempSR = 76;
        tempSG = 99;
        tempSB = 89;
      } else if (temp > 30) {
        tempR = 255;
        tempG = 90;
        tempB = 0;
        tempSR = 45;
        tempSG = 45;
        tempSB = 45;
      }
      slider6Label.html(`<b>Temperatura</b> ${temp}º`);
      drawText();
      updateVortex();
      noLoop();
      loop();
    }
    
    function changeText() {
      msg = inputText.value();
      drawText();
      console.log(msg);
    }
    
    function keyPressed() {
      //PRESS COMMAND FOR PAUSE
      if (keyCode === 93) {
        noLoop();
        cursor(ARROW);
        //PRESS OPTION FOR RESUME
      } else if (keyCode === 18) {
        loop();
        noCursor();
        //PRESS RIGHT ARROW TO MOVE VORTEXES
      } else if (keyCode === 39) {
        updateVortex();
      } else if (keyCode === 13 && document.activeElement === inputTextFocus) {
        msg += "$";
        inputText.value(msg);
        console.log(msg);
      } 
    }
    
    function updateSlider1() {
      perlinRadius = slider1.value();
    }
    
    function updateSlider2() {
      flexibility = slider2.value();
      
    }
    
    function updateSlider3() {
      fSize = slider3.value();
      slider3Label.html(`<b>Mida</b> ${fSize} pt`);
      drawText();
    }
    
    function updateSlider4() {
      vortexR = slider4.value();
    }
    
    function updateSlider5() {
      grow = slider5.value();
    }
    
    function updateSlider6() {
      temp = slider6.value();
      if (temp <= 5) {
        tempR = 90;
        tempG = 75;
        tempB = 255;
        tempSR = 245;
        tempSG = 240;
        tempSB = 235;
      } else if (temp > 5 && temp <= 15) {
        tempR = 255;
        tempG = 164;
        tempB = 205;
        tempSR = 165;
        tempSG = 160;
        tempSB = 155;
      } else if (temp > 15 && temp <= 30) {
        tempR = 255;
        tempG = 250;
        tempB = 0;
        tempSR = 76;
        tempSG = 99;
        tempSB = 89;
      } else if (temp > 30) {
        tempR = 255;
        tempG = 90;
        tempB = 0;
        tempSR = 45;
        tempSG = 45;
        tempSB = 45;
      }
      loop();
    }
    
    function saveCanvas() {
      save();
    }
    
    function changeOutline() {
      if (checkOutline.checked()) {
        blackOut = true;
      } else {
        blackOut = false;
      }
    }
    
    function changeFill() {
      if (checkFill.checked()) {
        blackFill = true;
      } else {
        blackFill = false;
      }
    }
    
    tempSR = 76;
    tempSG = 99;
    tempSB = 89;
  } else if (temp > 30) {
    tempR = 255;
    tempG = 90;
    tempB = 0;
    tempSR = 45;
    tempSG = 45;
    tempSB = 45;
  }
  for (p of drawingPoints) {
    p.changeColor();
  }
  loop();
}

function saveCanvas() {
  save();
}

function changeOutline() {
  if (checkOutline.checked()) {
    blackOut = true;
  } else {
    blackOut = false;
  }
}

function changeFill() {
  if (checkFill.checked()) {
    blackFill = true;
  } else {
    blackFill = false;
  }
}
