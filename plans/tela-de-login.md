# Tela de Login (apps/web) — Design Atômico + Tailwind

## Context

`apps/web` é hoje o starter cru do Vite React (contador de demonstração, `index.css` do template com `#root { width: 1126px; text-align: center; border-inline: ... }`). Não há Tailwind, nem test runner, nem router — apesar de o `CLAUDE.md` exigir Tailwind, design atômico e "testes fundamentais para todo componente".

O objetivo é implementar a tela de Login do print **somente no frontend** (submit é stub, sem chamada à API), e — este é o ponto central do pedido — fazer isso com componentes **genéricos e prop-driven**, porque a tela de **cadastro** vem em seguida e deve reaproveitar praticamente tudo: o layout, o card, os campos, o divisor, os botões sociais e o rodapé de "já tem conta?".

Resultado esperado: `/login` renderizando fiel ao print, com uma base de átomos/moléculas/organismos testada, sobre a qual o cadastro seja apenas `SignupForm` + `SignupPage`.

Decisões confirmadas com o usuário: **Vitest + RTL**, **react-router v8**, **Poppins via @fontsource**, **elos do fundo como SVG inline**.

---

## 1. Dependências e configuração

Versões verificadas no registry hoje: `tailwindcss`/`@tailwindcss/vite` 4.3.3, `vitest` 5.0.0, `jsdom` 30.0.1, `@testing-library/react` 16.3.3, `react-router` 8.3.1.

```bash
pnpm --filter web add tailwindcss @tailwindcss/vite react-router @fontsource/poppins
pnpm --filter web add -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom
```

- `react-router` v7+ é o pacote unificado — **não** instalar `react-router-dom`.
- `@testing-library/dom` explícito: é peer do RTL 16 e o pnpm não faz hoisting dele.
- Sem `clsx`/`tailwind-merge` — um `cn()` local de 3 linhas cobre os variant maps usados aqui.

**[apps/web/vite.config.ts](apps/web/vite.config.ts)** — reescrever:

```ts
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'   // não 'vite' — tipa a chave `test`

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
```

`globals: false` (cada teste importa `describe/it/expect` de `vitest`) evita mexer em `types` do tsconfig e agrada o oxlint; em troca o setup precisa registrar `cleanup` na mão. `css: false` porque os testes só precisam das strings de `className` no DOM.

**[apps/web/tsconfig.app.json](apps/web/tsconfig.app.json)** — adicionar só `"paths": { "@/*": ["./src/*"] }` (sem `baseUrl`; `moduleResolution: bundler` resolve relativo ao tsconfig). O alias tem que existir nos **dois** lugares (vite + tsconfig) ou `tsc -b` e o bundler discordam. Não ligar `strict` agora — é mudança à parte e nada aqui depende dela.

**[apps/web/package.json](apps/web/package.json)** — scripts `"test": "vitest run"`, `"test:watch": "vitest"`.
**[package.json](package.json)** (raiz) — `"test:web": "pnpm --filter web test"` e `"test": "pnpm -r --if-present test"`.
**[apps/web/index.html](apps/web/index.html)** — `lang="pt-BR"`, `<title>Code Connect | Login</title>`.

---

## 2. Tokens de design e limpeza

**[apps/web/src/index.css](apps/web/src/index.css)** — apagar **todo** o conteúdo atual (o `:root` claro, o bloco `prefers-color-scheme`, o `#root` de 1126px com `border-inline`, as regras de `h1/h2/code/.counter`) e substituir por:

