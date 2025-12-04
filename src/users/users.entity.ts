import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserSession } from './users_session.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  user_id: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: number;

  @Column({ name: 'isAdmin', type: 'boolean' })
  isAdmin: boolean;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => UserSession, session => session.user)
  sessions: UserSession[];

}
