"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const JWT_SECRET_MISSING = "La variable d'environnement JWT_SECRET n'est pas définie.";
const AUTHORIZATION_MISSING = "En-tête d'autorisation manquant ou malformé.";
const USER_ID_MISSING = "L'identifiant de l'utilisateur est manquant dans le jeton.";
const USER_NOT_FOUND = 'Aucun utilisateur trouvé pour ce jeton.';
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!process.env.JWT_SECRET) {
        throw new Error(JWT_SECRET_MISSING);
    }
    const pwd = process.env.JWT_SECRET;
    try {
        const AUTHORIZATION_PREFIX = 'Bearer ';
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace(AUTHORIZATION_PREFIX, '');
        if (!token) {
            throw new Error(AUTHORIZATION_MISSING);
        }
        const decoded = jsonwebtoken_1.default.verify(token, pwd);
        if (!decoded._id) {
            throw new Error(USER_ID_MISSING);
        }
        const user = yield user_1.default.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error(USER_NOT_FOUND);
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
            // Handle JWT-specific errors distinctly if necessary.
        }
        res.status(401).send({
            error: "Veuillez vous authentifier."
        });
    }
});
exports.default = auth;
