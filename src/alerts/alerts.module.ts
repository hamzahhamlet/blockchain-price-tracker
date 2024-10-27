import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { EmailAlertsDomain } from './emailAlerts.domain';
import { NodemailerAdapter } from './adapters/nodemailer.adapter';

@Module({
  controllers: [AlertsController],
  providers: [
    AlertsService,
    {
      provide: EmailAlertsDomain,
      useClass: NodemailerAdapter,
    },
  ],
})
export class AlertsModule {}
