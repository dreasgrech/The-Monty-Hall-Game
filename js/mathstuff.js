var mathStuff = (function() {
	var lerp = function(from, to, w) {
		return from + (to - from) * w;
	};

	return {
		lerp: lerp,
		cos: function(from, to, w) {
			return lerp(from, to, ( - Math.cos(Math.PI * w)));
		},
		smoothstep: function(from, to, w) {
			return lerp(from, to, (w * w) * (3 - 2 * w));
		}
	};
} ());

