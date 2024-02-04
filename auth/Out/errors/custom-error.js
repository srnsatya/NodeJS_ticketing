"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
/*
interface CustomError{
    statusCode: number
    serializedError():
        { message: string,
            field?: string
         }[]
}
*/ 
//# sourceMappingURL=custom-error.js.map