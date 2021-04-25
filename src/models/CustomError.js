class CustomError {
    constructor(httpStatusCode, message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}

module.exports = CustomError;
