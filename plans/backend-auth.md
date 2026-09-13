# Backend de cadastro e login (apps/api)

## Context

`apps/api` hoje é o starter cru do `@nestjs/cli` v11: cinco dependências, um `AppController` que devolve `"Hello World!"`, nenhum pipe de validação, nenhum CORS, nenhum Swagger. Enquanto isso `apps/web` já tem as telas de `/login` e `/cadastro` prontas, com `TODO: integrar com apps/api` nos dois handlers de submit e nenhum cliente HTTP — os forms só fazem `setTimeout` e `console.info`.

O objetivo é fechar essa lacuna: três endpoints REST autenticados por JWT, documentados em Swagger, com persistência **em memória** (sem ORM e sem banco — isso fica para uma etapa posterior). Ao final, o frontend tem um contrato real contra o qual integrar, e o `apps/api` deixa de ser scaffold.

Decisões já confirmadas com o usuário:

- **Padrão de auth**: capítulo oficial *Security > Authentication* da doc do Nest — `@nestjs/jwt` + um `AuthGuard` próprio + decorator `@Public()`. **Sem Passport.**
- **Rotas**: `POST /auth/register`, `POST /auth/login`, `GET /users/me` (resource-oriented, conforme a convenção REST do `CLAUDE.md`).
- **Campos do cadastro**: `name`, `email`, `password`. **Sem `confirmPassword`** — casa com o `SignupForm` que já existe na tela.
- **Testes**: unitários (`*.spec.ts`) + um e2e do fluxo completo.

## Endpoints

```
POST /auth/register           público
  body    { name, email, password }
  201     { id, name, email, createdAt }
  400     validação (email inválido, senha < 8, campo extra)
  409     email já cadastrado

POST /auth/login              público
  body    { email, password }
  200     { access_token, user: { id, name, email, createdAt } }
  400     validação
  401     credenciais inválidas

GET  /users/me                Bearer <access_token>
  200     { id, name, email, createdAt }
  401     token ausente, inválido ou expirado
```

`passwordHash` nunca sai em nenhuma resposta.

## Dependências a instalar

```bash
pnpm --filter api add @nestjs/jwt @nestjs/swagger @nestjs/config class-validator class-transformer bcryptjs
```

- **`bcryptjs`** e não `bcrypt`: `bcrypt` é módulo nativo e o `pnpm-workspace.yaml` não tem `onlyBuiltDependencies`, então o pnpm 10 bloquearia o postinstall. `bcryptjs` é JS puro e a v3 já traz os próprios tipos (se o `tsc` reclamar, adicionar `@types/bcryptjs` como devDep).
- **Sem `uuid`**: o `tsconfig` mira `ES2023` no Node 22, então usar `randomUUID()` de `node:crypto`.
- `class-validator`/`class-transformer` aparecem no `pnpm-lock.yaml` apenas como peers **opcionais** do `@nestjs/common` — não estão instalados de fato, precisam ser adicionados explicitamente.

## Estrutura de arquivos

Nest CLI em modo single-app (`sourceRoot: "src"`), sem path aliases no `tsconfig` nem `moduleNameMapper` no Jest — **usar imports relativos** (`./users/users.service`), nunca `@/...`.

```
apps/api/src/
  main.ts                              (modificar)
  app.module.ts                        (modificar)
  app.controller.ts                    (modificar — marcar @Public)
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    auth.service.spec.ts
    auth.guard.ts
    auth.guard.spec.ts
    decorators/public.decorator.ts
    decorators/current-user.decorator.ts
    dto/register.dto.ts
    dto/login.dto.ts
    dto/login-response.dto.ts
  users/
    users.module.ts
    users.controller.ts
    users.controller.spec.ts
    users.service.ts
    users.service.spec.ts
    entities/user.entity.ts
    dto/user-response.dto.ts
apps/api/test/
  auth.e2e-spec.ts
apps/api/.env                          (gitignored — já coberto pelo .gitignore do Nest)
apps/api/.env.example                  (commitado)
```

## Implementação

### 1. `users/` — a camada de dados em memória

`entities/user.entity.ts`: classe `User` com `id: string`, `name: string`, `email: string`, `passwordHash: string`, `createdAt: Date`.

`users.service.ts`: um `private readonly users = new Map<string, User>()` como store (chave = id), com um índice auxiliar por email **normalizado** (`email.trim().toLowerCase()`) para o lookup do login e a checagem de duplicidade. Métodos:

