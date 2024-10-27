import { ETokenName } from '../../blockchain/types';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('alerts')
export class AlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  tokenName: ETokenName;

  @Column({ type: 'decimal' })
  dollarChange: number;

  @Column({ type: 'varchar' })
  email: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
