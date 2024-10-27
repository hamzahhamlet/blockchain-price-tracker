import { Module } from '@nestjs/common';
import { TokenTrackerScheduledJob } from './tokenTrackerSchedulesJob';
import { EmailAlertsDomain } from '../alerts/emailAlerts.domain';
import { NodemailerAdapter } from '../alerts/adapters/nodemailer.adapter';

@Module({
  providers: [
    TokenTrackerScheduledJob,
    {
      provide: EmailAlertsDomain,
      useClass: NodemailerAdapter,
    },
  ],
})
export class TokenTrackerModule {}
