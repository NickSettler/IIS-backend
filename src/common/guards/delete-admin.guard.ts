import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { E_ROLE, E_ROLE_ENTITY_KEYS } from '../../db/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { E_USER_ENTITY_KEYS, User } from '../../db/entities/user.entity';
import { Repository } from 'typeorm';

type TDeleteAdminGuardParams = {
  id: string;
  roleName?: E_ROLE;
};

@Injectable()
export default class DeleteAdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const params = context
      .switchToHttp()
      .getRequest<Request<TDeleteAdminGuardParams>>().params;

    const admins = await this.usersRepository.find({
      where: {
        [E_USER_ENTITY_KEYS.ROLES]: {
          [E_ROLE_ENTITY_KEYS.NAME]: E_ROLE.ADMIN,
        },
      },
    });

    if (admins.length > 1) return true;

    const admin = admins[0];

    if (
      admin[E_USER_ENTITY_KEYS.ID] !== params.id ||
      (admin[E_USER_ENTITY_KEYS.ID] === params.id &&
        !!params.roleName &&
        params.roleName !== E_ROLE.ADMIN)
    )
      return true;

    throw new UnprocessableEntityException("Can't delete last admin");
  }
}
