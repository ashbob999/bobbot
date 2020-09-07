"use strict"

const Discord = require("discord.js");

const commandErrors = require("../util/ErrorTypes.js");

function help(bot, info) {
	if (info.arguments.length >= 2) {
		// show help for specific command
		if (bot.commands.has(info.arguments[1])) {
			let command = bot.commands.get(info.arguments[1]);
			
			//let isSubCommand = command.sub;
			let parent = undefined;
			let child = undefined

			// is the command a sub command
			if (command.sub) {
				// has a sub comand been specified
				if (info.arguments.length >= 3) {
					// is the sub command valid
					if (info.arguments[2] in command.cmds) {
						parent = command.name;
						command = command.cmds[info.arguments[2]];
						child = true;
					} else {
						return commandErrors.INVALID_ARGS;
					}
				}
			}

			const helpEmbed = new Discord.RichEmbed();
			
			helpEmbed.setColor("#0000ff");

			//helpEmbed.attachFiles(["./assets/logo.png"]);
			//helpEmbed.setThumbnail("attachment://logo.png");

			helpEmbed.setTitle(`Showing Help for \`${command.name}\``);
			let msg = "***showing help for '" + command.name + "'***\n";

			helpEmbed.setDescription("Use `--help` for more general help.");

			msg += command.help + "\n";

			// display command usage
			helpEmbed.addField("Usage:", command.usage, false);
			msg += "**usage:**\n";
			msg += "\t\t" + command.usage + "\n";

			// display requires admin
			helpEmbed.addField("Requires Admin:", command.admin == undefined ? false : command.admin, false);
			msg += "**requires admin:** " + (command.admin == undefined ? false : command.admin) + "\n";

			// display aliases
			if (command.aliases.length > 0) {
				helpEmbed.addField("Aliases:", command.aliases.sort().join("\n"), false);
				msg += "**aliases:** \n";
				for (const alias of command.aliases) {
					msg += "\t\t " + alias + "\n";
				}
			}

			if (child) {
				// display parent command
				helpEmbed.addField("Parent Command:", parent, false);
				msg += "**parent command:** " + parent + "\n";

			}

			if (command.sub) {

				let subCommands = Array.from(command.mainSubCommands).sort();
				helpEmbed.addField("Sub Commands:", subCommands.join("\n"), false);
				msg += "**sub commands:**\n"
				command.mainSubCommands.forEach(v => {
					msg += "\t\t" + v + "\n"
				});
			}

			//info.message.channel.send(msg);

			info.message.channel.send(helpEmbed);
		} else {
			// invalid command name
			return commandErrors.INVALID_ARGS;
		}
	} else {

		const helpEmbed = new Discord.RichEmbed();

		helpEmbed.setColor("#0000ff");
		helpEmbed.setTitle("Help Command:");
		helpEmbed.setDescription("use `help <command>` for help on a specific command.");

		let cmds = Array.from(bot.mainCommands).sort();

		helpEmbed.addField("All Commands:", cmds.join("\n"), false);

		info.message.channel.send(helpEmbed);
	}
}

module.exports = {
	name: "help",
	func: help,
	admin: false,
	help: "Shows all commands",
	usage: "help [command]",
	aliases: [],
	whitelist: undefined,
}
