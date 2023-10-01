import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  Role,
} from '../../db/entities/role.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { E_USER_ENTITY_KEYS, User } from '../../db/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

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
