// src/Tasks/Tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entities/task.entity'; // Importar a entidade

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])], // Registrar a entidade no módulo
  controllers: [TaskController],
  providers: [TasksService],
})
export class TasksModule {}