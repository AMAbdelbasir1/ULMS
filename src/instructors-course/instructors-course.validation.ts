import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InstructorsCourseValidation {
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

  validateGetInstructorsCourseInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
    });

    InstructorsCourseValidation.validateInput(schema, insertInput);
  }

  validateInstructorsCourseInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      instructors_ID: Joi.array()
        .items(
          Joi.string().uuid({ version: 'uuidv4' }).required().messages({
            'any.required': 'instructor IDs are required',
            'string.guid': 'instructor ID must be a valid UUID',
          }),
        )
        .required()
        .messages({
          'any.required': 'instructors ID are required',
        }),
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
    });

    InstructorsCourseValidation.validateInput(schema, insertInput);
  }

  validateDeleteInstructorCourseInput<T>(insertInput?: T): void {
    const schema = Joi.object({
      instructor_ID: Joi.string()
        .uuid({ version: 'uuidv4' })
        .required()
        .messages({
          'any.required': 'instructor ID are required',
          'string.guid': 'instructor ID must be a valid UUID',
        }),
      course_cycle_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'course cycle ID must be a valid UUID',
          'any.required': 'course cycle ID ID is required',
        }),
    });

    InstructorsCourseValidation.validateInput(schema, insertInput);
  }
}
