import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizAnswersValidation {
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

    QuizAnswersValidation.validateInput(schema, filterInput);
  }

  validateQuizAnswerInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      quiz_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'quiz ID must be a valid UUID',
          'any.required': 'quiz ID is required',
        }),
      answers: Joi.array()
        .items(
          Joi.object({
            question_ID: Joi.string()
              .uuid({ version: ['uuidv4'] })
              .required()
              .messages({
                'string.guid': 'question ID must be a valid UUID',
                'any.required': 'question ID is required',
              }),
            answer_ID: Joi.string()
              .uuid({ version: ['uuidv4'] })
              .required()
              .messages({
                'string.guid': 'answer ID must be a valid UUID',
                'any.required': 'answer ID is required',
              }),
          }),
        )
        .required()
        .messages({
          'any.required': 'questions is required',
        }),
    });

    QuizAnswersValidation.validateInput(schema, insertInput);
  }

  validateQuizAnswerUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      quizAnswerUpdateInput: Joi.array()
        .items(
          Joi.object({
            answer_ID: Joi.string()
              .uuid({ version: ['uuidv4'] })
              .required()
              .messages({
                'string.guid': 'answer ID must be a valid UUID',
                'any.required': 'answer ID is required',
              }),
            grade: Joi.number().required().min(0).messages({
              'number.integer': 'grade must be an integer',
              'number.min': 'grade must be at least 0',
            }),
          }),
        )
        .required()
        .messages({
          'any.required': 'quizAnswerUpdateInput is required',
        }),
    });

    QuizAnswersValidation.validateInput(schema, updateInput);
  }
}
