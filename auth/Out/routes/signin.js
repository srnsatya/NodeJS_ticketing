"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.signInRouter = router;
router.post('/api/users/signin', (req, res) => {
    console.log('signin api');
    res.status(200).send('signin api');
});
//# sourceMappingURL=signin.js.map