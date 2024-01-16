import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
@Entity('employee')
export default class Employee {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ name: 'avatar', type: 'longtext', nullable: false })
  avatar: string;

  @Column({ name: 'degree', type: 'varchar', length: 255, nullable: false} )
  degree: string;

  @Column({ name: 'description', type: 'varchar', length: 1500, nullable: false} )
  description: string;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;

  @Column({ name: 'order', type: 'int', nullable: true, default: 0 })
  order: number;
}
