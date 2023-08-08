import User from "../models/user"
import express from 'express'
import auth from '../middleware/auth'
import { Request, Response } from 'express';
import { userInstance } from "../models/user"
import { IUser } from '../middleware/auth'

interface userLogin extends Request {
    email?: string
    password?: string
}

interface userLogOut extends Request {
    user?: IUser
    token?: string
}

const router = express.Router();

//saving new user
router.post('/user', async (req: Request, res: Response) => {
    const user = new User(req.body) as userInstance;

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send({ error: 'Failed to save user.' });
    }
});

router.post('/user/login', async (req: userLogin, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByCredentials(email, password) as userInstance;
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(401).send({ error: 'Authentication failed.' });
    }
});

router.post('/user/logout', auth, async (req: userLogOut, res: Response) => {
    const { user, token } = req;

    try {
        if (user && user.tokens) {
            user.tokens = user.tokens.filter(t => t.token !== token);
            await user.save();
            res.send();
        } else {
            res.status(400).send({ error: "User ou tokens ne sont pas valides" });
        }
    } catch (e) {
        res.status(500).send({ error: 'Failed to log out.' });
    }
});

export default router;
