import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { AuthController } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../validations/auth.validation';

export const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', validate(registerSchema), authController.register.bind(authController));
authRouter.post('/login', validate(loginSchema), authController.login.bind(authController));