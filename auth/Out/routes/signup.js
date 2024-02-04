"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const request_validation_error_1 = require("../errors/request-validation-error");
const users_1 = require("../models/users");
const bad_request_error_1 = require("../errors/bad-request-error");
const router = express_1.default.Router();
exports.signUpRouter = router;
router.post('/api/users/signup', [
    (0, express_validator_1.body)('email').isEmail().withMessage('email must be provided'),
    (0, express_validator_1.body)('password').trim().isLength({ min: 4, max: 20 }).withMessage('password must ber 4 to 20 characters')
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log('signup api');
    if (!errors.isEmpty()) {
        /*let errorString=''
        errors.array().forEach(element => {
            errorString=element['msg']+','
        });
        throw new Error(errorString.substring(0,errorString.length-1))
        */
        throw new request_validation_error_1.RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const existingUser = yield users_1.User.findOne({ email });
    console.log('existingUser:', existingUser);
    if (existingUser) {
        throw new bad_request_error_1.BadRequestError('User already exists with same email!!');
    }
    else {
        console.log('user creating');
        const ud = users_1.User.build({
            email: email,
            password: password
        });
        yield ud.save();
        res.status(200).send(ud);
    }
}));
//# sourceMappingURL=signup.js.map