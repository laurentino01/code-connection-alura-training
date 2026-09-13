import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';

interface FakeRequest {
  headers: { authorization?: string };
  user?: JwtPayload;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<Pick<JwtService, 'verifyAsync'>>;
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  const buildContext = (
    authorizationHeader?: string,
  ): { context: ExecutionContext; request: FakeRequest } => {
    const request: FakeRequest = {
      headers: { authorization: authorizationHeader },
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;

    return { context, request };
  };

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    reflector = { getAllAndOverride: jest.fn() };
    guard = new AuthGuard(
      jwtService as unknown as JwtService,
      reflector as unknown as Reflector,
    );
  });

  it('allows a public route without checking for a token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const { context } = buildContext();

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('rejects a request with no Authorization header', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const { context } = buildContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects a malformed Authorization header (wrong scheme)', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const { context } = buildContext('Basic abc123');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects when the token fails verification', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'));
    const { context } = buildContext('Bearer bad-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('allows the request and attaches the payload when the token is valid', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const payload = { sub: 'user-1', email: 'ana@exemplo.com' };
    jwtService.verifyAsync.mockResolvedValue(payload);
    const { context, request } = buildContext('Bearer good-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('good-token');
    expect(request.user).toEqual(payload);
  });
});
