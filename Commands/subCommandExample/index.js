
function base(bot, info) {
	info.message.channel.send("base of sub command");
}

module.exports = {
	name: "sub_command_example",
	sub: true,
	func: base,
	admin: false,
	help: "This is some help",
	usage: "sub_command_example",
	aliases: ["sub_examp"],
	whitelist: undefined,

	cmds: {
		c1: require("./c1.js"),
		c2 : require("./c2.js"),
	},
}