import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { EmailAlertsDomain } from '../emailAlerts.domain';
import { ConfigService } from '@nestjs/config';
import { TAlert } from '../types';

@Injectable()
export class NodemailerAdapter implements EmailAlertsDomain {
  private readonly mailService: ReturnType<typeof createTransport>;
  private static ADMIN_EMAIL: string;

  constructor(configService: ConfigService) {
    NodemailerAdapter.ADMIN_EMAIL = configService.get<string>('ADMIN_EMAIL');
    this.mailService = createTransport({
      host: configService.get<string>('EMAIL_HOST'),
      port: configService.get<number>('EMAIL_PORT'),
      secure: true,
      auth: {
        user: configService.get<string>('EMAIL_USERNAME'),
        pass: configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async alertAdmin(data: TAlert[]): Promise<null> {
    try {
      await this.mailService.sendMail({
        to: NodemailerAdapter.ADMIN_EMAIL,
        subject: 'Crypto change alert to Admin',
        html: `<body>${JSON.stringify(data, null, 2)}</body>`,
      });

      return null;
    } catch (e) {
      throw e;
    }
  }

  async alertUser(data: Array<{ email: string } & TAlert>): Promise<null> {
    try {
      const promises = data.map(({ email, currentPriceInUsd, priceDiffInUsd, tokenName }) => {
        this.mailService.sendMail({
          to: email,
          subject: 'Crypto change alert to user',
          html: `<body>${JSON.stringify(
            {
              currentPriceInUsd,
              priceDiffInUsd,
              tokenName,
            },
            null,
            2
          )}</body>`,
        });
      });

      await Promise.all(promises);

      return null;
    } catch (e) {
      throw e;
    }
  }
}
