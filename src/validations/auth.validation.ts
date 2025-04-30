import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(30),
  firstName: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  bio: Joi.string().allow('', null)
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});