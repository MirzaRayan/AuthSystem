import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


import UserRouter from './src/routes/user.routes.js'

app.use('/api/user',UserRouter);


export default app;