```css
@import "tailwindcss";

@theme {
  --color-canvas: #0a0f0c;        /* fundo quase preto, com fundo esverdeado */
  --color-canvas-tint: #0f1a14;   /* parada do gradiente radial */
  --color-card: #2e2e2e;
  --color-field: #3a3a3a;         /* inputs e tiles sociais */
  --color-line: #454545;

  --color-ink: #ffffff;
  --color-ink-soft: #c9c9c9;
  --color-ink-muted: #8b8b8b;

  --color-brand: #2fa84f;
  --color-brand-hover: #268c42;
  --color-brand-ink: #0a0f0c;     /* texto escuro sobre o botão verde */

  --color-glyph: #1c3a2a;         /* elos do fundo, baixo contraste */

  --font-sans: "Poppins", ui-sans-serif, system-ui, sans-serif;
  --radius-card: 16px;
  --radius-field: 6px;
  --shadow-card: 0 24px 60px -12px rgb(0 0 0 / 0.55);
}

@layer base {
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    background-color: var(--color-canvas);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
```

Isso gera `bg-canvas`, `bg-card`, `bg-field`, `border-line`, `text-ink-muted`, `bg-brand hover:bg-brand-hover`, `text-glyph`, `rounded-card`, `shadow-card`.

Fonte em [apps/web/src/main.tsx](apps/web/src/main.tsx), **antes** do `./index.css` (Poppins não tem versão variável — pesos estáticos):
```ts
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import './index.css'
```

**Apagar:** `apps/web/src/App.css`, `apps/web/src/App.tsx`, `apps/web/src/assets/{hero.png,react.svg,vite.svg}`, `apps/web/public/icons.svg` (sprite do starter, referenciado só pelo `App.tsx`).
**Manter:** `public/main-banner.png`, `public/git-logo.svg`, `public/google-logo.svg`.

---

## 3. Inventário de componentes

Convenção: **pasta por componente**, teste ao lado, barrel de uma linha —
`src/components/<camada>/<Nome>/{<Nome>.tsx, <Nome>.test.tsx, index.ts}`, com os tipos exportados do próprio `.tsx`.

Apoio:
- `src/lib/cn.ts` — `(...parts: Array<string|false|null|undefined>) => parts.filter(Boolean).join(' ')`
- `src/constants/socialProviders.ts` — `AUTH_SOCIAL_PROVIDERS = [{ id:'github', label:'Github', iconSrc:'/git-logo.svg' }, { id:'google', label:'Gmail', iconSrc:'/google-logo.svg' }]`

### Átomos — `src/components/atoms/` (todos reusados no cadastro)

| Componente | Props |
|---|---|
| `Button` | `ComponentPropsWithRef<'button'> & { variant?: 'primary'\|'secondary'\|'ghost'; fullWidth?: boolean; iconLeft?: ReactNode; iconRight?: ReactNode }` — `primary` = `bg-brand text-brand-ink hover:bg-brand-hover`; default `type="button"` |
| `Input` | `ComponentPropsWithRef<'input'> & { invalid?: boolean }` — espalha `...rest` no `<input>`, `aria-invalid` quando inválido. **Sem `forwardRef`** (React 19 passa `ref` como prop normal) |
| `Label` | `ComponentPropsWithoutRef<'label'>` |
| `Checkbox` | `Omit<ComponentPropsWithRef<'input'>, 'type'>` — `<input type="checkbox">` com `accent-brand` nativo |
| `Heading` | `{ level?: 1\|2\|3; size?: 'lg'\|'md'\|'sm'; children; className? }` — separa tamanho visual do outline do documento |
| `Text` | `{ as?: 'p'\|'span'; tone?: 'default'\|'soft'\|'muted'\|'brand'; size?: 'xs'\|'sm'\|'base'; children; className? }` |
| `TextLink` | `{ to: string; external?: boolean; tone?: 'muted'\|'brand'; size?: 'xs'\|'sm'; iconRight?: ReactNode; children; className? }` — envolve o `Link` do react-router; único ponto de mudança se a decisão de router mudar |
| `Divider` | `{ className? }` — `<hr>` (`role="separator"` implícito) com `border-line` |
| `ArrowRightIcon` | `{ className? }` — SVG inline com `currentColor` (precisa herdar cor tanto no botão verde quanto no link verde) |
| `ChainGlyph` | `{ className? }` — ver §4 |

