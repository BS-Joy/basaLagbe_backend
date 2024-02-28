import express from 'express';
import { createUser, getAllUser, login } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.post('/login', login);
userRouter.get('/', getAllUser);

export default userRouter;