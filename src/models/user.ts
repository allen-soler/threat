import mongoose from "mongoose"
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Document } from 'mongoose';

enum userRole {
    NORMAL = "normal",
    ADMIN = "admin"
}

interface Token {
    token: string
}

export interface userDocument extends Token, Document {
    email: string
    password: string
    role: userRole
    resetToken: string
    resetTokenExpiration: Date
    tokens?: Token[]
    createdAt?: Date
    updateAt?: Date
}

type UserMongooseModel = mongoose.Model<userDocument> & {
    findByCredentials(email: string, password: string): Promise<userDocument>
}

export type UserInstanceType = InstanceType<UserMongooseModel>;


export interface userInstance extends UserInstanceType {
    generateAuthToken(): Promise<string>
    toJSON(): any
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        validate(val: string) {
            if (validator.isEmail(val) == false) {
                throw new Error("Veuillez fournir une adresse e-mail valide")
            }
        },
        required: true

    },
    password: {
        type: String,
        trim: true,
        validate(val: string) {
            if (validator.isStrongPassword(val) === false)
                throw new Error("Mot de passe faible")
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
})

userSchema.virtual('threats', {
    ref: 'Threat',
    localField: '_id',
    foreignField: 'owner'
})

//when user is create we return an object
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.__v
    delete userObject.avatar
    delete userObject.tokens
    delete userObject.role

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET ne pas sur env");
    }

    const pwd = process.env.JWT_SECRET as string
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, pwd)

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}

//finding if user exist by email or user and comparing passwords
userSchema.statics.findByCredentials = async function (email: string, password: string) {
    const user = await User.findOne({ email })

    if (!user)
        throw new Error("Impossible de trouver l'e-mail ou utilisateur")

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
        throw new Error("Mauvais mot de passe")

    return user
}

//hashing password
userSchema.pre('save', async function (next) {
    const user = this

    if ((user as any).isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model<userInstance, UserMongooseModel>('User', userSchema);

export default User