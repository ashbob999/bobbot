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
	}
}

function loadSubs(cmds) {

}

module.exports = {
	load,
	loadSubs
}