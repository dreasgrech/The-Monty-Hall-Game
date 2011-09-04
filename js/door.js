var boundingBox = function(pos, width, height) {
	return {
		isInBox: function(x, y) {
			return (x >= pos.x && y >= pos.y) && (x <= pos.x + width && y <= pos.y + height);
		}
	};
};

var door = function(utils, position) {
	var openImage = image(utils.context, 'img/opendoor.png', position),
	closedImage = image(utils.context, 'img/closeddoor.png', position),
	state = closedImage,
	bounds,
	open = function() {
		state = openImage;
	},
	close = function() {
		state = closedImage;
	};

	bounds = boundingBox(position, closedImage.width(), closedImage.height());

	return {
		open: open,
		close: close,
		toggle: function() {
			state === openImage ? close() : open();
		},
		draw: function() {
			state.draw();
		},
		isMouseOver: function(mouseX, mouseY) {
			return bounds.isInBox(mouseX, mouseY);
		},
		spawnGoat: function() {
			return goat(utils.context, {x: position.x, y: position.y + closedImage.height()});
		}
	};
};

