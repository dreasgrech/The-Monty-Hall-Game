var boundingBox = function(pos, width, height) {
	return {
		isInBox: function(x, y) {
			return (x >= pos.x && y >= pos.y) && (x <= pos.x + width && y <= pos.y + height);
		}
	};
};

var door = function(utils, position) {
	var openImage = new Image(),
	closedImage = new Image(),
	state = closedImage,
	width,
	height,
	bounds,
	open = function () {
			state = openImage;
	},
	close = function () {
			state = closedImage;
	};

	openImage.src = "img/opendoor.png";
	closedImage.src = "img/closeddoor.png";

	width = closedImage.width;
	height = closedImage.height;
	bounds = boundingBox(position, width, height);

	return {
		open: open,
		close: close,
		toggle: function() {
			state === openImage ? close() : open();
		},
		draw: function() {
			utils.drawImageOnCanvas(state, position.x, position.y);
		},
		isMouseOver: function(mouseX, mouseY) {
			return bounds.isInBox(mouseX, mouseY);
		}
	};
};

