
function example_func(bot, info) {
	info.message.channel.send("ran sub command c2");
}

module.exports = {
	name: "c2",
	func: example_func,
	admin: false,
	help: "This is some help for c2",
	usage: "c2",
	aliases: ["rc2"],
	whitelist: undefined,
}