import { Controller, Post, Body, HttpCode, HttpStatus, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registro de usuario público (siempre se registra con rol 'user')
   * POST /api/auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result,
    };
  }

  /**
   * Inicio de sesión
   * POST /api/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result,
    };
  }

  /**
   * Obtener todos los usuarios del sistema (solo administradores)
   * GET /api/auth/users
   */
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    const users = await this.authService.getAllUsers();
    return {
      success: true,
      data: users,
    };
  }

  /**
   * Crear un nuevo usuario con cualquier rol (solo administradores)
   * POST /api/auth/users
   */
  @Post('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createUserByAdmin(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.adminCreateUser(createUserDto);
    return {
      success: true,
      message: 'Usuario creado exitosamente por el administrador',
      data: result,
    };
  }

  /**
   * Eliminar un usuario (solo administradores)
   * DELETE /api/auth/users/:id
   */
  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    const requestingUser = req.user; // populated by JwtAuthGuard (decoded payload)
    await this.authService.deleteUser(id, requestingUser);
    return {
      success: true,
      message: 'Usuario eliminado exitosamente',
    };
  }
}
