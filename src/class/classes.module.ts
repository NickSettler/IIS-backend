import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from '../db/entities/class.entity';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  providers: [ClassesService],
  controllers: [ClassesController],
  exports: [ClassesService],
})
export class ClassesModule {}
