window.onload = function() {
	var canvas = document.getElementById('canvas'),
	context;
	if (!canvas.getContext) {
		alert("Your browser does not support the canvas");
		return;
	}
	context = canvas.getContext('2d');

	var utils = (function(ctx) {
		return {
			context: ctx,
			drawImageOnCanvas: function(img, x, y) {
				ctx.drawImage(img, x, y);
			},
			cursor: function(type) {
				document.body.style.cursor = type;
			},
			clearCanvas: function() {
				ctx.canvas.width = ctx.canvas.width;
				ctx.canvas.height = ctx.canvas.height;
			},
			getCursorPosition: function(e) {

			},
			forEach: function(list, callback) {
				var i = 0, j = list.length;

				for (; i < j; ++i) {
					if (callback(list[i], i)) {
						return list[i];
					}
				}
			}
		};
	} (context));

	var backgroundImage = new Image();
	backgroundImage.onload = function() {
		utils.drawImageOnCanvas(backgroundImage, 0, 0);
	};
	backgroundImage.src = "img/background.png";

	var leftDoor = door(utils, {
		x: 68,
		y: 197
	}),
	middleDoor = door(utils, {
		x: 319,
		y: 197
	}),
	rightDoor = door(utils, {
		x: 566,
		y: 197
	}),
	doors = [];

	doors.push(leftDoor);
	doors.push(middleDoor);
	doors.push(rightDoor);

	setInterval(function() {
		utils.clearCanvas();
		utils.drawImageOnCanvas(backgroundImage, 0, 0);
		utils.forEach(doors, function (door) {
			door.draw();
		});
	},
	10);

	canvas.onclick = function (e) {
		var door = utils.forEach(doors, function (door) {
				if (door.isMouseOver(e.offsetX, e.offsetY)) {
					return door;
				}
		});

		if (door) {
			door.toggle();
		}
	};

	canvas.onmousemove = function(e) {
		var isMouseOnDoor;
		utils.forEach(doors, function (door) {
				if (door.isMouseOver(e.offsetX, e.offsetY)) {
					return isMouseOnDoor = true;
				}
		});

		utils.cursor(isMouseOnDoor ? 'pointer' : 'default');
	};
};

