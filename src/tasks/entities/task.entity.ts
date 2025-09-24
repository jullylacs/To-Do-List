// src/tasks/entities/product.entity.ts
import { UserEntity } from '../../users/entities/user.entity'; // Importar UserEntity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'; // Importar ManyToOne

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500 })
  descricao: String;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  // Define o lado "Muitos" da relação. Muitos produtos para um usuário.
  // Isso criará uma coluna 'userId' no banco de dados automaticamente.
  @ManyToOne(() => UserEntity, (user) => user.tasks, { eager: true }) // eager: true carrega o usuário automaticamente
  user: UserEntity;
}