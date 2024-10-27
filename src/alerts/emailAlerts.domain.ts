import { Injectable } from '@nestjs/common';
import { TAlert } from './types';

@Injectable()
export abstract class EmailAlertsDomain {
  abstract alertAdmin(data: TAlert[]): Promise<null>;

  abstract alertUser(data: Array<{ email: string } & TAlert>): Promise<null>;
}
