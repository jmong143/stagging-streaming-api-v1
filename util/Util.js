'use strict'

const Util = {
	ISO8601: (duration) => {
		var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
		var hours = 0, minutes = 0, seconds = 0;

		if (reptms.test(duration)) {
			var matches = reptms.exec(duration);
			if (matches[1]) hours = Number(matches[1]);
			if (matches[2]) minutes = Number(matches[2]);
			if (matches[3]) seconds = Number(matches[3]);
		}

		return Util.HHMMSSFormat(hours, minutes, seconds);
	},

	HHMMSSFormat: (hours, minutes, seconds) => {
		let HH = hours.toString().length > 1 ? hours.toString() : `0${hours.toString()}`;
		let MM = minutes.toString().length > 1 ? minutes.toString() : `0${minutes.toString()}`;
		let SS = seconds.toString().length > 1 ? seconds.toString() : `0${seconds.toString()}`;

		return `${HH}:${MM}:${SS}`
	}
};

module.exports = Util;