### Moléculas — `src/components/molecules/`

- **`FormField`** — a peça mais reusada no cadastro (nome, email, senha, confirmar senha).
  `Omit<InputProps,'id'|'invalid'> & { id: string; label: string; hint?: string; error?: string }`.
  Renderiza `Label(htmlFor=id)` + `Input(id, invalid=!!error, aria-describedby)` + mensagem de erro; o resto espalha no input.
- **`CheckboxField`** — `Omit<CheckboxProps,'id'> & { id: string; label: string }`
- **`LabeledDivider`** — `{ label: string; className? }` — `Divider` + `Text` + `Divider` em flex row
- **`SocialButton`** — `{ iconSrc: string; label: string; iconAlt?: string; onClick?: () => void; disabled?: boolean }` — tile redondo `bg-field border-line` com `<img>` e legenda embaixo; nome acessível vem do `aria-label={label}`, imagem fica decorativa
- **`SocialAuthButtons`** — `{ providers: SocialProvider[]; onSelect?: (id: string) => void; disabled?: boolean }`
- **`AuthPrompt`** — o bloco "Ainda não tem conta? / Crie seu cadastro!". Reusado literalmente no cadastro ("Já tem conta? / Faça seu login!").
  `{ message: string; linkLabel: string; to: string; icon?: ReactNode }` (default `<ArrowRightIcon />`)

### Organismos — `src/components/organisms/`

- **`AuthCard`** — a casca horizontal do card. **Reusado no cadastro** (que espelha a imagem).
  `{ image: { src: string; alt?: string }; imagePosition?: 'left'|'right'; children; className? }`.
  `bg-card rounded-card shadow-card p-4 flex gap-8`; imagem `h-full w-[190px] rounded-xl object-cover` com `alt=""` por padrão; coluna do form `w-[250px]`.
- **`SocialAuthSection`** — `LabeledDivider` + `SocialAuthButtons`. `{ label: string; providers; onSelect? }`.
- **`LoginForm`** — o **único** componente específico de login abaixo da camada de página.
  ```ts
  export type LoginFormValues = { identifier: string; password: string; rememberMe: boolean }
  export type LoginFormProps = {
    onSubmit: (values: LoginFormValues) => void | Promise<void>
    onSocialSelect?: (providerId: string) => void
    isSubmitting?: boolean
    errorMessage?: string
    socialProviders?: SocialProvider[]   // default AUTH_SOCIAL_PROVIDERS
    forgotPasswordTo?: string            // default '/recuperar-senha'
    signupTo?: string                    // default '/cadastro'
  }
  ```
  A linha "Lembre-me / Esqueci a senha" fica como flex row inline, **não** extraída: o cadastro terá um checkbox de termos, e abstrair dois layouts sem relação seria prematuro.

### Template e página

- **`src/components/templates/AuthLayout/AuthLayout.tsx`** — `{ children }`. `min-h-screen bg-canvas relative overflow-hidden` com wash radial verde, três `ChainGlyph` absolutos sangrando pelas bordas, e slot centralizado `relative z-10`. **Reusado no cadastro.**
- **`src/components/pages/LoginPage/LoginPage.tsx`** — sem props. Compõe `AuthLayout > AuthCard(image=/main-banner.png) > LoginForm`, segura o `isSubmitting` e o stub de submit (§5).

`main.tsx`: `<BrowserRouter>` com `/` → `<Navigate to="/login" replace />` e `/login` → `<LoginPage />`.

---

## 4. Elos do fundo — SVG inline

`src/components/atoms/ChainGlyph/ChainGlyph.tsx`, **não** um arquivo em `public/`. Motivos, em ordem: (1) precisa ser recolorível — um `<img src>` não aceita CSS de cor, um `<svg stroke="currentColor" fill="none">` herda `text-glyph`; (2) esse elo **é** a marca Code Connect, então o mesmo componente vira o logo do header depois, com uma fonte de verdade só; (3) sem request extra e trivial de assertar em teste.

