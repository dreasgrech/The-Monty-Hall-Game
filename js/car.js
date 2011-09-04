var car = function(ctx, position, carImage) {
	var im = image(ctx, goatImage, position),
	isDriving,
	lValue = 0;

	return {
		update: function() {
			if (isDriving) {
				var x = mathStuff.smoothstep(im.initialPosition().x, im.initialPosition().y - 100, lValue);
				lValue += 0.05;
				if (lValue > 1) {
					lValue = 0;
					isDriving = false;
				}
				im.setPosition(im.position().x, y);
			}
		},
		draw: function() {
			im.draw();
		},
		drive: function() {
			isDriving = true;
		}
	};
};


