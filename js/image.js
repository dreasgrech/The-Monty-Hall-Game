var image = function(ctx, im, position) {
	var initialPos = {
		x: position.x,
		y: position.y
	};

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

