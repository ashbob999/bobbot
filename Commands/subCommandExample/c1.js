
function example_func(bot, info) {
	info.message.channel.send("ran sub command c1");
}

module.exports = {
	name: "c1",
	func: example_func,
	admin: false,
	help: "This is some help for c1",
	usage: "c1",
	aliases: [],
	whitelist: undefined,
}