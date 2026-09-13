import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
  });

  it('creates a user with a generated id and createdAt', () => {
    const user = service.create({
      name: 'Ana Souza',
      email: 'ana@exemplo.com',
      passwordHash: 'hashed',
    });

    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.name).toBe('Ana Souza');
    expect(user.email).toBe('ana@exemplo.com');
    expect(user.passwordHash).toBe('hashed');
  });

  it('generates distinct ids for different users', () => {
    const first = service.create({
      name: 'Ana',
      email: 'ana@exemplo.com',
      passwordHash: 'a',
    });
    const second = service.create({
      name: 'Bea',
      email: 'bea@exemplo.com',
      passwordHash: 'b',
    });

    expect(first.id).not.toBe(second.id);
  });

  it('finds a user by id', () => {
    const created = service.create({
      name: 'Ana',
      email: 'ana@exemplo.com',
      passwordHash: 'a',
    });

    expect(service.findById(created.id)).toEqual(created);
  });

  it('returns undefined when finding by an unknown id', () => {
    expect(service.findById('unknown-id')).toBeUndefined();
  });

  it('finds a user by email, case-insensitively and ignoring surrounding spaces', () => {
    const created = service.create({
      name: 'Ana',
      email: 'Ana@Exemplo.com',
      passwordHash: 'a',
    });

    expect(service.findByEmail('  ana@exemplo.com  ')).toEqual(created);
    expect(service.findByEmail('ANA@EXEMPLO.COM')).toEqual(created);
  });

  it('returns undefined when finding by an unknown email', () => {
    expect(service.findByEmail('nobody@exemplo.com')).toBeUndefined();
  });

  it('detects an existing email regardless of case', () => {
    service.create({
      name: 'Ana',
      email: 'ana@exemplo.com',
      passwordHash: 'a',
    });

    expect(service.existsByEmail('ANA@exemplo.com')).toBe(true);
    expect(service.existsByEmail('outro@exemplo.com')).toBe(false);
  });
});
