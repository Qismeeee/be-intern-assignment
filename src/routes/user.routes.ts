import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const userRouter = Router();
const userController = new UserController();

userRouter.get('/', userController.getAllUsers.bind(userController));
userRouter.get('/:id', userController.getUserById.bind(userController));
userRouter.post('/', validate(createUserSchema), userController.createUser.bind(userController));
userRouter.put('/:id', validate(updateUserSchema), userController.updateUser.bind(userController));
userRouter.delete('/:id', userController.deleteUser.bind(userController));
userRouter.post('/:id/follow', authMiddleware, userController.followUser.bind(userController));
userRouter.post('/:id/unfollow', authMiddleware, userController.unfollowUser.bind(userController));