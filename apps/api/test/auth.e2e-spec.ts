import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  const credentials = {
    name: 'Ana Souza',
    email: 'ana@exemplo.com',
    password: 'senha-forte-123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // main.ts's useGlobalPipes doesn't run under createTestingModule, so it
    // has to be replicated here for the e2e app to behave like production.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(String),
      name: credentials.name,
      email: credentials.email,
      createdAt: expect.any(String),
    });
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('rejects registering the same e-mail twice', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(409);
  });

  it('rejects registration payloads that fail validation', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Bea', email: 'not-an-email', password: 'senha-forte-123' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Bea', email: 'bea@exemplo.com', password: 'curta' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...credentials,
        email: 'bea@exemplo.com',
        extraField: 'not-allowed',
      })
      .expect(400);
  });

  it('logs in with valid credentials and returns an access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);

    expect(response.body.access_token).toEqual(expect.any(String));
    expect(response.body.user).toEqual({
      id: expect.any(String),
      name: credentials.name,
      email: credentials.email,
      createdAt: expect.any(String),
    });
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('rejects login with a wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: 'senha-errada' })
      .expect(401);
  });

  it('rejects login for an e-mail that does not exist', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ninguem@exemplo.com', password: 'qualquer-senha' })
      .expect(401);
  });

  describe('GET /users/me', () => {
    let accessToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: credentials.email, password: credentials.password });

      accessToken = response.body.access_token;
    });

    it('returns the authenticated user profile with a valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual({
        id: expect.any(String),
        name: credentials.name,
        email: credentials.email,
        createdAt: expect.any(String),
      });
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('rejects requests without a token', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('rejects requests with a garbage token', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(401);
    });
  });
});
