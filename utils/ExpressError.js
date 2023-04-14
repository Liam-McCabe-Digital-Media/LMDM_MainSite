//custom error class that contains an error code as well as error message
class ExpressError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message;
		this.statusCode = statusCode;
	}
}

module.exports = ExpressError;
