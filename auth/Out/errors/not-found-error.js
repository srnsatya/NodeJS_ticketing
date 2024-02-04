"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const custom_error_1 = require("./custom-error");
class NotFoundError extends custom_error_1.CustomError {
    constructor() {
        super('Route Not found');
        this.statusCode = 400;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializedError() {
        return [{ message: 'Route Not found' }];
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=not-found-error.js.map