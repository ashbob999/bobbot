
function example_func(msg) {
	msg.channel.send("This is an example command");
}

module.exports = {
	name: "command_example",
	func: example_func,
	admin: false,
	help: "This is some help",
	usage: "command_example",
	aliases: ["cmd_exmp"],
}