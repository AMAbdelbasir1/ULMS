import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LectureValidation {
  private static validateInput<T>(
    schema: Joi.ObjectSchema<T>,
    input?: T,
  ): void {
    const { error } = schema.validate(input, { abortEarly: false });

    if (error) {
      throw new GraphQLError('Error data valdation', {
        extensions: {
          code: '400',
          status: 'BAD_REQUEST',
          messages: error.details.map((detail) => detail.message),
        },
      });
    }
  }

  validateFilterInput<T>(filterInput?: T): void {
    const schema = Joi.object({
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
      page: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'page must be an integer',
        'number.min': 'page must be at least 1',
      }),
      limit: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'limit must be an integer',
        'number.min': 'limit must be at least 1',
      }),
      type: Joi.string().optional().min(3).valid('Lecture', 'Lab').messages({
        'string.empty': 'Type must not be empty',
        'string.min': 'Type must be at least 3 characters',
        'any.only': 'Type must be Lecture or Lab',
      }),
      instructor_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'instructor ID must be a valid UUID',
        }),
    });

    LectureValidation.validateInput(schema, filterInput);
  }

  validateLectureInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
      title: Joi.string().required().min(3).messages({
        'any.required': 'title of course is required',
        'string.empty': 'title must not be empty',
        'string.min': 'title must be at least 3 characters',
      }),
      type: Joi.string().required().min(3).valid('Lecture', 'Lab').messages({
        'any.required': 'Type of course is required',
        'string.empty': 'Type must not be empty',
        'string.min': 'Type must be at least 10 characters',
        'any.only': 'Type must be Lecture or Lab',
      }),
    });

    LectureValidation.validateInput(schema, insertInput);
  }

  validateLectureUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      lecture_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'Lecture ID must be a valid UUID',
          'any.required': 'Lecture ID is required',
        }),
      title: Joi.string().optional().min(3).messages({
        'string.empty': 'title must not be empty',
        'string.min': 'title must be at least 3 characters',
      }),
      type: Joi.string().optional().min(3).valid('Lecture', 'Lab').messages({
        'string.empty': 'Type must not be empty',
        'string.min': 'Type must be at least 3 characters',
        'any.only': 'Type must be Lecture or Lab',
      }),
    });

    LectureValidation.validateInput(schema, updateInput);
  }
}
