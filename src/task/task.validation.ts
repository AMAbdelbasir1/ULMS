import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskValidation {
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
      instructor_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'instructor ID must be a valid UUID',
        }),
    });

    TaskValidation.validateInput(schema, filterInput);
  }

  validateTaskInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
      title: Joi.string().required().min(3).messages({
        'any.required': 'title of task is required',
        'string.empty': 'title must not be empty',
        'string.min': 'title must be at least 3 characters',
      }),
      grade: Joi.number().integer().required().min(0).messages({
        'any.required': 'grade of task is required',
        'number.integer': 'grade must be an integer',
        'number.min': 'grade must be at least 0',
      }),
      start_Date: Joi.date().required().messages({
        'any.required': 'start date of task is required',
      }),
      end_Date: Joi.date().min(Joi.ref('start_Date')).required().messages({
        'any.required': 'end date of task is required',
        'date.min': 'End date must be greater than or equal to start date',
        'date.base': 'Start date must be a valid date',
      }),
      file: Joi.any().required().messages({
        'any.required': 'file of task is required',
      }),
    });

    TaskValidation.validateInput(schema, insertInput);
  }

  validateTaskUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      //  add task validation
      task_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'task ID must be a valid UUID',
          'any.required': 'task ID is required',
        }),
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
      title: Joi.string().optional().min(3).messages({
        'string.empty': 'title must not be empty',
        'string.min': 'title must be at least 3 characters',
      }),
      start_Date: Joi.date().optional().messages({
        'date.base': 'start date must be a valid date',
      }),
      end_Date: Joi.date().optional().messages({
        'date.base': 'end date must be a valid date',
      }),
      grade: Joi.number().integer().optional().min(0).messages({
        'number.integer': 'grade must be an integer',
        'number.min': 'grade must be at least 0',
      }),
      file: Joi.any().optional().messages({
        'any.required': 'file of task is required',
      }),
    });

    TaskValidation.validateInput(schema, updateInput);
  }
}
