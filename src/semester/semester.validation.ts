import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SemesterValidation {
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
      years: Joi.string().optional().empty().messages({
        'any.empty': 'Years must me not empty',
        'string.base': 'Year must be like this 2023 or 2023-2024',
      }),
      number: Joi.number().integer().optional().min(1).max(3).messages({
        'number.integer': "semester's number must be an integer",
        'number.min': "semester's number must be at least 1",
        'number.max': "semester's number must be at least 1",
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

    SemesterValidation.validateInput(schema, filterInput);
  }

  validateSemesterInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      start_date: Joi.date().iso().required().messages({
        'date.base': 'Start date must be a valid date',
        'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
        'any.required': 'Start date is required',
      }),
      end_date: Joi.date()
        .iso()
        .min(Joi.ref('start_date'))
        .required()
        .messages({
          'date.base': 'End date must be a valid date',
          'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
          'date.min': 'End date must be greater than or equal to start date',
          'any.required': 'End date is required',
        }),
      years: Joi.string().min(4).required().messages({
        'number.min': 'years must be greater than or equal to 4',
        'any.required': "semseter's number is required",
      }),
      number: Joi.number().integer().min(1).max(3).required().messages({
        'number.min': 'must be greater than or equal to 1',
        'number.max': "semseter's number must be less than or equal to 3",
        'any.required': "semseter's number is required",
      }),
    });

    SemesterValidation.validateInput(schema, insertInput);
  }

  validateSemesterUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      semester_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'semester ID must be a valid UUID',
          'any.required': 'semester ID is required',
        }),
      faculty_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'faculty ID must be a valid UUID',
          'any.required': 'faculty ID is required',
        }),
      start_date: Joi.date().iso().optional().messages({
        'date.base': 'Start date must be a valid date',
        'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
      }),
      end_date: Joi.date().iso().optional().messages({
        'date.base': 'End date must be a valid date',
        'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
      }),
      years: Joi.string().min(4).optional().messages({
        'number.min': 'years must be greater than or equal to 4',
        'any.required': "semseter's number is required",
      }),
      number: Joi.number().integer().min(1).max(3).optional().messages({
        'number.min': 'must be greater than or equal to 1',
        'number.max': "semseter's number must be less than or equal to 3",
        'any.required': "semseter's number is required",
      }),
    });

    SemesterValidation.validateInput(schema, updateInput);
  }
}
