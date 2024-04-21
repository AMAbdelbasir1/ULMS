import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacultyValidation {
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
      university_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'university ID must be a valid UUID',
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

    FacultyValidation.validateInput(schema, filterInput);
  }

  validateFacultyInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      university_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'university ID must be a valid UUID',
          'any.required': 'university ID is required',
        }),
      name: Joi.string().required().min(10).messages({
        'any.required': 'Name of Faculty is required',
        'string.empty': 'Name must not be empty',
        'string.min': 'Name must be at least 10 characters',
      }),
      levels: Joi.number().integer().required().min(1).messages({
        'any.required': 'levels of Faculty is required',
        'number.integer': 'levels must be an integer',
        'number.min': 'levels must be at least 1',
      }),
      logo: Joi.any().required().messages({
        'any.required': 'Logo of course is required',
      }),
    });

    FacultyValidation.validateInput(schema, insertInput);
  }

  validateFacultyUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      faculty_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'Faculty ID must be a valid UUID',
          'any.required': 'Faculty ID is required',
        }),
      university_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'university_ID ID must be a valid UUID',
        }),
      name: Joi.string().optional().min(10).messages({
        'string.empty': 'Name must not be empty',
        'string.min': 'Name must be at least 10 characters',
      }),
      levels: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'levels must be an integer',
        'number.min': 'levels must be at least 1',
      }),
      last_semester_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'semester ID must be a valid UUID',
        }),
      logo: Joi.any().optional(),
    });

    FacultyValidation.validateInput(schema, updateInput);
  }
}
