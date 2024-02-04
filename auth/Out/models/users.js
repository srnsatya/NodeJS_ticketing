"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//Schema for mongoose
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
//binding build method with specific attributes only to mongoose model
userSchema.statics.build = (attributes) => {
    return new User(attributes);
};
// load schema and get model
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=users.js.map