import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseSemesterValidation {
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
      semester_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'semester ID must be a valid UUID',
        }),
      asInstructor: Joi.boolean().optional().messages({
        'any.boolean': 'asInstructor must be an boolean',
      }),
      isRunning: Joi.boolean().optional().messages({
        'any.boolean': 'isRunning must be an boolean',
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

    CourseSemesterValidation.validateInput(schema, filterInput);
  }

  validateCourseSemesterInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      courses_ID: Joi.array()
        .items(
          Joi.string().uuid({ version: 'uuidv4' }).required().messages({
            'any.required': 'courses IDs are required',
            'string.guid': 'course ID must be a valid UUID',
          }),
        )
        .required()
        .messages({
          'any.required': 'courses IDs are required',
          'array.includesRequiredUnknowns':
            'each course ID must be a valid UUID',
        }),
    });

    CourseSemesterValidation.validateInput(schema, insertInput);
  }

  validateCourseSemesterUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'cycle ID must be a valid UUID',
          'any.required': 'Course ID is required',
        }),
      course_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'Course ID must be a valid UUID',
        }),
    });

    CourseSemesterValidation.validateInput(schema, updateInput);
  }
}
