import { IsString, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'user'], { message: 'El rol debe ser admin o user' })
  role?: string;
}
