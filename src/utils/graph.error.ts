import { GraphQLError } from 'graphql';

const status_code = {
  '404': 'NOT_FOUND',
  '500': 'INTERNAL_SERVER_ERROR',
  '400': 'BAD_REQUEST',
  '403': 'FORBIDDEN',
  '401': 'UNAUTHORIZED',
};
export type ErrorMessage = {
  [key: string]: {
    message: string;
    code: string | number;
  };
};

export function graphqlError(msg: string, code: string) {
  throw new GraphQLError(msg, {
    extensions: {
      code: code,
      status: status_code[code],
    },
  });
}

export function handleError(error: string, errorMessage: ErrorMessage) {
  if (error in errorMessage) {
    const { message, code } = errorMessage[error];
    graphqlError(message, code as string);
  } else {
    console.error(error);
    graphqlError('Something went wrong, Please try again', '500');
  }
}

export function handleRouteError(error: string, errorMessage: ErrorMessage) {
  if (error in errorMessage) {
    const { message, code } = errorMessage[error];
    return new RouteError(message, code as number);
  } else {
    console.error(error);
    return new RouteError('Something went wrong, Please try again', 500);
  }
}

class RouteError extends Error {
  public code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'RouteError';
    this.code = code;
    // Set the prototype explicitly.
    // As specified in the documentation in TypeScript
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, RouteError.prototype);
  }
}
