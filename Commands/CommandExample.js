"use strict"

function example_func(bot, info) {
	info.message.channel.send("This is an example command");
}

module.exports = {
	name: "command_example",
	func: example_func,
	admin: false,
	help: "This is some help",
	usage: "command_example",
	aliases: ["cmd_exmp"],
	whitelist: undefined,
}