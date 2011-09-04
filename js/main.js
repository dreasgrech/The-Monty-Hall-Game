window.onload = function() {
	var canvas = document.getElementById('canvas');
	if (!canvas.getContext) {
		alert("Your browser does not support the canvas");
		return;
	}

	var context = canvas.getContext('2d'),
	utils = (function(ctx) {
		return {
			context: ctx,
			WIDTH: 800,
			HEIGHT: 600,
			cursor: function(type) {
				document.body.style.cursor = type;
			},
			clearCanvas: function() {
				ctx.canvas.width = ctx.canvas.width;
				ctx.canvas.height = ctx.canvas.height;
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
	images = imageManager({
		background: "img/background.png",
		set: "img/set.png",
		title: "img/title.png",
		opendoor: "img/opendoor.png",
		closeddoor: "img/closeddoor.png",
		selectedcloseddoor: "img/selectedcloseddoor.png",
		goat: "img/goat.png",
		car: "img/car.png",
		switchquestion: "img/switchquestion.png",
		noanswer: "img/no.png",
		yesanswer: "img/yes.png"
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
		reset = function() {
			goats = [];
			utils.forEach(doors, function(door) {
				door.close();
			});
		},
		statistics = (function() {
			var result = function(won, switchedDoor) {
				return {
					won: won,
					switchedDoor: switchedDoor
				}
			},
			results = [],
			wins = 0;

			return {
				addResult: function(won, switchedDoor) {
					results.push(result(won, switchedDoor));
					if (won) {
						wins++;
					}
				}
			};
		} ()),
		createDoor = function(id, position) {
			return door(id, utils, position, imageList);
		},
		leftDoor = createDoor(1, {
			x: 68,
			y: 197
		}),
		middleDoor = createDoor(2, {
			x: 319,
			y: 197
		}),
		rightDoor = createDoor(4, {
			x: 566,
			y: 197
		}),
		doors = [],
		goats = [],
		switchQuestion = question(utils, imageList),
		titles = (function(ctx) {
			var im = image(ctx, imageList.title, {
				x: (utils.WIDTH / 2) - (710 / 2),
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
						y = mathStuff.smoothstep(im.initialPosition().y, 40, lValue);
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
		update = function() {
			utils.forEach(goats, function(goat) {
				goat.update();
			});
			titles.update();
		},
		draw = function() {
			utils.clearCanvas();
			backgroundImage.draw();
			utils.forEach(goats, function(goat) {
				goat.draw();
			});
			setImage.draw();
			titles.draw();
			utils.forEach(doors, function(door) {
				door.draw();
			});
			switchQuestion.draw();

		},
		step = function() {
			update();
			draw();
		},
		currentGame,
		getDoorById = function(id) {
			return utils.forEach(doors, function(door) {
				if (door.id() === id) {
					return door;
				}
			});
		},
		game = function() {
			var initialGuessDoor, montysOpenedDoor, takeInitialGuess = function(door) {
				var beast;
				initialGuessDoor = door;

				door.select();
				if (door.id() == winningDoor.id()) { // The player chose the winning door, so randomly one of the two remaining doors which now both contain goats
					// TODO: refactor this mess
					var remainingDoors = [];
					if (door.id() & 0x1) {
						remainingDoors.push(0x2);
						remainingDoors.push(0x4);
					} else if (door.id() & 0x2) {
						remainingDoors.push(0x1);
						remainingDoors.push(0x4);
					} else {
						remainingDoors.push(0x1);
						remainingDoors.push(0x2);
					}

					montysOpenedDoor = getDoorById(remainingDoors[mathStuff.random(0, 1)]);
				} else { // The player chose a non-winning door, so open the other door that contains a goat
					montysOpenedDoor = getDoorById((door.id() + winningDoor.id()) ^ 0x7);
				}

				beast = montysOpenedDoor.spawnGoat();
				goats.push(beast);
				montysOpenedDoor.open();
				beast.peek();

				state = 'switchdoor';
				switchQuestion.show();
			},
			clickDoor = function(door) {
				if (state === 'guess') {
					takeInitialGuess(door);
				} else if (state === 'switchdoor') {

				}
			},
			state = 'guess',
			winningDoor = doors[mathStuff.random(0, 2)];
			console.log('Winning Door', winningDoor.id());

			return {
				state: function() {
					return state;
				},
				clickDoor: clickDoor,
				hoveringOnDoor: function(door) {
					if (state === 'switchdoor') {
						if (door === initialGuessDoor) {
							switchQuestion.showNoAnswer();
						} else if (door !== montysOpenedDoor) {
							switchQuestion.showYesAnswer();
						}
					}
				}
			};

		};

		switchQuestion.hide();
		doors.push(leftDoor);
		doors.push(middleDoor);
		doors.push(rightDoor);

		titles.show();

		setInterval(step, 30);

		currentGame = game();

		canvas.onclick = function(e) {
			var door = utils.forEach(doors, function(door) {
				if (door.isMouseOver(e.offsetX, e.offsetY)) {
					return door;
				}
			});

			if (door) {
				if (currentGame.state() === 'guess') {
					currentGame.clickDoor(door);
				}
			}
		};

		canvas.onmousemove = function(e) {
			var isMouseOnDoor;
			utils.forEach(doors, function(door) {
				if (door.isMouseOver(e.offsetX, e.offsetY)) {
					currentGame.hoveringOnDoor(door);
					if (!door.isOpened()) {
						return isMouseOnDoor = true;
					}
				}
			});
			if (!isMouseOnDoor) {
					switchQuestion.hideAnswers();
			}

			utils.cursor(isMouseOnDoor ? 'pointer': 'default');
		};

	});

};

