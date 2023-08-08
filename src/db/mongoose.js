"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
if (!process.env.MONGOOSECONATLAS) {
    throw new Error("MOONGOSEATLAS ne pas sur env");
}
const connection = process.env.MONGOOSECONATLAS;
const dbName = 'threats-app';
mongoose_1.default.connect(connection, {});
