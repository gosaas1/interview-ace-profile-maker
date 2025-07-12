import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        message: 'Validation failed',
        errors,
      });
      return;
    }

    next();
  };
};

// Validation schemas
export const schemas = {
  auth: {
    register: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      full_name: Joi.string().required(),
      role: Joi.string().valid('job_seeker', 'employer').required(),
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  cv: {
    create: Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      is_public: Joi.boolean().default(false),
    }),
    update: Joi.object({
      title: Joi.string(),
      content: Joi.string(),
      is_public: Joi.boolean(),
    }),
  },
  interview: {
    answer: Joi.object({
      question_id: Joi.string().required(),
      answer: Joi.string().required(),
      ai_feedback: Joi.string(),
    }),
    updateAnswer: Joi.object({
      answer: Joi.string().required(),
      ai_feedback: Joi.string(),
    }),
  },
  job: {
    create: Joi.object({
      title: Joi.string().required(),
      company: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      salary_range: Joi.string().required(),
      requirements: Joi.array().items(Joi.string()).required(),
    }),
    update: Joi.object({
      title: Joi.string(),
      company: Joi.string(),
      description: Joi.string(),
      location: Joi.string(),
      salary_range: Joi.string(),
      requirements: Joi.array().items(Joi.string()),
    }),
    apply: Joi.object({
      cv_id: Joi.string().required(),
      cover_letter: Joi.string().required(),
    }),
  },
}; 