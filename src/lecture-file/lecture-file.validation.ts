import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LectureFileValidation {
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
      lecture_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'Lecture ID must be a valid UUID',
          'any.required': 'Lecture ID is required',
        }),
      instructor_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .optional()
        .messages({
          'string.guid': 'instructor ID must be a valid UUID',
        }),
    });

    LectureFileValidation.validateInput(schema, filterInput);
  }

  validateLectureFileInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      lecture_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'Lecture ID must be a valid UUID',
          'any.required': 'Lecture ID is required',
        }),
      files: Joi.array().required().messages({
        'any.required': 'files of course is required',
      }),
    });

    LectureFileValidation.validateInput(schema, insertInput);
  }

  validateLectureFileUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      lecture_file_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'Lecture ID must be a valid UUID',
          'any.required': 'Lecture ID is required',
        }),
      name: Joi.string().required().min(3).messages({
        'any.required': 'name of file is required',
        'string.empty': 'name must not be empty',
        'string.min': 'name must be at least 3 characters',
      }),
    });

    LectureFileValidation.validateInput(schema, updateInput);
  }

  validateLectureFileDeleteInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      lecture_file_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'Lecture ID must be a valid UUID',
          'any.required': 'Lecture ID is required',
        }),
    });

    LectureFileValidation.validateInput(schema, updateInput);
  }
}
