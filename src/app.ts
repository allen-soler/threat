import express, { Request, Response } from 'express';
import path from 'path';
import userRouter from './routers/user';
import threatRouter from './routers/threats';
import './db/mongoose';

const httpsRedirect = require('express-https-redirect');
const cors = require('cors');

const app = express();

//app.use('/', httpsRedirect());
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(threatRouter);

// If you still want the dashboard routes, you can keep this
// Dashboard Router (create a separate router for dashboard routes)


export default app;
