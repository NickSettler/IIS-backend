import { SetMetadata } from '@nestjs/common';
import { E_PERMISSION } from '../../db/entities/permission.entity';

export const PERMISSIONS_KEY = 'permission';
/**
 * Permissions decorator
 * @param roles Array of permissions
 */
export const Permissions = (...roles: Array<E_PERMISSION>) =>
  SetMetadata(PERMISSIONS_KEY, roles);
