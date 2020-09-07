"use strict"

const commandErrors = require("../util/ErrorTypes.js");

function help(bot, info) {
	if (info.arguments.length >= 2) {
		// show help for specific command
		if (bot.commands.has(info.arguments[1])) {
			let command = bot.commands.get(info.arguments[1]);
			
			let isSubCommand = command.sub;
			let parent = undefined;

			// is the command a sub command
			if (isSubCommand) {
				// has a sub comand been specified
				if (info.arguments.length >= 3) {
					// is the sub command valid
					if (info.arguments[2] in command.cmds) {
						parent = command.name;
						command = command.cmds[info.arguments[2]];
					} else {
						return commandErrors.INVALID_ARGS;
					}
				}
			}
			
			let msg = "***showing help for '" + command.name + "'***\n";

			msg += command.help + "\n";

			msg += "**usage:**\n";
			msg += "\t\t" + command.usage + "\n";

			msg += "**requires admin:** " + (command.admin == undefined ? false : command.admin) + "\n";

			msg += "**aliases:** \n";
			for (const alias of command.aliases) {
				msg += "\t\t " + alias + "\n";
			}

			if (isSubCommand) {
				msg += "**parent command:** " + parent + "\n";

				msg += "**sub commands:**\n"
				command.mainSubCommands.forEach(v => {
					msg += "\t\t" + v + "\n"
				});
			}

			info.message.channel.send(msg);
		} else {
			// invalid command name
			return commandErrors.INVALID_ARGS;
		}
	} else {
		let msg = "***use `help <command>` for help on a specific command.***\n"
		msg += "**All Commands:**\n";
		bot.mainCommands.forEach(k => {
			msg += "\t\t" + k + "\n";
		});
		info.message.channel.send(msg);
	}
}

module.exports = {
	name: "help",
	func: help,
	admin: false,
	help: "Shows all commands",
	usage: "help [command]",
	aliases: [],
	whitelist: undefined,
}
