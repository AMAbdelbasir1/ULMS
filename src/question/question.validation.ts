import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionValidation {
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
      quiz_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'quiz ID must be a valid UUID',
          'any.required': 'quiz ID ID is required',
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

    QuestionValidation.validateInput(schema, filterInput);
  }

  validateQuestionInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      quiz_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'quiz ID must be a valid UUID',
          'any.required': 'quiz ID is required',
        }),
      questions: Joi.array()
        .items(
          Joi.object({
            text: Joi.string().required().min(3).messages({
              'string.empty': 'question text must not be empty',
              'string.min': 'question text must be at least 3 characters',
            }),
            type: Joi.string().required().messages({
              'string.empty': 'type must not be empty',
            }),
            grade: Joi.number().integer().required().min(0).messages({
              'number.integer': 'grade must be an integer',
              'number.min': 'grade must be at least 0',
            }),
            answers: Joi.array()
              .items(
                Joi.object({
                  text: Joi.string().required().min(1).messages({
                    'string.empty': 'answer text must not be empty',
                    'string.min': 'answer text must be at least 3 characters',
                  }),
                  is_correct: Joi.boolean().required().messages({
                    'any.required': 'isCorrect must not be empty',
                  }),
                }),
              )
              .required()
              .messages({
                'any.required': 'answers is required',
              }),
          }),
        )
        .required()
        .messages({
          'any.required': 'questions is required',
        }),
    });

    QuestionValidation.validateInput(schema, insertInput);
  }

  validateQuestionUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      quiz_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'quiz ID must be a valid UUID',
          'any.required': 'quiz ID is required',
        }),
      text: Joi.string().optional().min(3).messages({
        'string.empty': 'title must not be empty',
        'string.min': 'title must be at least 3 characters',
      }),
      grade: Joi.number().integer().optional().min(0).messages({
        'number.integer': 'grade must be an integer',
        'number.min': 'grade must be at least 0',
      }),
    });

    QuestionValidation.validateInput(schema, updateInput);
  }

  validateAnswerUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      answer_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'answer ID must be a valid UUID',
          'any.required': 'answer ID is required',
        }),
      text: Joi.string().optional().min(3).messages({
        'string.empty': 'title must not be empty',
        'string.min': 'title must be at least 3 characters',
      }),
      is_correct: Joi.boolean().valid(true).optional().messages({
        'any.required': 'is_correct is required',
        'boolean.base': 'is_correct must be a boolean',
        'boolean.valid': 'is_correct must be true',
      }),
    });

    QuestionValidation.validateInput(schema, updateInput);
  }
}
