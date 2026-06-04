import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registrar un nuevo usuario de forma pública (rol 'user' obligado)
   */
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { username, password, role } = createUserDto;

    // Restringir el auto-registro de administradores
    if (role === 'admin') {
      throw new ForbiddenException(
        'Acceso denegado: El auto-registro de administradores no está permitido.'
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el usuario
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      role: 'user', // Siempre 'user' en registro público
    });

    const savedUser = await newUser.save();

    // Retornar información del usuario sin contraseña
    return {
      id: savedUser._id,
      username: savedUser.username,
      role: savedUser.role,
    };
  }

  /**
   * Crear un nuevo usuario desde el panel de administración (permite rol 'admin' y 'user')
   */
  async adminCreateUser(createUserDto: CreateUserDto): Promise<any> {
    const { username, password, role } = createUserDto;

    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      role: role || 'user',
    });

    const savedUser = await newUser.save();

    return {
      id: savedUser._id,
      username: savedUser.username,
      role: savedUser.role,
    };
  }

  /**
   * Obtener todos los usuarios registrados (solo admin)
   */
  async getAllUsers(): Promise<any[]> {
    return this.userModel.find({}, '-password').sort({ username: 1 }).exec();
  }

  /**
   * Eliminar un usuario (solo admin)
   */
  async deleteUser(id: string, requestingUser: any): Promise<any> {
    const userToDelete = await this.userModel.findById(id).exec();
    if (!userToDelete) {
      throw new ConflictException('El usuario no existe');
    }

    // Evitar que el administrador principal sea eliminado
    if (userToDelete.username === 'admin') {
      throw new ForbiddenException(
        'No se puede eliminar el usuario administrador principal del sistema.'
      );
    }

    // Evitar que un administrador se elimine a sí mismo
    if (userToDelete._id.toString() === requestingUser.sub) {
      throw new ForbiddenException('No puedes eliminar tu propia cuenta de usuario.');
    }

    return this.userModel.findByIdAndDelete(id).exec();
  }

  /**
   * Iniciar sesión y obtener JWT
   */
  async login(loginDto: LoginDto): Promise<{ user: any; token: string }> {
    const { username, password } = loginDto;

    // Buscar usuario
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar el payload del JWT
    const payload = {
      sub: user._id,
      username: user.username,
      role: user.role,
    };

    // Firmar token y retornar
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }
}
