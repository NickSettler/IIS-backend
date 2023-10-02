import { E_ROLE } from '../../db/entities/role.entity';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * Roles decorator
 * @param roles Array of roles
 */
export const Roles = (...roles: Array<E_ROLE>) => SetMetadata(ROLES_KEY, roles);
