
const ce = require("../util/ErrorTypes.js");

const db = require("../util/Database.js");
const tq = require("../util/TimesQuery.js");

const max_time = 3600; // 1 hour

function start(msg) {
	// does not update start_time after multiple --start's

	let query = tq.start.format({
		id: msg.author.id,
		time: db.dateTime(),
	});

	let result = db.getRows(query, (r,e) => {
		if (!e) {
			if (r.rowCount > 0) { // insert worked
				msg.reply("time started.");
			}
		}else {
			throw e;
		}
	});
}

function stop(msg) {
	let end_time = db.dateTime();

	let query = tq.stop.format({
		time: end_time,
		id: msg.author.id,
		max_time: max_time,
	});

	let result = db.getRows(query, (r,e) => {
		if (e) throw e;
		
		if (r.rowCount > 0) { // success
			msg.reply("you took " + r.rows[0].time_taken + " seconds");
		} else {
			// either:
			// 1: start hasn't been called
			// 2: time_taken is > 3600
		}
	});
}

function cancel(msg) {
	console.log("cancel");
}

function clean(msg) {
	console.log("clean");

	let query = tq.clean.format();

	let result = db.getRows(query, (r,e) => {
		if (e) {
			msg.reply("failed to clean the database!");
			return;
		}

		if (r.rowCount > 0) {
			msg.reply("Cleaned " + r.rowCount + " rows from the database.");
		} else {
			msg.reply("no rows to clean.");
		}
	});
}

function show(msg, args) {
	
	if (args[1]) { // show specific user's time
		if (args[1].startsWith("<@") && args[1].endsWith(">")) {
			// gets the user's id from the args
			let user_id = args[1].slice(2, -1);
			// gets the member from the user id
			let member = msg.guild.members.get(user_id);
			if (member) { // if the user id is valid
				show_user(msg, member);
			} else {
				msg.reply("please mention a valid user");
			}
		} else {
			msg.reply("please mention a user.");
		}
	} else { // show all users
		show_all(msg);
	}

	//console.log(msg.guild.members.get(args[1].slice(2,-1)).nickname);
}

function show_all(msg) {
	// show all users times

	let query = tq.show_all.format();

	db.getRows(query, (r, e) => {
		if (e) throw e;

		let message = "";

		for (let row of r.rows) {
			if (msg.guild.members.has(row.user_id)) {
				let member = msg.guild.members.get(row.user_id);
				message += `\t${member.displayName}: ${db.secondsToTime(row.total_time)}\n`;
			}
		}

		msg.reply("Total Times:\n" + message);
	});
}

function show_user(msg, member) {
	// show specific user's time

	let query = tq.show_user.format({
		id: member.id,
	});

	db.getRows(query, (r, e) => {
		if (e) throw e;

		if (r.rows.length) { // there is a time for user
			msg.reply(`Time Taken\n ${member.displayName}: ${db.secondsToTime(r.rows[0].total_time)}`);
		} else { // no time for user
			msg.reply(`no time for user: ${member.displayName}`);
		}
	});
}

function getUsername(member) {
return member.displayName;
	if (member.nickname) {
		return member.nickname;
	} else {
		return member.user.username;
	}
}

function timesMain(bot, info) {
	switch (info.arguments[1]) {
		case "start":
			start(info.message);
			break;
		case "stop":
			stop(info.message);
			break;
		case "cancel":
			cancel(info.message);
			break;
		case "clean":
			if (info.isAdmin) {
				clean(info.message);
			} else {
				return ce.REQUIRES_ADMIN;
			}
			break;
		default:
			return ce.INVALID_COMMAND;
	}
}

const times_whitelist = {
	"shit-talk": undefined,
	"bot-channel": undefined,
	"bot-testing": undefined,
};

module.exports = {
	name: "times",
	func: timesMain,
	admin: false,
	help: "All the times functions",
	usage: "--times [start/stop/clean]",
	aliases: [],
	whitelist: times_whitelist,
};
