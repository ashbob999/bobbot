
const commandErrors = require("./util/ErrorTypes.js");

function handleCommand(bot, info) {

	if (!bot.commands.has(info.arguments[0])) {
		// the command is invalid
		return commandErrors.INVALID_COMMAND;
	}

	let command = bot.commands.get(info.arguments[0]);

	// if the command has a channel whitelist
	if (command.whitelist) {
		// if the channel is not in the whitelist then return
		if (!Object.values(command.whitelist).includes(info.message.channel.id)) {
			return commandErrors.NOT_WHITELISTED;
		}
	}

	// gets whether the author is admin
	let isAdmin = info.message.member.permissions.has("ADMINISTRATOR");
	
	info.isAdmin = isAdmin;

	// does the command require admin
	if (command.admin) {
		// is the author admin
		if (isAdmin) {
			return command.func(bot, info);
		} else {
			return commandErrors.REQUIRES_ADMIN;
		}
	} else { // command does not require admin
		return command.func(bot, info);
	}
}

module.exports = handleCommand;
