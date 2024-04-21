import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseValidation {
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
      faculty_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'faculty ID must be a valid UUID',
        }),
      page: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'page must be an integer',
        'number.min': 'page must be at least 1',
      }),
      limit: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'limit must be an integer',
        'number.min': 'limit must be at least 1',
      }),
    });

    CourseValidation.validateInput(schema, filterInput);
  }

  validateCourseInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      // faculty_ID: Joi.string()
      //   .uuid({ version: ['uuidv4'] })
      //   .required()
      //   .messages({
      //     'string.guid': 'faculty ID must be a valid UUID',
      //     'any.required': 'faculty ID is required',
      //   }),
      name: Joi.string().required().min(10).messages({
        'any.required': 'Name of course is required',
        'string.empty': 'Name must not be empty',
        'string.min': 'Name must be at least 10 characters',
      }),
      hours: Joi.number().integer().required().min(1).messages({
        'any.required': 'Hours of course is required',
        'number.integer': 'Hours must be an integer',
        'number.min': 'Hours must be at least 1',
      }),
      image: Joi.any().required().messages({
        'any.required': 'image of course is required',
      }),
    });

    CourseValidation.validateInput(schema, insertInput);
  }

  validateCourseUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      course_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'Course ID must be a valid UUID',
          'any.required': 'Course ID is required',
        }),
      // faculty_ID: Joi.string()
      //   .uuid({ version: ['uuidv4'] })
      //   .optional()
      //   .messages({
      //     'string.guid': 'Faculty ID must be a valid UUID',
      //   }),
      name: Joi.string().optional().min(10).messages({
        'string.empty': 'Name must not be empty',
        'string.min': 'Name must be at least 10 characters',
      }),
      hours: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'Hours must be an integer',
        'number.min': 'Hours must be at least 1',
      }),
      image: Joi.any().optional(),
    });

    CourseValidation.validateInput(schema, updateInput);
  }
}
