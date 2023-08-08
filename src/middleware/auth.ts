import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import User, { userDocument } from '../models/user';

interface DecodedPayload extends jwt.JwtPayload {
    _id?: string;
}

export interface IUser extends userDocument {
    _id: string;
    __v: number;
}

interface AuthenticatedRequest extends Request {
    token?: string;
    user?: IUser;
}

const JWT_SECRET_MISSING = "La variable d'environnement JWT_SECRET n'est pas définie.";
const AUTHORIZATION_MISSING = "En-tête d'autorisation manquant ou malformé.";
const USER_ID_MISSING = "L'identifiant de l'utilisateur est manquant dans le jeton.";
const USER_NOT_FOUND = 'Aucun utilisateur trouvé pour ce jeton.';

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!process.env.JWT_SECRET) {
        throw new Error(JWT_SECRET_MISSING);
    }

    const pwd = process.env.JWT_SECRET as string;

    try {
        const AUTHORIZATION_PREFIX = 'Bearer ';
        const token = req.header('Authorization')?.replace(AUTHORIZATION_PREFIX, '');

        if (!token) {
            throw new Error(AUTHORIZATION_MISSING);
        }

        const decoded = jwt.verify(token, pwd) as DecodedPayload;

        if (!decoded._id) {
            throw new Error(USER_ID_MISSING);
        }

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) as IUser;

        if (!user) {
            throw new Error(USER_NOT_FOUND);
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        if (e instanceof JsonWebTokenError) {
            // Handle JWT-specific errors distinctly if necessary.
        }
        res.status(401).send({
            error: "Veuillez vous authentifier."
        });
    }
}

export default auth;
