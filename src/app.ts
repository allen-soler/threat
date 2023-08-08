import express, { Request, Response } from 'express';
import path from 'path';
import userRouter from './routers/user';
import threatRouter from './routers/threats';
import './db/mongoose';

const httpsRedirect = require('express-https-redirect');
const subdomain = require('express-subdomain');
const cors = require('cors');

const app = express();

//app.use('/', httpsRedirect());
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(threatRouter);

// Dashboard Router (create a separate router for dashboard routes)
const dashboardRouter = express.Router();
dashboardRouter.get('/', (req: Request, res: Response) => {
    console.log("Dashboard route accessed");

    res.send('Dashboard Home Page');
});

// Using subdomain middleware
app.use(subdomain('dashboard', dashboardRouter));

// Move the static middleware below the dashboard subdomain middleware
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

export default app;
