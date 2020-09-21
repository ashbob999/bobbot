"use strict"

const db = module.parent.db;
const tq = module.parent.timesQuery;

const Discord = require("discord.js");

function show(bot, info) {
	console.log(info.arguments);
	if (info.arguments.length == 1) {
		// show all users times
	} else {
		// show given users times
		let ids = [];
		for (let i = 1; i < info.arguments.length; i++) {
			let arg = info.arguments[i];
			if (arg.startsWith("<@") && arg.endsWith(">")) {
				arg = arg.slice(2, -1);
				ids.push("'" + arg + "'");
			}
		}

		if (ids.length == 0) {
			return;
		}

		ids = "(" + ids.join(",") + ")";

		let query = tq.show_users.format({
			ids: ids,
		});

		let result = db.getRows(query, (r, e) => {
			if (!e) {
				if (r.rowCount > 0) {
					const embed = new Discord.RichEmbed();
					
					embed.setColor("#0000ff");

					embed.setTitle("**Times Taken:**");

					r.rows.forEach(e => {
						embed.addField(getNickname(e["user_id"], info.message), 
									   db.secondsToTime(e["total_time"]));
					});

					info.message.channel.send(embed);
				}
			} else {
				throw e;
			}
		});
	}
}

function getNickname(id, message) {
	let guild = message.guild;
	let member = guild.members.get(id);
	return member.displayName;
}

module.exports = {
	name: "show",
	func: show,
	admin: false,
	help: "Shows people's times",
	usage: "show - shows everybody's times\n" +
		   "show <user> - shows specific user times\n" +
		   "show <user1> <user2> - shows multiple users times",
	aliases: [],
	whitelist: undefined,
}