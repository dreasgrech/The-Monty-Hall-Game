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
	reset = function() {
		utils.forEach(doors, function(door) {
			door.close();
		});
	},
	images = imageManager({
		background: "img/background.png",
		set: "img/set.png",
		title: "img/title.png",
		opendoor: "img/opendoor.png",
		closeddoor: "img/closeddoor.png",
		goat: "img/goat.png"
	});

	images.load(function(imageList) {
		var backgroundImage = image(context, imageList.background, {
			x: 0,
			y: 0
		}),
		setImage = image(context, imageList.set, {
			x: 0,
			y: 0
		}),
		createDoor = function(position) {
			return door(utils, position, imageList);
		},
		leftDoor = createDoor({
			x: 68,
			y: 197
		}),
		middleDoor = createDoor({
			x: 319,
			y: 197
		}),
		rightDoor = createDoor({
			x: 566,
			y: 197
		}),
		doors = [],
		goats = [],
		titles = (function(ctx) {
			var im = image(ctx, imageList.title, {
				x: (WIDTH / 2) - (710 / 2),
				y: - 91
			}),
			isAnimating,
			lValue = 0;

			return {
				draw: function() {
					im.draw();
				},
				update: function() {
					var y;
					if (isAnimating) {
						y = mathStuff.smoothstep(im.initialPosition().y, 50, lValue);
						lValue += 0.05;
						if (lValue > 1) {
							isAnimating = false;

						}
						im.setPosition(im.position().x, y);

					}
				},
				show: function() {
					isAnimating = true;
				}
			};
		} (context)),
		goatImage = middleDoor.spawnGoat();

		doors.push(leftDoor);
		doors.push(middleDoor);
		doors.push(rightDoor);

		middleDoor.open();
		goatImage.peek();

		titles.show();
		setInterval(function() {
			goatImage.update();
			titles.update();

			utils.clearCanvas();
			backgroundImage.draw();
			goatImage.draw();
			setImage.draw();
			titles.draw();
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

	});

};

