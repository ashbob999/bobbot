"use strict"

const fs = require("fs");

function load(bot, whitelist) {
	// get list of .js files from command folder
	// excludes .js files that start with and underscore
	const commandFiles = fs.readdirSync('./Commands')
		.filter(file => file.endsWith('.js') && !file.startsWith("_"));

	for (const file of commandFiles) {
		const command = require(`./Commands/${file}`);

		update_whitelist(command, whitelist);

		// set a new item in the Collection
		// with the key as the command name and the value as the exported module
		bot.commands.set(command.name, command);

		// add main command name to bot.mainCommands
		bot.mainCommands.add(command.name);

		// set command aliases
		for (const alias of command.aliases) {
			bot.commands.set(alias, command);
		}
	}
}

function loadSubs(bot, whitelist) {
	// get list of all folders
	// exclude folders starting with underscore
	const commandFolders = fs.readdirSync("./Commands", { withFileTypes: true })
		.filter(dirent => dirent.isDirectory() && !dirent.name.startsWith("_"))
		.map(dirent => dirent.name);

	for (const folder of commandFolders) {
		const command = require(`./Commands/${folder}`);

		update_whitelist(command, whitelist);

		// create set for mainSubCommands
		command.mainSubCommands = new Set();

		// update and set sub command aliases
		Object.keys(command.cmds).forEach(subCmdName => {
			let subCmd = command.cmds[subCmdName];

			update_whitelist(subCmd, whitelist);

			// add subCmd to mainSubCommands
			command.mainSubCommands.add(subCmdName);

			for (const alias of subCmd.aliases) {
				command.cmds[alias] = subCmd;
			}
		});

		// set a new item in the Collection
		// with the key as the command name and the value as the exported module
		bot.commands.set(command.name, command);

		// add main command name to bot.mainCommands
		bot.mainCommands.add(command.name);

		// set commnad aliases
		for (const alias of command.aliases) {
			bot.commands.set(alias, command);
		}
	}
}

function update_whitelist(command, whitelist) {
	// see if there is any whitelist for the command
	if (command.whitelist == undefined || command.whitelist.length == 0) {
		command.whitelist_ids = undefined; // any channel
	} else {
		command.whitelist_ids = new Set(); // the specified channels

		// add the id's from each whitelist group
		for (const whitelist_name of command.whitelist) {
			if (whitelist_name in whitelist) {
				for (const id of whitelist[whitelist_name]) {
					command.whitelist_ids.add(id);
				}
			}
		}
	}
}

module.exports = {
	load,
	loadSubs
}
