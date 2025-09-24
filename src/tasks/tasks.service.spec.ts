// src/Tasks/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entities/task.entity';
import { Role } from '../common/enum/role.enum';

// Mock do repositório para simular as operações de banco de dados
const mockTaskRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

// Um produto de exemplo para usar nos testes
const mockTask: TaskEntity = {
  id: 1,
  name: 'Test Task',
  descricao: 'Tarefa foda e importante',
  createdAt: new Date(),
  user: { id: 1, email: 'test@test.com', password: 'hashedpassword', role: Role.User, tasks: [] },
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<TaskEntity>>(getRepositoryToken(TaskEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find and return a task by ID', async () => {
      // Configura o mock para retornar nosso produto de teste quando 'findOne' for chamado
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user'] });
    });

    it('should throw NotFoundException if task is not found', async () => {
      // Configura o mock para retornar nulo, simulando um produto não encontrado
      mockTaskRepository.findOne.mockResolvedValue(null);

      // Esperamos que a chamada ao serviço seja rejeitada com o erro correto
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});