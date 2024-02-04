"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom-error");
const errorHandler = (err, req, res, next) => {
    if (err instanceof custom_error_1.CustomError) {
      //  console.log('CustomError handler');
        return res.status(err.statusCode).send({
            errors: err.serializedError()
        });
    }
    return res.status(500).send({
        errors: [{ message: 'Unexpected Error happened' }]
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map