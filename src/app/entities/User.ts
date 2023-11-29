import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
@Entity('user')
export default class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'password', type: 'text' })
  password: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
  fullName: string | null;

  @Column({ name: 'gender', type: 'tinyint', nullable: true, comment: '1: male, 2: female' })
  gender: number | null;

  @Column({ name: 'birthday', type: 'date', nullable: true })
  birthday: Date | string | null;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true, unique: true })
  phoneNumber: string | null;

  @Column({ name: 'avatar', type: 'longtext', nullable: true })
  avatar: string | null;

  @Column({ name: 'status', type: 'tinyint', default: 1, comment: '0: Inactive, 1: Active.' })
  status: number;

  @Column({ name: 'role', type: 'varchar', length: 255, nullable: true })
  role: string | null;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string | null;
}
