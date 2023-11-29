import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import LabService from './LabService';
@Entity('lab_service_detail')
export default class LabServiceDetail {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;

  @Column({ name: 'content', type: 'text', nullable: false })
  content: string;

  @Column({ name: 'order', type: 'int', nullable: false })
  order: number | 0;

  @ManyToOne(() => LabService)
  @JoinColumn({name: 'lab_service_id'})
  labService: LabService;
}