Dois elos arredondados entrelaçados (`<rect rx>`/`<path>`, `strokeWidth={4}`, `fill="none"`) em `viewBox="0 0 200 200"`, raiz com `aria-hidden="true" focusable="false"`. O `AuthLayout` renderiza três instâncias com posições/opacidades distintas (ex.: `absolute -left-24 top-10 h-[420px] w-[420px] opacity-60`). É uma **aproximação** do traço da marca — se o SVG oficial aparecer, é colar o path neste único arquivo.

---

## 5. Logos sociais e estado do formulário

**Logos:** não mexer em `git-logo.svg` nem em `google-logo.svg`; renderizar os dois como `<img src="/...">`. O `fill="white"` do GitHub está correto aqui (tile `bg-field` #3A3A3A, UI só dark) e o "G" do Google **não pode** ser recolorido por diretriz de marca. Um caminho único (`iconSrc: string`) mantém o `SocialButton` genérico, sem SVGR. Consequência aceita: assets em `public/` não recebem hash nem checagem de existência em build — as strings ficam centralizadas em `socialProviders.ts`, e mover para `src/assets/` depois é mudança de um arquivo só.

**Estado:** `useState` controlado dentro do `LoginForm`, **sem** react-hook-form. São três valores e zero regras de validação. A migração fica barata de propósito: `Input`/`FormField` espalham `...rest` e aceitam `ref` como prop, então `<FormField {...register('email')} />` entra direto quando o cadastro trouxer validação — só o organismo muda. Usar **um** objeto `values` (não três `useState`) para que a troca seja mecânica.

**Stub de submit** mora no `LoginPage`, não no organismo (mantém o organismo puro e fácil de testar): seta `isSubmitting`, espera ~600ms, loga um `console.info` com `identifier`/`rememberMe` e um `TODO` apontando para `apps/api`. **Nunca logar a senha.** O `isSubmitting` volta ao `LoginForm` para desabilitar o botão e trocar o rótulo para `Entrando...`.

---

## 6. Testes

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
afterEach(() => { cleanup() })
```
O `cleanup` explícito é necessário porque `globals: false` desliga o auto-cleanup do RTL. O import `jest-dom/vitest` registra os matchers **e** aumenta os tipos para o `tsc -b`.

`src/test/utils.tsx` — `renderWithRouter(ui, { route = '/' })` envolvendo em `MemoryRouter` e devolvendo `userEvent.setup()` junto.

Um `.test.tsx` por componente, mais `src/lib/cn.test.ts`. O que cada um assegura:

- **Átomos** — comportamento e contrato: `Button` (children, `onClick`, `disabled` bloqueia, `iconRight` renderiza, default `type="button"`); `Input` (placeholder, `onChange` com o valor digitado, `invalid` → `aria-invalid`, props desconhecidas chegam ao DOM); `Checkbox` (`role="checkbox"`, reflete `checked`, dispara `onChange`); `Heading` (`getByRole('heading', { level })`); `Text` (tag via `as`, classe do `tone`); `TextLink` (`href` = `to`, `external` → `target="_blank"` + `rel="noreferrer"`); `Divider` (`role="separator"`); `ChainGlyph` (é `<svg>`, `aria-hidden="true"`, mescla `className`).
- **Moléculas** — `FormField` é o mais importante: `getByLabelText(label)` resolve no input (id/htmlFor ligados), digitar chama `onChange`, `error` renderiza a mensagem + `aria-invalid` + `aria-describedby`, sem `error` não há mensagem. `SocialButton`: nome acessível = `label`, `src` = `iconSrc`, `type="button"`. `SocialAuthButtons`: um botão por provider, clicar no Github chama `onSelect('github')`.
- **`LoginForm` — o teste central:** renderiza as cópias em pt-BR (`Login`, `Boas-vindas! Faça seu login.`, `Email ou usuário`, `Senha`, `Lembre-me`, `Esqueci a senha`, `ou entre com outras contas`, `Ainda não tem conta?`, `Crie seu cadastro!`); preencher os dois campos + marcar `Lembre-me` + submeter chama `onSubmit` **uma vez** com `{ identifier, password, rememberMe: true }`; `isSubmitting` desabilita o botão; `errorMessage` aparece; hrefs `/recuperar-senha` e `/cadastro` corretos.
- **`AuthLayout`** — renderiza children e três SVGs todos `aria-hidden`. **`LoginPage`** — integração: heading, banner, e o ciclo submit → `Entrando...` → volta ao ocioso.

Regra de estilo do suite: consultar por role/label/texto, `userEvent` em vez de `fireEvent`, e assertar string de classe Tailwind **só** no smoke test de variante de cada átomo — no resto, comportamento, para que restilizar não quebre teste.

---

## 7. Ordem de execução

0. Criar a pasta `plans/` na raiz do repo (ainda não existe, conforme o `CLAUDE.md`) e salvar este plano como `plans/tela-de-login.md`.
1. Instalar as deps (§1); confirmar que `pnpm --filter web dev` ainda sobe.
2. Config: reescrever `vite.config.ts`; `paths` no `tsconfig.app.json`; scripts nos dois `package.json`; `lang`/`title` no `index.html`.
3. `src/test/setup.ts` e `src/test/utils.tsx`.
4. Tokens e limpeza: substituir `index.css`; apagar `App.tsx`, `App.css`, `src/assets/*`, `public/icons.svg`; reescrever `main.tsx` com fontsource + `BrowserRouter` (rota `/login` apontando temporariamente para um `<div />` para manter o build verde).
5. `src/lib/cn.ts` + teste.
6. Átomos em ordem de dependência (`Text`, `Heading`, `Label`, `Input`, `Checkbox`, `Button`, `ArrowRightIcon`, `ChainGlyph`, `Divider`, `TextLink`), cada um com teste. Rodar `pnpm --filter web test`.
7. Moléculas + `src/constants/socialProviders.ts`, cada uma com teste.
8. Organismos: `AuthCard`, `SocialAuthSection`, `LoginForm` (aqui aterrissam as cópias em pt-BR).
9. `AuthLayout` e `LoginPage`; apontar a rota `/login` para a página real.
10. Passe visual: rodar o dev server e ajustar dimensões do card (~190px imagem, ~250px form), posições/opacidades dos elos e contraste do verde contra o print. Só mudam classes Tailwind e valores do `@theme` — nenhum teste deve quebrar.
11. Commit: `feat(web): tela de login com design atômico e tailwind`.

---

## Verificação

```bash
pnpm --filter web test      # vitest run — todas as suites verdes
pnpm --filter web lint      # oxlint — 0 erros
pnpm --filter web build     # tsc -b && vite build — typecheca os testes também
pnpm --filter web dev       # localhost:5173 → redireciona para /login
pnpm build && pnpm lint     # confirma que apps/api segue intacto
```

No browser: card centralizado em qualquer altura de viewport; elos sangram pelas duas bordas **sem** gerar scroll horizontal (`overflow-hidden` no layout); ordem de Tab = email → senha → Lembre-me → Esqueci a senha → Login → Github → Gmail → Crie seu cadastro; Enter dentro de um campo submete uma única vez; Poppins carregando do bundle (aba Network, zero requests externos).

## O que o cadastro herda pronto

`AuthLayout`, `AuthCard` (com `imagePosition="right"`), `FormField`, `CheckboxField`, `LabeledDivider`, `SocialButton`, `SocialAuthButtons`, `SocialAuthSection`, `AuthPrompt` e todos os átomos. Só devem precisar ser escritos `organisms/SignupForm` e `pages/SignupPage`.
