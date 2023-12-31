import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../db/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Role } from '../db/entities/role.entity';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), CaslModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
