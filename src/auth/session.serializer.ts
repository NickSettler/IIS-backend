import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  public serializeUser(
    user: any,
    done: (err: Error | null, user?: any) => void,
  ) {
    done(null, user);
  }

  public deserializeUser(
    user: any,
    done: (err: Error | null, user?: any) => void,
  ) {
    done(null, user);
  }
}
