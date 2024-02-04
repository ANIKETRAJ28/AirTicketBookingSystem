const { StatusCodes } = require("http-status-codes");

class ValidationError extends Error {
    constructor(error) {
        super();
        let explaination = [];
        error.errors.foreach((err) => {
            explaination.push(err);
        });
        this.message = "Not able to validate data sent in the request",
        this.explaination = explaination,
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = ValidationError;