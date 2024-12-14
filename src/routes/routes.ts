import express from 'express';
import AuthRouter from './auth.router';

const Router = express.Router();

Router.use("/auth",AuthRouter)

export default Router;