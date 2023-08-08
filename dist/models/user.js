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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var userRole;
(function (userRole) {
    userRole["NORMAL"] = "normal";
    userRole["ADMIN"] = "admin";
})(userRole || (userRole = {}));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        validate(val) {
            if (validator_1.default.isEmail(val) == false) {
                throw new Error("Veuillez fournir une adresse e-mail valide");
            }
        },
        required: true
    },
    password: {
        type: String,
        trim: true,
        validate(val) {
            if (validator_1.default.isStrongPassword(val) === false)
                throw new Error("Mot de passe faible");
        },
        required: true
    },
    role: {
        type: String,
        enum: Object.values(userRole),
        default: userRole.NORMAL
    },
    resetToken: String,
    resetTokenExpiration: Date,
    tokens: [{
            token: {
                type: String,
                require: true
            }
        }]
}, {
    timestamps: true
});
userSchema.virtual('threats', {
    ref: 'Threat',
    localField: '_id',
    foreignField: 'owner'
});
//when user is create we return an object
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;
    delete userObject.avatar;
    delete userObject.tokens;
    delete userObject.role;
    return userObject;
};
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET ne pas sur env");
        }
        const pwd = process.env.JWT_SECRET;
        const user = this;
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, pwd);
        user.tokens = user.tokens.concat({ token: token });
        yield user.save();
        return token;
    });
};
//finding if user exist by email or user and comparing passwords
userSchema.statics.findByCredentials = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ email });
        if (!user)
            throw new Error("Impossible de trouver l'e-mail ou utilisateur");
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error("Mauvais mot de passe");
        return user;
    });
};
//hashing password
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password')) {
            user.password = yield bcrypt_1.default.hash(user.password, 8);
        }
        next();
    });
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
