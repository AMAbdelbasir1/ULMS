import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import * as Joi from 'joi';
import { LoginInput } from './auth.input';

@Injectable()
export class AuthValidation {
  private static validateInput(
    schema: Joi.ObjectSchema<any>,
    input: any,
  ): void {
    const { error } = schema.validate(input, { abortEarly: false });

    if (error) {
      throw new GraphQLError('Error data validation', {
        extensions: {
          code: '400',
          status: 'BAD_REQUEST',
          messages: error.details.map((detail) => detail.message),
        },
      });
    }
  }

  validateLoginInput(loginInput: LoginInput): void {
    const schema = Joi.object({
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
    });

    AuthValidation.validateInput(schema, loginInput);
  }
}
