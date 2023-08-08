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
const threat_1 = __importDefault(require("../models/threat"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/threats', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const threat = new threat_1.default(Object.assign(Object.assign({}, req.body), { owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
    try {
        yield threat.save();
        res.status(201).send(threat);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get('/threats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const threats = yield threat_1.default.find();
        res.send(threats);
    }
    catch (e) {
        res.status(500).send();
    }
}));
exports.default = router;
