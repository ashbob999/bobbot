
function help(bot, info) {
	if (info.arguments.length > 1) {
		// show help for specific command
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
