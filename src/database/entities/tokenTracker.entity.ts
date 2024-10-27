import { Entity, Column, CreateDateColumn, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token_tracking')
export class TokenTrackerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  tokenName: string;

  @Column({ type: 'decimal' })
  usdPrice: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
