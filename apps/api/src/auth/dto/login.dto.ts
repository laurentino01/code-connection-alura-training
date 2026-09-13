import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ana@exemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha-forte-123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
