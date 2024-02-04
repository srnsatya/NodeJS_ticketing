"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOutRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.signOutRouter = router;
router.post('/api/users/signout', (req, res) => {
    console.log('signout api');
    res.status(200).send('signout api');
});
//# sourceMappingURL=signout.js.map