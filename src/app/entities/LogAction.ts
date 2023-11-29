import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('log_action')
export default class LogAction {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { name: 'target_id', nullable: true })
  targetId: string;

  @Column('varchar', { name: 'description', nullable: true })
  description: string;

  @Column('text', { name: 'action_data', nullable: true })
  actionData: string;

  @Column('varchar', { name: 'request_url', nullable: true })
  requestURL: string;

  @Column('text', { name: 'request_params', nullable: true })
  requestParams: string;

  @Column('tinyint', { name: 'log_type', nullable: true })
  logType: number;

  @Column('int', { name: 'member_id', nullable: true })
  memberId: number;

  @Column('int', { name: 'created_by', nullable: true, comment: 'userId of action' })
  createdBy: number;

  @Column('tinyint', { name: 'created_type', nullable: true })
  createdType: number;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp', nullable: true, default: () => '(UTC_TIMESTAMP)' })
  createdDate: Date;
}
