import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DepartmentValidation {
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
          messages: [error.details.map((detail) => detail.message)],
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

    DepartmentValidation.validateInput(schema, filterInput);
  }

  validateDepartmentInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      name: Joi.string().required().min(2).messages({
        'any.required': 'Name of course is required',
        'string.empty': 'Name must not be empty',
        'string.min': 'Name must be at least 2 characters',
      }),
    });

    DepartmentValidation.validateInput(schema, insertInput);
  }

  validateDepartmentUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      department_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'Department ID must be a valid UUID',
          'any.required': 'Department ID is required',
        }),
      name: Joi.string().optional().min(2).messages({
        'string.empty': 'Name must not be empty',
        'string.min': 'Name must be at least 2 characters',
      }),
    });

    DepartmentValidation.validateInput(schema, updateInput);
  }
}
