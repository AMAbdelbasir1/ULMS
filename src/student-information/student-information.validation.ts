import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentInformationValidation {
  private static validateInput<T>(
    schema: Joi.ObjectSchema<T>,
    input?: T,
  ): void {
    const { error } = schema.validate(input, { abortEarly: false });

    if (error) {
      throw new GraphQLError(
        error.details.map((detail) => detail.message).join(', '),
        {
          extensions: {
            code: '400',
            status: 'BAD_REQUEST',
          },
        },
      );
    }
  }

  validateStudentInformationValidationInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      academic_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'academic ID must be a valid UUID',
          'any.required': 'academic ID is required',
        }),
      user_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'user ID must be a valid UUID',
          'any.required': 'user ID is required',
        }),
      department_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'department ID must be a valid UUID',
          'any.required': 'department ID is required',
        }),
      level: Joi.number().integer().required().min(1).messages({
        'any.required': 'level of Faculty is required',
        'number.integer': 'level must be an integer',
        'number.min': 'level must be at least 1',
      }),
    });

    StudentInformationValidation.validateInput(schema, insertInput);
  }

  validateStudentInformationUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      user_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'user ID must be a valid UUID',
          'any.required': 'user ID is required',
        }),
      academic_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'academic ID must be a valid UUID',
        }),
      department_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'department ID must be a valid UUID',
        }),
      level: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'level must be an integer',
        'number.min': 'level must be at least 1',
      }),
    });

    StudentInformationValidation.validateInput(schema, updateInput);
  }
}
