import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskAnswerValidation {
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

  validateStudentFilterInput<T>(filterInput?: T): void {
    const schema = Joi.object({
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
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

    TaskAnswerValidation.validateInput(schema, filterInput);
  }

  validateFilterInput<T>(filterInput?: T): void {
    const schema = Joi.object({
      task_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'task ID must be a valid UUID',
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

    TaskAnswerValidation.validateInput(schema, filterInput);
  }

  validateTaskAnswerInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      task_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'task ID must be a valid UUID',
          'any.required': 'task ID ID is required',
        }),
      file: Joi.any().required().messages({
        'any.required': 'file of task is required',
      }),
    });

    TaskAnswerValidation.validateInput(schema, insertInput);
  }

  validateTaskAnswerUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      answer_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'task answer ID must be a valid UUID',
          'any.required': 'task answer ID is required',
        }),
      grade: Joi.number().integer().optional().min(0).messages({
        'number.integer': 'grade must be an integer',
        'number.min': 'grade must be at least 0',
      }),
    });

    TaskAnswerValidation.validateInput(schema, updateInput);
  }
}
