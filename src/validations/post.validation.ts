import Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string().required().min(1).max(2000).messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 1 character',
    'string.max': 'Content cannot exceed 2000 characters',
  })
});