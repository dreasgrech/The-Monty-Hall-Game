window.onload = function() {
	var canvas = document.getElementById('canvas');
	if (!canvas.getContext) {
		alert("Your browser does not support the canvas");
		return;
	}
	var context = canvas.getContext('2d'),
	WIDTH = 800,
	HEIGHT = 600,
	utils = (function(ctx) {
		return {
			context: ctx,
			/*
			drawImageOnCanvas: function(img, x, y) {
				ctx.drawImage(img, x, y);
			},*/
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
				var i = 0,
				j = list.length;

				for (; i < j; ++i) {
					if (callback(list[i], i)) {
						return list[i];
					}
				}
			}
		};
	} (context)),
	backgroundImage = image(context, "img/background.png", {
		x: 0,
		y: 0
	}),
	setImage = image(context, "img/set.png", {
		x: 0,
		y: 0
	}),
	titles = (function(ctx) {
		var im = image(ctx, "img/title.png", {
			x: (WIDTH / 2) - (710 / 2),
			y: 0
		});

		return {
			draw: function () {

			},
			update: function () {

			},
			show: function() {

			}
		};
	} (context)),
	leftDoor = door(utils, {
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
	doors = [],
	goats = [],
	reset = function() {
		utils.forEach(doors, function(door) {
			door.close();
		});
	};

	goatImage = middleDoor.spawnGoat();

	doors.push(leftDoor);
	doors.push(middleDoor);
	doors.push(rightDoor);

	middleDoor.open();
	goatImage.peek();

	setInterval(function() {
		goatImage.update();

		utils.clearCanvas();
		backgroundImage.draw();
		goatImage.draw();
		setImage.draw();
		utils.forEach(doors, function(door) {
			door.draw();
		});
	},
	40);

	canvas.onclick = function(e) {
		var door = utils.forEach(doors, function(door) {
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
		utils.forEach(doors, function(door) {
			if (door.isMouseOver(e.offsetX, e.offsetY)) {
				return isMouseOnDoor = true;
			}
		});

		utils.cursor(isMouseOnDoor ? 'pointer': 'default');
	};
};

