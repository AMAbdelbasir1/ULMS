import * as Joi from 'joi';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UniversityValidation {
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
          messages: [error.details.map((detail) => detail.message)],
        },
      });
    }
  }

  validateUniversityUpdateInput<T>(updateInput?: T): void {
    const schema = Joi.object({
      university_ID: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .messages({
          'string.guid': 'university ID must be a valid UUID',
          'any.required': 'university ID is required',
        }),
      name: Joi.string().optional().min(10).messages({
        'string.empty': 'Name must not be empty',
        'string.min': 'Name must be at least 10 characters',
      }),
      logo: Joi.any().optional(),
    });

    UniversityValidation.validateInput(schema, updateInput);
  }
}
