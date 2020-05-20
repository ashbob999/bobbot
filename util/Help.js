
const commands = require("./../commands.js").Commands;

function showHelp(msg, args) {
	// if help has arguments
	if (args.length > 1) {
		// send command specific help
		if (args[1] in commands) {
			let reply = "Command '" + args[1] + "':\n";
			reply += "\tDesc: " + commands[args[1]].desc + "\n";
			reply += "\tUsage: "+ commands[args[1]].usage;
			msg.channel.send(reply);
		} else { // invalid command
			msg.channel.send("'" + args[1] + "' is not a command");
		}
		return;
	} else { // show help for all commands
		msg.channel.send("help all commands");
	}
}

module.exports = {
	name: "Help",
	showHelp,
}