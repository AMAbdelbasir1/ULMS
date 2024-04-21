import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import * as Joi from 'joi';
import { CreateUserInput } from './user.input';

@Injectable()
export class UserValidation {
  private static validateInput(
    schema: Joi.ObjectSchema<any>,
    input: any,
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

  validateUserFilterInput<T>(input?: T): void {
    const schema = Joi.object({
      university_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'University ID must be a valid UUID',
        }),
      faculty_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'Faculty ID must be a valid UUID',
        }),
      department_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'Department ID must be a valid UUID',
        }),
      role: Joi.string().optional(),
      level: Joi.number().integer().optional().min(0).messages({
        'number.integer': 'Level must be an integer',
        'number.min': 'Level must be at least 0',
      }),
      page: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1',
      }),
      limit: Joi.number().integer().optional().min(1).messages({
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
      }),
    });

    UserValidation.validateInput(schema, input);
  }

  validateCreateUserInput(input: CreateUserInput): void {
    const schema = Joi.object({
      full_name: Joi.string().required().min(5).messages({
        'any.required': 'Full name is required',
        'string.empty': 'Full name must not be empty',
      }),
      email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address',
      }),
      password: Joi.string()
        .pattern(
          new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
          ),
        )
        .required()
        .messages({
          'any.required': 'Password is required',
          'string.empty': 'Password must not be empty',
          'string.pattern.base':
            'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long',
        }),
      phone: Joi.string().required().min(11).max(11).messages({
        'any.required': 'Phone number is required',
        'string.empty': 'Phone number must not be empty',
      }),
      Faculty_ID: Joi.string()
        .optional()
        .allow(null)
        .uuid({ version: 'uuidv4' })
        .messages({
          'string.guid': 'Faculty ID must be a valid UUID',
        }),
      role_ID: Joi.string().required().uuid({ version: 'uuidv4' }).messages({
        'any.required': 'Role ID is required',
        'string.guid': 'Role ID must be a valid UUID',
      }),
      academic_ID: Joi.string().optional().empty().messages({
        'string.guid': 'Academic ID must be a valid UUID',
        'string.empty': 'Academic ID is not allowed to be empty ',
      }),
      department_ID: Joi.string()
        .optional()
        .empty()
        .uuid({ version: 'uuidv4' })
        .messages({
          'string.guid': 'Department ID must be a valid UUID',
          'string.empty': 'Department ID is not allowed to be empty ',
        }),
      level: Joi.number().optional().allow(null).integer().min(1).messages({
        'number.integer': 'Level must be an integer',
        'number.min': 'Level must be at least 0',
      }),
    });

    UserValidation.validateInput(schema, input);
  }

  validateUpdateUserInput<T>(input?: T): void {
    const schema = Joi.object({
      user_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'User ID must be a valid UUID',
          'any.required': 'User ID is required',
        }),
      full_name: Joi.string().optional().empty().min(10).messages({
        'string.min': 'Full name must be at least 10 characters long',
      }),
      email: Joi.string().email().optional().label('Email'),
      password: Joi.string()
        .optional()
        .pattern(
          new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
          ),
        )
        .messages({
          'string.empty': 'Password must not be empty',
          'string.pattern.base':
            'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long',
        }),
      phone: Joi.string().optional(),
      Faculty_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'Faculty ID must be a valid UUID',
        }),
      role_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'Role ID must be a valid UUID',
        }),
      academic_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'Academic ID must be a valid UUID',
        }),
      department_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'Department ID must be a valid UUID',
        }),
      level: Joi.number().integer().optional().min(0).messages({
        'number.integer': 'Level must be an integer',
        'number.min': 'Level must be at least 0',
      }),
      image_path: Joi.any().optional(),
    });

    UserValidation.validateInput(schema, input);
  }
}
