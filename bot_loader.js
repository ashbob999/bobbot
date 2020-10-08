"use-strict"

const https = require("https");

function ping(url) {
	let req = https.request(url, res => {
		if (res.statusCode == 200) {
			res.setEncoding("utf8");
			res.on("data", d => {
				// do nothing with the data
				console.log("got data from:", url);
			}
		} else {
			console.log("status code:", res.statusCode);
		}
	});

	req.on("error", e => {
		console.log(e);
	});
}

/*
Create 20 minute timer
if endTime - now < 20 mins:
	call other bot
	stop repeating


bot 1 does 00:00 -> 12:00 (am)
bot 2 does 12:00 -> 00:00 (pm)
*/

// sleep function
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
	while (true) {
		// check time
		let now = new Date();
		let bot_id = process.env.ID;
		let hours = now.getUTCHours();
		let minutes = now.getUTCMinutes();

		// check if we should stop
		if (bot_id == 1) {
			if (hours == 11 && minutes >= 40) {
				// start bot 2 (ping url)
				console.log("ping bot 2");

				ping(process.env.url2)

				return;
			}
		} else if (bot_id == 2) {
			if (hours == 23 && minutes >= 40) {
				// start bot 1 (ping url)
				console.log("ping bot 1");

				ping(process.env.url1);

				return;
			}
		}

		// ping itself
		ping(process.env["url" + bot_id]);

		// wait 20 minutes
		await sleep(20*3600*1000);
	}
}

function start() {
	let now = new Date();
	let hours = now.getUTCHours();
	let bot_id = process.env.ID;
	
	// check if shoud do out-of-hours timeout
	if (process.env.timeout == undefined) {
		// stop if running out of hours
		if (bot_id == 1) {
			if (hours >= 12) {
				console.log("bot 1, out of hours");
				process.exit();
			}
		} else if (bot_id == 2) {
			if (hours < 12) {
				console.log("bot 2, out of hours");
				process.exit();
			}
		}
	}

	// start timer
	run();
}

module.exports = {
	start,
};