
// list of error types for a message
// (effectively an enum)
const errors = {
	NOT_ADMIN: "not_admin",
	INVALID_COMMAND: "invalid_command",
	MISSING_ARGS: "missing_args",
};

// make values immutable
Object.freeze(errors);

module.exports = errors;