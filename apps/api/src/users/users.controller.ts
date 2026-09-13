import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({
    description: 'Dados do usuário autenticado',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido ou expirado',
  })
  getProfile(@CurrentUser() currentUser: JwtPayload): UserResponseDto {
    const user = this.usersService.findById(currentUser.sub);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return UserResponseDto.fromEntity(user);
  }
}
