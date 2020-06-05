
// list of error types for a message
// (effectively an enum)
const errors = {
	REQUIRES_ADMIN: "ERROR_requires_admin",
	INVALID_COMMAND: "ERROR_invalid_command",
	MISSING_ARGS: "ERROR_missing_args",
};

// make values immutable
Object.freeze(errors);

module.exports = errors;