import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AlertEntity } from '../database/entities/alerts.entity';
import { TAlertSetup } from './types';

@Injectable()
export class AlertsService {
  private readonly alertsRepo: Repository<AlertEntity>;

  constructor(dataSource: DataSource) {
    this.alertsRepo = dataSource.getRepository(AlertEntity);
  }

  async createAlert(data: TAlertSetup): Promise<AlertEntity> {
    const alertDbObj = this.alertsRepo.create(data);
    return this.alertsRepo.save(alertDbObj);
  }

  async deleteAll() {
    this.alertsRepo.delete({});
  }
}
