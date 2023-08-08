import { Request, Response } from 'express'
import Threat from "../models/threat"
import express from 'express'
import auth from '../middleware/auth'
import { IUser } from '../middleware/auth'

interface AuthenticatedRequest extends Request {
    user?: IUser
}

const router = express.Router()

router.post('/threats', auth, async (req: AuthenticatedRequest, res: Response) => {
    const threat = new Threat({
        ...req.body,
        owner: req.user?._id
    })

    try {
        await threat.save()
        res.status(201).send(threat)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/threats', async (req: Request, res: Response) => {
    try {
        const threats = await Threat.find();
        res.send(threats)
    } catch (e) {
        res.status(500).send()
    }
})

export default router