import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { E_ROLE_ENTITY_KEYS } from '../../db/entities/role.entity';
import { E_USER_ENTITY_KEYS, User } from '../../db/entities/user.entity';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import {
  E_PERMISSION,
  E_PERMISSION_ENTITY_KEYS,
  Permission,
} from '../../db/entities/permission.entity';
import { map, reduce, unionBy } from 'lodash';

/**
 * Permissions guard
 *
 * Checks if user has required permissions to access a route
 */
@Injectable()
export default class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from route
    const requiredPermissions = this.reflector.getAllAndOverride<
      Array<E_PERMISSION>
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // If no permissions are required then user can access the route
    if (!requiredPermissions) {
      return true;
    }

    const user: User = context.switchToHttp().getRequest().user;

    const userPermissions: Array<E_PERMISSION> = map(
      reduce(
        user[E_USER_ENTITY_KEYS.ROLES],
        (acc: Array<Permission>, role) => {
          return unionBy(
            acc,
            role[E_ROLE_ENTITY_KEYS.PERMISSIONS],
            E_PERMISSION_ENTITY_KEYS.NAME,
          );
        },
        [],
      ),
      (p: Permission) => p[E_PERMISSION_ENTITY_KEYS.NAME] as E_PERMISSION,
    );

    // If user has some of required permissions then the user can access the route
    return requiredPermissions.some((permissions) =>
      userPermissions.includes(permissions),
    );
  }
}
