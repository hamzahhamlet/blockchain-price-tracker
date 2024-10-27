import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './alert.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('alerts')
@ApiTags('Alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  postCreateAlert(@Body() body: CreateAlertDto) {
    return this.alertsService.createAlert(body);
  }

  @Delete('/delete-all')
  deleteAllAlerts() {
    return this.alertsService.deleteAll();
  }
}
