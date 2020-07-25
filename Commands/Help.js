"use strict"

function help(bot, info) {
	if (info.arguments.length > 1) {
		// show help for specific command
		if (bot.commands.has(info.arguments[1])) {
			let command = bot.commands.get(info.arguments[1]);
			
			let msg = "help for '" + command.name + "' command:\n";
			msg += command.help + "\n";
			msg += "usage:\n";
			msg += "\t\t" + command.usage + "\n";
			msg += "requires admin: " + (command.admin == undefined ? false : command.admin) + "\n";
		
			info.message.channel.send(msg);
		} else {
			// invalid command name
		}
	} else {
		let msg = "All Commands:\n";
		msg += "use `help <command>` for help on a specific command.\n"
		bot.commands.forEach((v, k) => {
			msg += "\t" + k + "\n";
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