- `create({ name, email, passwordHash })` → gera `randomUUID()` + `createdAt`, grava e devolve o `User`.
- `findByEmail(email)` → `User | undefined` (normaliza antes de buscar).
- `findById(id)` → `User | undefined`.
- `existsByEmail(email)` → `boolean`.

O serviço **não** conhece bcrypt nem JWT — recebe o hash pronto. Isso mantém a troca por ORM depois limitada a esta classe.

`dto/user-response.dto.ts`: `UserResponseDto` com `@ApiProperty()` em `id`, `name`, `email`, `createdAt`, mais um `static fromEntity(user: User): UserResponseDto` que faz o pick dos campos públicos. Esse mapper é o único ponto por onde um `User` vira resposta — usar em todos os três endpoints.

`users.controller.ts`: `@Controller('users')` com `@Get('me')`. Lê o `sub` do `request.user` (via decorator `@CurrentUser()`), chama `findById` e devolve `UserResponseDto.fromEntity`. Se o usuário não existir mais (token válido de um id sumido), lançar `UnauthorizedException`.

### 2. `auth/` — guard, decorators e serviço

`decorators/public.decorator.ts` — exatamente o padrão da doc:

```ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

`decorators/current-user.decorator.ts` — `createParamDecorator` que devolve `request.user` (o payload do JWT), para o controller não tocar em `@Req()` cru.

`auth.guard.ts` — `AuthGuard implements CanActivate`, com `JwtService` e `Reflector` injetados:

1. `reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, class])` → se público, `return true`.
2. Extrai o token do header `Authorization` (`extractTokenFromHeader`: split por espaço, exige o tipo `Bearer`).
3. Sem token → `UnauthorizedException`.
4. `await jwtService.verifyAsync(token, { secret })` dentro de try/catch; falha → `UnauthorizedException`.
5. Sucesso → `request['user'] = payload` e `return true`.

Registrar como **guard global** no `AuthModule` via `{ provide: APP_GUARD, useClass: AuthGuard }`, e marcar `@Public()` em `register`, `login` e no `getHello` do `AppController` (senão o `/` do e2e starter passa a devolver 401 e quebra o `app.e2e-spec.ts` existente).

`auth.service.ts`:

- `register(dto)` → se `usersService.existsByEmail` → `ConflictException('E-mail já cadastrado')`. Senão `bcrypt.hash(password, 10)`, cria e devolve `UserResponseDto.fromEntity`.
- `login(dto)` → busca por email; **se não achar, ainda assim comparar contra um hash dummy** antes de lançar, para não vazar por timing quais emails existem. Senha errada ou usuário inexistente → a **mesma** `UnauthorizedException('Credenciais inválidas')`. Sucesso → assina `{ sub: user.id, email: user.email }` e devolve `{ access_token, user }`.

`auth.controller.ts` — `@Controller('auth')`, ambos `@Public()`. O `login` precisa de `@HttpCode(HttpStatus.OK)` porque POST devolve 201 por padrão no Nest e login não cria recurso.

`auth.module.ts` — importa `UsersModule` e registra o `JwtModule` de forma assíncrona, lendo do `ConfigService`:

```ts
JwtModule.registerAsync({
  global: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow<string>('JWT_SECRET'),
    signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '1d' },
  }),
})
```

`getOrThrow` faz o app falhar no boot se o segredo não estiver setado — melhor que um fallback hardcoded silencioso.

### 3. DTOs e validação

`register.dto.ts`:

```ts
export class RegisterDto {
  @ApiProperty({ example: 'Ana Souza' })
  @IsString() @IsNotEmpty() @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'ana@exemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha-forte-123', minLength: 8 })
  @IsString() @MinLength(8) @MaxLength(72)
  password: string;
}
```

`MaxLength(72)` na senha porque bcrypt trunca silenciosamente acima disso. `login.dto.ts` é `email` + `password` (só `@IsEmail()` / `@IsNotEmpty()` — não repetir as regras de força no login). `login-response.dto.ts` declara `access_token: string` e `user: UserResponseDto` só para o Swagger renderizar o shape aninhado.

### 4. `main.ts` e `app.module.ts`

`app.module.ts`: `imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule]`.

`main.ts` ganha, antes do `listen`:

```ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173' });
```

e o Swagger em `/docs`, com `.addBearerAuth()` no `DocumentBuilder` para o botão *Authorize* liberar o `GET /users/me` direto da UI.

`.env.example` (commitado) com `PORT=3000`, `JWT_SECRET=troque-este-valor`, `JWT_EXPIRES_IN=1d`, `WEB_ORIGIN=http://localhost:5173`. O `.env` real é criado localmente — o `.gitignore` do Nest já cobre.

