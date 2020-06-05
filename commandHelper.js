
const commands = require("./Commands.js").Commands;

function handleCommand(bot, command, info) {
	// if the command has a channel whitelist
	if (command.whitelist) {
		// if the channel is not in the whitelist then return
		if (!Object.values(command.whitelist).includes(info.msg.channel.id)) {
			return;
		}
	}

	// gets whether the author is admin
	let isAdmin = info.msg.member.permissions.has("ADMINISTRATOR");
	// does the command require admin
	if (commands[args[0]].admin) {
		// is the author admin
		if (isAdmin) {
			commands[args[0]].func(bot, isAdmin);
		} else {
			msg.reply("You do not have permission to use the command '" + args[0] + "'");
		}
	} else { // command does not require admin
		commands[args[0]].func(bot, isAdmin);
	}
}

module.exports = handleCommand;
