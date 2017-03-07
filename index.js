var ballAnimate = {
  dom: document.getElementById('canvas'),
  ctx: document.getElementById('canvas').getContext("2d"),
  ballConfig: {
    radius: 5,
    ballMargin: 6,
    quakeMove: 3,
    text: "tosiney",
    speedG: 0.8,
    speedX: 8,
    speedY: -10
  },
  ball: [],
  intervalId: {},
  canvasWidth: function () {
    var gap = this.gap();
    return Math.floor(window.innerWidth / gap) * gap;
  },
  canvasHeight: function () {
    var gap = this.gap();
    return Math.floor(window.innerHeight / gap) * gap;
  },
  gap: function () {
    return this.ballConfig.radius * 2 + this.ballConfig.ballMargin;
  },
  wordFontSize: function () {
    return document.documentElement.clientHeight / 2.5;
  },
  initCanvas: function () {
    this.dom.width = this.canvasWidth();
    this.dom.height = this.canvasHeight();
  },
  init: function () {
    var requestFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    var _this = this;
    _this.initCanvas();
    var ball = _this.calcChar();
    _this.ball = ball;
    for (var i in ball) _this.drawSingleBall(ball[i].x, ball[i].y);
    initSpeed();
    requestFrame(quake);
    var clickNum = 0;
    document.documentElement.onclick = function () {
      if (clickNum == 0) {
        quakeStop();
        requestFrame(moveBall);
        clickNum = 1;
      } else if (clickNum == 1) {
        window.clearInterval(_this.intervalId);
        _this.clearCanvas();
        _this.ball = _this.calcChar();
        for (var i in _this.ball) _this.drawSingleBall(_this.ball[i].x, _this.ball[i].y);
        requestFrame(quake);
        clickNum = 0;
        initSpeed();
      }
    }

    function quake() {
      _this.intervalId = window.setInterval(function () {
        _this.clearCanvas();
        var ball = _this.ball;
        for (var i in ball) _this.drawSingleBall(ball[i].x + _this.method.random(0, _this.ballConfig.quakeMove), ball[i].y + _this.method.random(0, _this.ballConfig.quakeMove));
      }, 1000 / 60);
    };

    function quakeStop() {
      window.clearInterval(_this.intervalId);
      _this.clearCanvas();
      var ball = _this.ball;
      for (var i in ball) _this.drawSingleBall(ball[i].x, ball[i].y);
    };


    function initSpeed() {
      var ball = _this.ball;
      for (var i in ball) {
        ball[i].vx = Math.pow(-1, Math.ceil(Math.random() * 1000)) * _this.ballConfig.speedX + _this.method.random(0, 5);
        ball[i].vy = _this.ballConfig.speedY + _this.method.random(0, 3);
        ball[i].g = _this.ballConfig.speedG + _this.method.random(0, 0.5);
      }
      _this.ball = ball;
    };

    function initBall() {
      _this.clearCanvas();
      _this.ball = _this.calcChar();
      for (var i in ball) _this.drawSingleBall(ball[i].x, ball[i].y);
      initSpeed();
      requestFrame(quake);
    };

    function moveBall() {
      var ball = _this.ball;
      _this.intervalId = window.setInterval(function () {
        var ballNum = 0;
        for (var i in _this.ball) {
          if (_this.ball[i].vy == 0) ballNum++;
        }
        if (ballNum == _this.ball.length) {
          window.clearInterval(_this.intervalId);
          initBall();
          clickNum = 0;
          return;
        }
        _this.clearCanvas();
        for (var i in ball) {
          ball[i].x += ball[i].vx;
          ball[i].y += ball[i].vy;
          ball[i].vy += ball[i].g;
          _this.drawSingleBall(ball[i].x, ball[i].y, i);
        }
      }, 1000 / 60);
    };
  },
  // 返回在虚拟canvas中的文字canvas信息
  virtualCanvas: function () {
    var width = this.canvasWidth(),
      height = this.canvasHeight();
    var newCanvas = document.createElement("canvas");
    newCanvas.width = width;
    newCanvas.height = height;
    var newCtx = newCanvas.getContext('2d');
    newCtx.font = "bold " + this.wordFontSize() + "px 'Microsoft YaHei'";
    newCtx.textBaseline = "middle";
    newCtx.textAlign = "center";
    newCtx.fillStyle = "red";
    newCtx.fillText(this.ballConfig.text, width / 2, height / 2);
    return newCtx.getImageData(0, 0, width, height).data;
  },
  calcChar: function () {
    var finalGridPoint = [];
    var data = this.virtualCanvas();
    var x = 0,
      y = 0,
      width = this.canvasWidth();
    var GridPoints = [];
    var gap = this.gap();
    for (var i = 0; i < data.length;) {
      if (data[i] == 255) {
        GridPoints.push({
          x: x,
          y: y
        })
      }
      x += gap;
      if (x > width) {
        x = 0;
        y += gap;
        i += (gap) * 4 * (width);
      } else {
        i += (4 * gap);
      }
    }
    return GridPoints;
  },
  // 画出单个的小球
  drawSingleBall: function (x, y, i) {
    if (i) {
      if (x + this.ballConfig.radius > this.canvasWidth() || x - this.ballConfig.radius < 0) {
        this.ball[i].vx *= -0.75;
        if ((this.ball[i].vx < 0 && this.ball[i].vx > -2) || (this.ball[i].vx > 0 && this.ball[i].vx < 2)) this.ball[i].vx = 0;
      }
      if (y + this.ballConfig.radius > this.canvasHeight() || y - this.ballConfig.radius < 0) {
        this.ball[i].vy *= -0.75;
        if ((this.ball[i].vy < 0 && this.ball[i].vy > -10) || (this.ball[i].vy > 0 && this.ball[i].vy < 10)) this.ball[i].vy = 0;
      }
    }

    var ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, this.ballConfig.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgb(58, 255, 210)";
    ctx.fill();
    ctx.shadowColor = "rgb(0, 203, 166)";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.closePath();

  },
  clearCanvas: function () {
    this.ctx.clearRect(0, 0, this.canvasWidth(), this.canvasHeight());
  },
  method: {
    hasClass: function (obj, cls) {
      return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: function (obj, cls) {
      if (!this.method.hasClass(obj, cls)) obj.className += " " + cls;
    },
    removeClass: function (obj, cls) {
      if (this.method.hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
      }
    },
    random: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
}
ballAnimate.init();
