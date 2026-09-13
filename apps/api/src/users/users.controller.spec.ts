import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<Pick<UsersService, 'findById'>>;

  const user: User = {
    id: 'user-1',
    name: 'Ana Souza',
    email: 'ana@exemplo.com',
    passwordHash: 'hashed',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    usersService = { findById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get(UsersController);
  });

  it('returns the profile of the user identified by the JWT payload', () => {
    usersService.findById.mockReturnValue(user);

    const result = controller.getProfile({ sub: user.id, email: user.email });

    expect(usersService.findById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('throws UnauthorizedException when the user no longer exists', () => {
    usersService.findById.mockReturnValue(undefined);

    expect(() =>
      controller.getProfile({ sub: 'gone', email: 'gone@exemplo.com' }),
    ).toThrow(UnauthorizedException);
  });
});
