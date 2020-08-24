
module.exports = {
	name: "sub_command_example",
	sub: true,
	admin: false,
	help: "This is some help",
	usage: "sub_command_example",
	aliases: ["cmd_exmp"],
	whitelist: undefined,

	cmds: {
		c1: require("./c1.js"),
		c2 : require("./c2.js"),
	},
}