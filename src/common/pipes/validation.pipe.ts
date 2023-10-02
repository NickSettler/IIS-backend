import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  private static toValidate(metatype: unknown) {
    const types: Array<unknown> = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  public async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !ValidationPipe.toValidate(metatype)) return value;

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((error) => error.constraints),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return value;
  }
}
