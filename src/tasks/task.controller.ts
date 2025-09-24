// src/tasks/tasks.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseGuards, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enum/role.enum';
import { RolesGuard } from '../auth/decorators/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface'; // Usar 'import type'
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserPayload,
  ): Promise<TaskEntity> {
    return await this.tasksService.create(createTaskDto, user.userId);
  }

  @Get()
async findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
): Promise<PaginationResponseDto<TaskEntity>> { // Atualizar tipo de retorno
  limit = limit > 100 ? 100 : limit;
  return await this.tasksService.findAll({ page, limit });
}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return await this.tasksService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.tasksService.remove(id);
  }
}