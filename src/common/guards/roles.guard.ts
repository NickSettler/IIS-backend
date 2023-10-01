import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { E_ROLE, E_ROLE_ENTITY_KEYS } from '../../db/entities/role.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../../db/entities/user.entity';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Array<E_ROLE>>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const user: User = context.switchToHttp().getRequest().user;

    return requiredRoles.some(
      (role) => user.roles?.some((r) => r[E_ROLE_ENTITY_KEYS.NAME] === role),
    );
  }
}
