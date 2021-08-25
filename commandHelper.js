"use strict"

const commandErrors = require("./util/ErrorTypes.js");

function subCommand(bot, info, command) {
	// if no sub command has been given
	// run base command
	if (info.arguments.length == 1) {
		return command.func(bot, info);
	}

	let subCmdStr = info.arguments[1];

	// set parent command name
	info.parentCmd = info.arguments[0];

	// remove first argument from arguments
	info.arguments.shift();

	// command does not exist
	if (!(subCmdStr in command.cmds)) {
		return commandErrors.INVALID_SUB_COMMAND;
	}

	let subCmd = command.cmds[subCmdStr];

	// if the command has a channel whitelist
	if (subCmd.whitelist_ids) {
		// if the channel is not in the whitelist then return
		if (!subCmd.whitelist_ids.has(info.message.channel.id)) {
			return commandErrors.NOT_WHITELISTED;
		}
	}

	// does the command require admin
	if (subCmd.admin) {
		// is the author admin
		if (info.isAdmin) {
			return subCmd.func(bot, info);
		} else {
			return commandErrors.REQUIRES_ADMIN;
		}
	} else { // command does not require admin
		return subCmd.func(bot, info);
	}
}

function handleCommand(bot, info) {

	if (!bot.commands.has(info.arguments[0])) {
		// the command is invalid
		return commandErrors.INVALID_COMMAND;
	}

	let command = bot.commands.get(info.arguments[0]);

	// if the command has a channel whitelist
	if (command.whitelist_ids) {
		// if the channel is not in the whitelist then return
		if (!command.whitelist_ids.has(info.message.channel.id)) {
			return commandErrors.NOT_WHITELISTED;
		}
	}

	// gets whether the author is admin
	let isAdmin = info.message.member.permissions.has("ADMINISTRATOR");

	info.isAdmin = isAdmin;

	// does the command require admin
	if (command.admin) {
		// is the author admin
		if (isAdmin) {
			// is the command a sub command
			if (command.sub) {
				return subCommand(bot, info, command);
			} else {
				return command.func(bot, info);
			}
		} else {
			return commandErrors.REQUIRES_ADMIN;
		}
	} else { // command does not require admin
		// is the command a sub command
		if (command.sub) {
			return subCommand(bot, info, command);
		} else {
			return command.func(bot, info);
		}
	}
}

module.exports = handleCommand;
