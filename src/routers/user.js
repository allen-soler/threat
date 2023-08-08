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
const user_1 = __importDefault(require("../models/user"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
//saving new user
router.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_1.default(req.body);
    try {
        yield user.save();
        const token = yield user.generateAuthToken();
        res.status(201).send({ user, token });
    }
    catch (e) {
        res.status(400).send({ error: 'Failed to save user.' });
    }
}));
router.post('/user/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findByCredentials(email, password);
        const token = yield user.generateAuthToken();
        res.send({ user, token });
    }
    catch (e) {
        res.status(401).send({ error: 'Authentication failed.' });
    }
}));
router.post('/user/logout', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, token } = req;
    try {
        if (user && user.tokens) {
            user.tokens = user.tokens.filter(t => t.token !== token);
            yield user.save();
            res.send();
        }
        else {
            res.status(400).send({ error: "User ou tokens ne sont pas valides" });
        }
    }
    catch (e) {
        res.status(500).send({ error: 'Failed to log out.' });
    }
}));
exports.default = router;
