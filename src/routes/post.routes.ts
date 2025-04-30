import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createPostSchema } from '../validations/post.validation';

export const postRouter = Router();
const postController = new PostController();

postRouter.post('/', authMiddleware, validate(createPostSchema), postController.createPost.bind(postController));
postRouter.get('/', postController.getAllPosts.bind(postController));
postRouter.get('/user/:userId', postController.getPostsByUser.bind(postController));
postRouter.get('/hashtag/:hashtag', postController.getPostsByHashtag.bind(postController));
postRouter.post('/:id/like', authMiddleware, postController.likePost.bind(postController));
postRouter.post('/:id/unlike', authMiddleware, postController.unlikePost.bind(postController));