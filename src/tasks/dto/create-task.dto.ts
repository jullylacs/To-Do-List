// src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  descricao: String;
}