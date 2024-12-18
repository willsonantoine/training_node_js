import dotenv from 'dotenv';

dotenv.config();
export const SERVER_PORT=process.env.SERVER_PORT || 4000 ;
export const JWT_SECRET=process.env.JWT_SECRET || 'secret';
export const NODE_ENV=process.env.NODE_ENV || 'dev';
