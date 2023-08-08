"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const threatSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        default: Date.now,
        required: true
    },
    entries: [{
            description: {
                type: String,
                trime: true,
                required: true
            }
        }],
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        requred: true,
        ref: 'User'
    }
}, {
    timestamps: true
});
const Threat = mongoose_1.default.model('Threat', threatSchema);
exports.default = Threat;
