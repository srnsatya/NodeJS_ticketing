"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnectionError = void 0;
const custom_error_1 = require("./custom-error");
class DBConnectionError extends custom_error_1.CustomError {
    constructor() {
        super('DBConnectionError');
        this.statusCode = 500;
        this.reason = '';
        this.reason = "Error connecting DB";
        Object.setPrototypeOf(this, DBConnectionError.prototype);
    }
    serializedError() {
        return [{ message: this.reason }];
    }
}
exports.DBConnectionError = DBConnectionError;
//# sourceMappingURL=db-connection-error.js.map