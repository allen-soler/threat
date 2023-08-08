"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routers/user"));
const threats_1 = __importDefault(require("./routers/threats"));
require("./db/mongoose");
const httpsRedirect = require('express-https-redirect');
const cors = require('cors');
const app = (0, express_1.default)();
//app.use('/', httpsRedirect());
app.use(express_1.default.json());
app.use(cors());
app.use(user_1.default);
app.use(threats_1.default);
// If you still want the dashboard routes, you can keep this
// Dashboard Router (create a separate router for dashboard routes)
exports.default = app;
