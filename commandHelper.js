
const commands = require("./Commands.js").Commands;

function handleCommand(msg, args, content, command) {
	// if the command has a channel whitelist
	if (command.whitelist) {
		// if the channel is not in the whitelist then return
		if (!Object.values(command.whitelist).includes(msg.channel.id)) {
			return;
		}
	}

	let missingArgs;
	// does the command require extra args
	if (commands[args[0]].params) {
		// is there less than the minimum amount of args
		if (args.length - 1 < commands[args[0]].params) {
			// calculates the number of missing args
			missingArgs = commands[args[0]].params - (args.length - 1);
			/* reword this */
			msg.reply("The command '" + args[0] + "' requires " + commands[args[0]].params + " arguments, (only " + (args.length -1) + " were given");
			return;
		}
	}

	// gets whether the author is admin
	let isAdmin = msg.member.permissions.has("ADMINISTRATOR");
	// does the command require admin
	if (commands[args[0]].admin) {
		// is the author admin
		if (isAdmin) {
			commands[args[0]].func(msg, args, content, isAdmin);
		} else {
			msg.reply("You do not have permission to use the command '" + args[0] + "'");
		}
	} else { // command does not require admin
		commands[args[0]].func(msg, args, content, isAdmin);
	}
}

module.exports = handleCommand;
