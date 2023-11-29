import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
@Entity('topic')
export default class Topic {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'thumbnail', type: 'longtext', nullable: false })
  thumbnail: string;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: false} )
  title: string;

  @Column({ name: 'content', type: 'longtext', nullable: false })
  content: string;

  @Column({ name: 'sub_content', type: 'varchar', length: 255, nullable: false })
  subContent: string;

  @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ name: 'modified_date', type: 'datetime', nullable: true })
  modifiedDate: Date | null;
}
