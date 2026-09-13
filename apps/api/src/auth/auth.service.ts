import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

const SALT_ROUNDS = 10;

// Used to keep the login response time the same whether the e-mail exists
// or not, so an attacker can't tell registered e-mails apart by timing.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    if (this.usersService.existsByEmail(dto.email)) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    return UserResponseDto.fromEntity(user);
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = this.usersService.findByEmail(dto.email);

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token, user: UserResponseDto.fromEntity(user) };
  }
}
