import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, MinLength } from 'class-validator';

export class ListProductsQueryDto {
  @IsOptional()
  @IsEnum(['zapato', 'bolsa'], {
    message: 'El tipo debe ser "zapato" o "bolsa"',
  })
  tipo?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'La búsqueda debe tener al menos 2 caracteres' })
  search?: string;

  @IsOptional()
  @IsNumber({}, { message: 'minPrecio debe ser un número válido' })
  @Transform(({ value }) => Number(value))
  minPrecio?: number;

  @IsOptional()
  @IsNumber({}, { message: 'maxPrecio debe ser un número válido' })
  @Transform(({ value }) => Number(value))
  maxPrecio?: number;
}
