import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El color es requerido' })
  @MinLength(2, { message: 'El color debe tener al menos 2 caracteres' })
  color: string;

  @IsString()
  @IsNotEmpty({ message: 'La talla es requerida' })
  talla: string;

  @IsEnum(['zapato', 'bolsa'], {
    message: 'El tipo debe ser "zapato" o "bolsa"',
  })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  tipo: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  @IsNotEmpty({ message: 'El precio es requerido' })
  precio: number;
}
