import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User } from './entities/user.entity';

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

/**
 * In-memory user store. No ORM/database yet — this is the only place that
 * knows how users are persisted, so swapping in a real database later means
 * changing just this class.
 */
@Injectable()
export class UsersService {
  private readonly usersById = new Map<string, User>();
  private readonly idByEmail = new Map<string, string>();

  create(input: CreateUserInput): User {
    const user: User = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      createdAt: new Date(),
    };

    this.usersById.set(user.id, user);
    this.idByEmail.set(this.normalizeEmail(user.email), user.id);

    return user;
  }

  findById(id: string): User | undefined {
    return this.usersById.get(id);
  }

  findByEmail(email: string): User | undefined {
    const id = this.idByEmail.get(this.normalizeEmail(email));
    return id ? this.usersById.get(id) : undefined;
  }

  existsByEmail(email: string): boolean {
    return this.idByEmail.has(this.normalizeEmail(email));
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
