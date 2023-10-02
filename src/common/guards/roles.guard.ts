import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { E_ROLE, E_ROLE_ENTITY_KEYS } from '../../db/entities/role.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../../db/entities/user.entity';

/**
 * Roles guard
 *
 * Checks if user has required roles to access a route
 */
@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required roles from route
    const requiredRoles = this.reflector.getAllAndOverride<Array<E_ROLE>>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required then user can access the route
    if (!requiredRoles) {
      return true;
    }

    const user: User = context.switchToHttp().getRequest().user;

    // If user has some of required roles then the user can access the route
    return requiredRoles.some(
      (role) => user.roles?.some((r) => r[E_ROLE_ENTITY_KEYS.NAME] === role),
    );
  }
}
