import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';

interface FindAllOptions {
  page: number;
  limit: number;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  /**
   * Cria um novo Tarefa e o associa a um usuário.
   */
  async create(createTaskDto: CreateTaskDto, userId: number): Promise<TaskEntity> {
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      user: { id: userId },
    });
    return await this.taskRepository.save(newTask);
  }

  /**
   * Busca e retorna uma lista paginada de Tarefas.
   * A opção `relations: ['user']` é crucial aqui para garantir que os dados do usuário
   * associado a cada Tarefa sejam carregados e retornados na resposta da API.
   */
  async findAll(options: FindAllOptions): Promise<PaginationResponseDto<TaskEntity>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.taskRepository.findAndCount({
      skip,
      take: limit,
      relations: ['user'], // <-- CORREÇÃO APLICADA AQUI
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Busca um único Tarefa pelo seu ID.
   * A opção `relations: ['user']` também é essencial aqui para carregar
   * os dados do usuário dono do Tarefa.
   */
  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'], // <-- CORREÇÃO APLICADA AQUI
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID #${id} não encontrado.`);
    }
    return task;
  }

  /**
   * Atualiza os dados de um Tarefa existente.
   */
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });
    if (!task) {
      throw new NotFoundException(`Tarefa com ID #${id} não encontrado para atualizar.`);
    }
    return await this.taskRepository.save(task);
  }

  /**
   * Remove um Tarefa do banco de dados pelo seu ID.
   */
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}