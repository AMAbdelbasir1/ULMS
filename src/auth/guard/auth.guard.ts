import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import { getOneUserWithRoleQuery } from '../../database/queries/user.query';
import { graphqlError } from '../../utils/graph.error';

@Injectable()
export class AuthGuard implements CanActivate {
  private Logger = new Logger('auth-guard');
  constructor(
    private jwtService: JwtService,
    private readonly conn: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get token from header request
    const ctx = context.getArgs()[2];
    const token = this.extractTokenFromHeader(ctx.req);
    if (!token) {
      // throw new UnauthorizedException('please login and try again');
      graphqlError('please login and try again', '403');
    }

    try {
      // check validate token and get payload
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      // console.log(payload);
      // check this account found in database  and throw error if not found may be the account deleted
      const user = await this.conn.query(getOneUserWithRoleQuery(payload.id));
      if (user.recordset.length == 0) {
        throw 'NOT_VALID_USER';
      }
      // console.log(user.recordsets);
      ctx.req.user = ctx.req.user = {
        user_ID: user.recordset[0].user_ID,
        Faculty_ID: user.recordset[0].Faculty_ID,
        roles: user.recordset.map((record) => record.roles),
      };
    } catch (error) {
      // catch error if invaild token or not found user account
      if (
        error.name == 'TokenExpiredError' ||
        error.name == 'JsonWebTokenError' ||
        error.name == 'NotFoundException'
      ) {
        graphqlError('token expired or inValid', '403');
      }

      if (error == 'NOT_VALID_USER') {
        graphqlError('Please login and try again', '403');
      }

      // logging if unexpected error
      this.Logger.error(
        ` when user access by ${token} with data${JSON.stringify(ctx.user)} `,
        error.stack,
      );
      // console.log(error);

      graphqlError('Something went wrong, Please try again', '500');
    }
    return true;
  }
  // extract token from request
  private extractTokenFromHeader(request: any): string | undefined {
    if (request?.headers.authorization) {
      const [type, token] = request.headers.authorization.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}

@Injectable()
export class AuthRouteGuard implements CanActivate {
  private Logger = new Logger('auth-guard');
  constructor(
    private jwtService: JwtService,
    private readonly conn: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get token from header request
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException('please login and try again');
    }

    try {
      // check validate token and get payload
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      // console.log(payload);
      // check this account found in database  and throw error if not found may be the account deleted
      const user = await this.conn.query(getOneUserWithRoleQuery(payload.id));
      if (user.recordset.length == 0) {
        throw new ForbiddenException('please login and try again');
      }
      // console.log(user.recordsets);
      request.user = request.user = {
        user_ID: user.recordset[0].user_ID,
        Faculty_ID: user.recordset[0].Faculty_ID,
        roles: user.recordset.map((record) => record.roles),
      };
    } catch (error) {
      // catch error if invaild token or not found user account
      if (
        error.name == 'TokenExpiredError' ||
        error.name == 'JsonWebTokenError' ||
        error.name == 'NotFoundException'
      ) {
        throw new ForbiddenException('token expired or inValid');
      }
      // logging if unexpected error
      this.Logger.error(
        ` when user access by ${token} with data${JSON.stringify(
          request.user,
        )} `,
        error.stack,
      );
      // console.log(error);

      graphqlError('Something went wrong, Please try again', '500');
    }
    return true;
  }
  // extract token from request
  private extractTokenFromHeader(request: any): string | undefined {
    if (request?.headers.authorization) {
      const [type, token] = request.headers.authorization.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}
