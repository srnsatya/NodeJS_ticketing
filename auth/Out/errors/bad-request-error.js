"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const custom_error_1 = require("./custom-error");
class BadRequestError extends custom_error_1.CustomError {
    constructor(err) {
        super(err);
        this.statusCode = 400;
        this.msg = '';
        this.msg = err;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializedError() {
        return [{ message: this.msg }];
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=bad-request-error.js.map