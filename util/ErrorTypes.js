
// list of error types for a message
// (effectively an enum)
const errors = {
	REQUIRES_ADMIN: "ERROR_requires_admin",
	INVALID_COMMAND: "ERROR_invalid_command",
	INVALID_SUB_COMMAND: "ERROR_invalid_sub_command",
	MISSING_ARGS: "ERROR_missing_args",
	NOT_WHITELISTED: "ERROR_channel_not_whitelisted",
};

// make values immutable
Object.freeze(errors);

module.exports = errors;