import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorator/role.decorator';
import { graphqlError } from '../../utils/graph.error';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get array of roles from metadata in request
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    // get user information from request
    const { user } = context.getArgs()[2].req;
    if (!requiredRoles.some((role) => user.roles?.includes(role))) {
      graphqlError('can not access this root', '401');
    }
    return true;
  }
}

@Injectable()
export class RolesRouteGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get array of roles from metadata in request
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    // get user information from request
    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.some((role) => user.roles?.includes(role))) {
      throw new UnauthorizedException('Can not access this root');
    }
    return true;
  }
}
