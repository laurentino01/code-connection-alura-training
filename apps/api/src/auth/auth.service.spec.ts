import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<
    Pick<UsersService, 'existsByEmail' | 'create' | 'findByEmail'>
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;

  const buildUser = (overrides: Partial<User> = {}): User => ({
    id: 'user-1',
    name: 'Ana Souza',
    email: 'ana@exemplo.com',
    passwordHash: 'irrelevant',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  });

  beforeEach(async () => {
    usersService = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
    jwtService = { signAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    it('hashes the password before storing the user', async () => {
      usersService.existsByEmail.mockReturnValue(false);
      usersService.create.mockImplementation((input) =>
        buildUser({ ...input }),
      );

      await service.register({
        name: 'Ana Souza',
        email: 'ana@exemplo.com',
        password: 'senha-forte-123',
      });

      const createArg = usersService.create.mock.calls[0][0];
      expect(createArg.passwordHash).not.toBe('senha-forte-123');
      expect(
        await bcrypt.compare('senha-forte-123', createArg.passwordHash),
      ).toBe(true);
    });

    it('returns the created user without the password hash', async () => {
      usersService.existsByEmail.mockReturnValue(false);
      usersService.create.mockImplementation((input) =>
        buildUser({ ...input }),
      );

      const result = await service.register({
        name: 'Ana Souza',
        email: 'ana@exemplo.com',
        password: 'senha-forte-123',
      });

      expect(result).toEqual({
        id: 'user-1',
        name: 'Ana Souza',
        email: 'ana@exemplo.com',
        createdAt: expect.any(Date),
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('throws ConflictException when the e-mail is already registered', async () => {
      usersService.existsByEmail.mockReturnValue(true);

      await expect(
        service.register({
          name: 'Ana',
          email: 'ana@exemplo.com',
          password: 'senha-forte-123',
        }),
      ).rejects.toThrow(ConflictException);
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns an access token and the user on valid credentials', async () => {
      const passwordHash = await bcrypt.hash('senha-forte-123', 10);
      usersService.findByEmail.mockReturnValue(buildUser({ passwordHash }));
      jwtService.signAsync.mockResolvedValue('signed-jwt');

      const result = await service.login({
        email: 'ana@exemplo.com',
        password: 'senha-forte-123',
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'ana@exemplo.com',
      });
      expect(result.access_token).toBe('signed-jwt');
      expect(result.user).toEqual({
        id: 'user-1',
        name: 'Ana Souza',
        email: 'ana@exemplo.com',
        createdAt: expect.any(Date),
      });
    });

    it('throws UnauthorizedException on a wrong password', async () => {
      const passwordHash = await bcrypt.hash('senha-forte-123', 10);
      usersService.findByEmail.mockReturnValue(buildUser({ passwordHash }));

      await expect(
        service.login({ email: 'ana@exemplo.com', password: 'senha-errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws the same UnauthorizedException when the e-mail does not exist', async () => {
      usersService.findByEmail.mockReturnValue(undefined);

      await expect(
        service.login({
          email: 'ninguem@exemplo.com',
          password: 'qualquer-coisa',
        }),
      ).rejects.toThrow(new UnauthorizedException('Credenciais inválidas'));
    });
  });
});
