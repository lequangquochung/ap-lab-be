import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import LabServiceDetail from './LabServiceDetail';
@Entity('lab_service')
export default class LabService {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;

  @Column({ name: 'title', type: 'text', nullable: false })
  title: string;

  @Column({ name: 'bg_color', type: 'text', nullable: true })
  bgColor: string;

  @Column({ name: 'order', type: 'int', nullable: false })
  order: number | 0;

  @OneToMany(() => LabServiceDetail, detail => detail.labService)
  details: LabServiceDetail[];
}