## Testes

Specs unitários ficam em `src/` como `*.spec.ts` (o Jest do `package.json` tem `rootDir: "src"`); o e2e vai em `test/` como `*.e2e-spec.ts`.

- **`users.service.spec.ts`** — cria e recupera por id/email; `findByEmail` é case-insensitive e ignora espaços; `existsByEmail` detecta duplicata; ids são distintos.
- **`auth.service.spec.ts`** — mock do `UsersService` e do `JwtService`. Cobre: register faz hash (o valor salvo ≠ a senha crua), register duplicado lança `ConflictException`, login devolve token, login com senha errada e login com email inexistente lançam ambos `UnauthorizedException` com a mesma mensagem.
- **`auth.guard.spec.ts`** — rota `@Public()` passa sem token (mock do `Reflector`); sem header → 401; header malformado (`Basic xyz`, token solto) → 401; token válido popula `request.user`; `verifyAsync` que rejeita → 401.
- **`users.controller.spec.ts`** — devolve o DTO do usuário do `sub`; usuário inexistente → `UnauthorizedException`.
- **`test/auth.e2e-spec.ts`** — app real com o `ValidationPipe` global replicado (o `useGlobalPipes` do `main.ts` não roda no `Test.createTestingModule`, então tem que ser aplicado no setup). Fluxo: register 201 → register repetido 409 → login 200 com `access_token` → `GET /users/me` com Bearer 200 → sem token 401 → token lixo 401 → register com email inválido/senha curta/campo extra 400. Assertar em **todas** as respostas que não existe `passwordHash` nem `password`.

Importar supertest como `import request from 'supertest'` (default import), igual ao `app.e2e-spec.ts` atual — o `tsconfig` está em `nodenext` com `esModuleInterop`.

O ESLint do api roda `recommendedTypeChecked`: tipar o retorno de `jwtService.verifyAsync<JwtPayload>()` e o `request['user']` para não disparar `no-unsafe-*`.

## Ajustes fora do apps/api

- **`apps/web/src/components/pages/SignupPage/SignupPage.tsx:11`** e **`LoginPage.tsx:11`** — atualizar os comentários `TODO` para apontar `POST /auth/register` e `POST /auth/login`. Só os comentários; nenhuma mudança de lógica ou de UI nesta etapa.
- **`CLAUDE.md`** — a seção "Project overview" diz que `apps/api` está em estágio de scaffold sem domínio próprio; atualizar para descrever os módulos `auth`/`users`, o store em memória e o Swagger em `/docs`. Acrescentar em "Backend conventions" que o `AuthGuard` é global e que rotas novas são autenticadas por padrão salvo `@Public()`.
- **`plans/backend-auth.md`** — o `CLAUDE.md` pede que planos de implementação vivam em `plans/` na raiz; copiar este plano para lá.
- **root `package.json`** (opcional) — adicionar `"test:api:e2e": "pnpm --filter api test:e2e"`, já que só existe passthrough para build/lint/test.

## Verificação

```bash
pnpm --filter api lint
pnpm --filter api test          # unitários
pnpm --filter api test:e2e      # fluxo ponta a ponta
pnpm --filter api build         # tsc limpo
pnpm dev:api                    # sobe em :3000
```

Com o server no ar, abrir `http://localhost:3000/docs` e percorrer o fluxo pela própria UI do Swagger: `POST /auth/register` → `POST /auth/login` → copiar o `access_token` no botão **Authorize** → `GET /users/me` devolve 200 com o usuário. Depois remover o token no Authorize e confirmar que o mesmo GET passa a devolver 401.

Checagem manual equivalente:

```bash
curl -X POST localhost:3000/auth/register -H 'Content-Type: application/json' \
  -d '{"name":"Ana","email":"ana@exemplo.com","password":"senha-forte-123"}'
curl -X POST localhost:3000/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"ana@exemplo.com","password":"senha-forte-123"}'
curl localhost:3000/users/me -H 'Authorization: Bearer <token>'
```

## Fora de escopo

Refresh token / `rememberMe` (o `LoginForm` tem o checkbox, mas ele não altera nada no backend por ora), OAuth Google/GitHub (o `SocialAuthSection` continua sem handler), rate limiting, e a integração de fato do frontend com a API — os forms seguem em `setTimeout`. O store em memória zera a cada restart; a troca por ORM fica isolada no `UsersService`.

## Commit

Conventional Commits, conforme o `CLAUDE.md`: `feat(api): cadastro, login e perfil com JWT e swagger`.
