// src/products/dto/update-product.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  descricao?: String;
}