"use strict"

const fs = require ("fs");

function load(cmds) {
	// get list of .js files from command folder
	// excludes .js files that start with and underscore
	const commandFiles = fs.readdirSync('./Commands')
						   .filter(file => file.endsWith('.js') && !file.startsWith("_"));

	for (const file of commandFiles) {
		const command = require(`./Commands/${file}`);

		// set a new item in the Collection
		// with the key as the command name and the value as the exported module
		cmds.set(command.name, command);

		// set command aliases
		for (const alias of command.aliases) {
			cmds.set(alias, command);
		}
	}
}

function loadSubs(cmds) {
	// get list of all folders
	// exclude folders starting with underscore
	const commandFolders = fs.readdirSync("./Commands", {withFileTypes : true})
							 .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith("_"))
							 .map(dirent => dirent.name);

	for (const folder of commandFolders) {
		const command = require(`./Commands/${folder}`);

		// update amd set sub command aliases
		Object.keys(command.cmds).forEach(subCmdName => {
			let subCmd = command.cmds[subCmdName];

			for (const alias of subCmd.aliases) {
				command.cmds[alias] = subCmd;
			}
		});

		// set a new item in the Collection
		// with the key as the command name and the value as the exported module
		cmds.set(command.name, command);

		// set commnad aliases
		for (const alias of command.aliases) {
			cmds.set(alias, command);
		}
	}
}

module.exports = {
	load,
	loadSubs
}