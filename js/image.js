var image = function(ctx, src, position) {
	var im = new Image(),
	initialPos = {
		x: position.x,
		y: position.y
	},
	isLoaded;
	im.onload = function() {
		isLoaded = true;
	};
	im.src = src;

	return {
		initialPosition: function() {
			return initialPos;
		},
		position: function() {
			return position;
		},
		setPosition: function(x, y) {
				     position.x = x;
				     position.y = y;
		},
		isLoaded: function() {
			return isLoaded;
		},
		draw: function() {
			ctx.drawImage(im, position.x, position.y);
		},
		width: function() {
			return im.width;
		},
		height: function() {
			return im.height;
		}
	};
};

