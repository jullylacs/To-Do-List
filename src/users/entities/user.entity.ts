// src/users/entities/user.entity.ts
import { TaskEntity } from '../../tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../../common/enum/role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User, // Todo novo usuário será 'user' por padrão
  })
  role: Role;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];
}
