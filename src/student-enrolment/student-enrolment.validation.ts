import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentEnrolmentValidation {
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

  validateGetStudentEnrolmentInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
    });

    StudentEnrolmentValidation.validateInput(schema, insertInput);
  }
  
  validateStudentEnrolmentInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      students_ID: Joi.array()
        .items(
          Joi.string().uuid({ version: 'uuidv4' }).required().messages({
            'any.required': 'courses IDs are required',
            'string.guid': 'course ID must be a valid UUID',
          }),
        )
        .required()
        .messages({
          'any.required': 'courses IDs are required',
          'array.includesRequiredUnknowns':
            'each course ID must be a valid UUID',
        }),
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
    });

    StudentEnrolmentValidation.validateInput(schema, insertInput);
  }

  validateDeleteStudentEnrolmentInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      student_ID: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
        'any.required': 'student IDs are required',
        'string.guid': 'student ID must be a valid UUID',
      }),
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
    });

    StudentEnrolmentValidation.validateInput(schema, insertInput);
  }
}
