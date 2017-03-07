var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var canvasWidth = document.documentElement.clientWidth;
var canvasHeight = document.documentElement.clientHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var balls_speed = 2000; //小球运动速度
var char_margin = 0.7;
var radius = 4;
var margin_left = (canvasWidth - 4 * 40 * radius * 2 - (40 * 4 - 1) * char_margin) / 2; //左边距
var margin_top = 150; //上边距
var speed_g = 100;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

//计算需要显示小球的数量
function connt_num(start, end) {
	var num = 0;
	for (var k = Number(start); k < Number(end); k++) {
		for (var i in char[k]) {
			for (var j in char[k][i]) {
				if (char[k][i][j] == 1) {
					num++;
				}
			}
		}
	}
	return num;
}
//返回某个区间的随机数
function ran(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
//随机显示一些小球
function init(start, end) {
	var ball_cfg = [];
	var all = Number(connt_num(start, end));
	for (var i = 0; i < all; i++) {
		var c_x = ran(10, canvasWidth - 10);
		var c_y = ran(10, canvasHeight - 10);
		var p_ball = ball_cal(i, start, end);
		var speedx = (p_ball['p_x'] - c_x) / (balls_speed / 1000 * 60);
		var speedy = (p_ball['p_y'] - c_y) / (balls_speed / 1000 * 60);
		var ball = {
			'p_x': p_ball['p_x'],
			'p_y': p_ball['p_y'],
			'r_x': c_x,
			'r_y': c_y,
			'c_x': c_x,
			'c_y': c_y,
			'speedx': speedx,
			'speedy': speedy
		}
		ball_cfg.push(ball);
	}
	return ball_cfg;
};
//计算第几个需要显示的小球的位置
function ball_cal(num, start, end) {
	var n = 0;
	for (var k = start; k < end; k++) {
		for (var i in char[k]) {
			for (var j in char[k][i]) {
				if (char[k][i][j] == 1) {
					var _i = Number(i);
					var _j = Number(j);
					if (n == num) {
						return {
							'p_x': margin_left + _j * char_margin + (_j * 2 + 1) * radius + (k % 4) * (radius * 40 * 2 + 40),
							'p_y': margin_top + _i * char_margin + (_i * 2 + 1) * radius
						};
					} else {
						n++;
					}
				}
			}
		}
	}
}
var timer = null;
//动画函数
function draw_canvas(moveRandomBalls) {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	for (var i in moveRandomBalls) {
		context.beginPath();
		context.arc(moveRandomBalls[i]["c_x"], moveRandomBalls[i]["c_y"], 5, 0, Math.PI * 2, true);
		context.fillStyle = "#f00";
		context.fill();
		context.closePath();
	}

	timer = window.setInterval(function() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		for (var i in moveRandomBalls) {
			moveRandomBalls[i]['speedx'] += moveRandomBalls[i]['speedx'] / speed_g;
			moveRandomBalls[i]['speedy'] += moveRandomBalls[i]['speedy'] / speed_g;
			var x = moveRandomBalls[i]['c_x'] + moveRandomBalls[i]['speedx'];
			var y = moveRandomBalls[i]['c_y'] + moveRandomBalls[i]['speedy'];
			if ((moveRandomBalls[i]['c_x'] + moveRandomBalls[i]['speedx'] - moveRandomBalls[i]['p_x']) * (moveRandomBalls[i]['c_x'] - moveRandomBalls[i]['p_x']) <= 0) {
				x = moveRandomBalls[i]['p_x'];
			}
			if ((moveRandomBalls[i]['c_y'] + moveRandomBalls[i]['speedy'] - moveRandomBalls[i]['p_y']) * (moveRandomBalls[i]['c_y'] - moveRandomBalls[i]['p_y']) <= 0) {
				y = moveRandomBalls[i]['p_y'];
			}
			moveRandomBalls[i]['c_x'] = x;
			moveRandomBalls[i]['c_y'] = y;
			context.beginPath();
			context.arc(x, y, 5, 0, Math.PI * 2, true);
			context.fillStyle = "#f00";
			context.fill();
			context.closePath();
		}
		var tmp = 0;
		for (var i in moveRandomBalls) {
			if (moveRandomBalls[i]['c_y'] != moveRandomBalls[i]['p_y'] || moveRandomBalls[i]['c_x'] != moveRandomBalls[i]['p_x']) {
				tmp = 0;
				break;
			} else {
				tmp = 1;
			}
		}
		if (tmp == 1) {
			window.clearInterval(timer); // 动画结束
			// init(4, 8);
		}
	}, 1000 / 60);
}
var screen_one = init(0, 4);
var screen_two = init(4, 8);
(function(moveRandomBalls) {
	for (var i in moveRandomBalls) {
		context.beginPath();
		context.arc(moveRandomBalls[i]["c_x"], moveRandomBalls[i]["c_y"], 5, 0, Math.PI * 2, true);
		context.fillStyle = "#f00";
		context.fill();
		context.closePath();
	}
})(screen_one);

var click_once = 1;
document.documentElement.onclick = function() {
	if (click_once == 1) draw_canvas(screen_one);
	else if (click_once == 2) draw_canvas(screen_two);
	click_once++;
}
