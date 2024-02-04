class AppError extends Error {
    constructor(
        name,
        message,
        expaination,
        statusCode
    ) {
        super();
        this.name = name;
        this.message = message;
        this.expaination = expaination;
        this.statusCode = statusCode;
    }
}

module.exports = AppError;