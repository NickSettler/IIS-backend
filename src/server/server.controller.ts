import { Controller, Get } from '@nestjs/common';
import * as process from 'process';
import axios from 'axios';

const restartRequestUrl = process.env.RESTART_REQUEST_URL;

@Controller('server')
export class ServerController {
  @Get('restart')
  public async restart() {
    await axios.get(restartRequestUrl).catch(() => {
      return {
        status: 500,
        message: 'Server restart is not available',
      };
    });

    return {
      status: 200,
      message: 'Server restart request has been sent',
    };
  }
}
