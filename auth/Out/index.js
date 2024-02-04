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
// customer express
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
// customer imports
const current_user_1 = require("./routes/current-user");
const signin_1 = require("./routes/signin");
const signup_1 = require("./routes/signup");
const signout_1 = require("./routes/signout");
const error_handler_1 = require("./middlewares/error-handler");
const not_found_error_1 = require("./errors/not-found-error");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use(current_user_1.currentUserRouter);
app.use(signin_1.signInRouter);
app.use(signup_1.signUpRouter);
app.use(signout_1.signOutRouter);
// app.get('*',async (req,res,next)=>{
// 	next( new NotFoundError())	
// })
app.all('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw new not_found_error_1.NotFoundError();
}));
app.get('/api/users/hello', (req, res) => {
    console.log('hello to auth');
    res.status(200).send('hello to auth');
});
app.use(error_handler_1.errorHandler);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('start connection');
    try {
        // await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
        // .then(() => console.log('Connected to mongo db!'));
        yield mongoose_1.default.connect('mongodb://0.0.0.0:27017/auth').then(() => console.log('Connected to local mongo db!'));
    }
    catch (err) {
        console.error(err);
    }
    console.log('end connection');
    app.listen(5000, () => {
        console.log('listening port 5000!!!!!!!##!!!!!!!!!');
    });
});
start();
//# sourceMappingURL=index.js.map