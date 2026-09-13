# Tela de Cadastro (apps/web) — Alinhamento ao Figma + reuso do design system

## Context

A tela de login (`25b310b`) trouxe o design atômico, o Tailwind v4 e a suíte de testes, mas foi construída antes de o Figma do projeto (`node-id=155-3469`) ter sido conferido a fundo. Comparando os dois frames do arquivo — `155:3802` (Login) e `155:3484` (Cadastro) — com o código existente, ficaram claras divergências de tokens (fonte, cores, raios, escala tipográfica) e de estrutura (ícones desenhados à mão em vez dos glifos Material do Figma, ausência do logo "code connect" sobre o banner, tile circular nos botões sociais que o Figma não tem).

Como o pedido do usuário prioriza o layout do Figma sobre o que já existe, este trabalho fez duas coisas na mesma branch: realinhou o design system compartilhado aos tokens do Figma (o que também corrige visualmente o login) e construiu a tela de cadastro em cima desse design system corrigido — maximizando reuso e evitando duas telas com aparências diferentes.

Resultado: `/login` e `/cadastro` renderizando fiéis ao Figma, sobre os mesmos átomos/moléculas/organismos.

---

## 1. Tokens (`apps/web/src/index.css`)

Tailwind v4 é CSS-first — os tokens do Figma foram mapeados diretamente para variáveis `@theme`, substituindo a paleta anterior (que não vinha do Figma):

| Token | Valor | Origem Figma |
|---|---|---|
| `--color-canvas` | `#00090E` | Grafite |
| `--color-card` / `--color-card-border` | `#171D1F` / `#00090E` | Cinza Escuro |
| `--color-field` / `--color-field-ink` | `#888888` / `#171D1F` | Cinza médio (fundo do input + texto escuro dentro dele) |
| `--color-ink` | `#E1E1E1` | Offwhite |
| `--color-brand` / `--color-brand-ink` | `#81FE88` / `#132E35` | Verde destaque / Verde petróleo |
| `--font-sans` | `'Prompt'` | família tipográfica do arquivo |
| `--text-label/small/body/subtitle/heading` | 12.5/15/18/22/31px, line-height 1.5 | escala do Figma |
| `--radius-card` / `--radius-field` / `--radius-button` | 32px / 4px / 8px | raios observados nos frames |

Fonte trocada de `@fontsource/poppins` para `@fontsource/prompt` (pesos 400 e 600, os únicos usados) em `apps/web/package.json` e nos imports de [main.tsx](apps/web/src/main.tsx).

---

## 2. Assets (`apps/web/public/`)

Baixados do Figma via MCP (os links de asset expiram em ~7 dias — os arquivos abaixo já estão versionados como bytes, não como referência):

- `login-banner.png` / `signup-banner.png` — renderização (`get_screenshot`) dos nós de imagem `155:3806` e `155:3498`, um por tela. Substituíram o único `main-banner.png` anterior.
- `check.svg` — glifo de check do checkbox, exportado do componente Figma.
- `git-logo.svg` / `google-logo.svg` — mantidos (já batiam com o Figma).

O logo "code connect" **não** é um asset estático: é o átomo `Logo` (ver §3), reconstruído a partir dos três SVGs exportados do nó `155:3809`/`140:1887` (marca em elo + wordmark em duas cores), para poder ser reutilizado em outros lugares e recolorido via tokens.

---

## 3. Átomos novos/alterados (`apps/web/src/components/atoms/`)

- **`ArrowRightIcon`** — trocado o traçado desenhado à mão pelo glifo Material `arrow_forward` (24px, `fill="currentColor"`).
- **`LoginIcon`** *(novo)* — glifo Material `login`, usado no prompt "Faça seu login!" do cadastro.
- **`AssignmentIcon`** *(novo)* — glifo Material `assignment`, usado no prompt "Crie seu cadastro!" do login.
- **`Logo`** *(novo)* — wordmark inline reconstruído dos paths reais do Figma; `className` opcional.
- **`Heading` / `Text` / `Label`** — escalas remapeadas para os tokens `text-heading/subtitle/body/small/label`; `Label` ganhou `size`/`tone` para servir tanto o rótulo de campo (18px) quanto o do checkbox (15px, `ink-muted`).
- **`Input`** — fundo `bg-field`, texto `text-field-ink` (escuro sobre claro, como no Figma), sem borda, raio 4px.
- **`Checkbox`** — `<input type="checkbox">` nativo restilizado (`appearance-none` + `check.svg` como `background-image` quando `:checked`), preservando a acessibilidade nativa que os testes usam (`getByRole('checkbox')`).
- **`Button`** — `primary` em `bg-brand`/`text-brand-ink`, raio 8px, `text-body font-semibold`.
- **`TextLink`** — ganhou `underline` (usado em "Esqueci a senha") e `gap-3` até o ícone, como no Figma.
- **`ChainGlyph`** — path do elo trocado pelo SVG real exportado do nó `155:3477` (antes eram dois `<rect>` aproximados).

---

## 4. Moléculas e `constants/socialProviders.ts`

- **`SocialProvider`** ganhou `iconWidth`/`iconHeight` opcionais (Github 33×32, Google 28×28) — os dois ícones sociais têm proporções diferentes no Figma, então um tamanho único (o tile circular anterior) distorcia um deles.
- **`SocialButton`** — removido o tile circular (`rounded-full border bg-field`); a imagem é renderizada crua, nas dimensões do provider, como no Figma.
- **`AuthPrompt`** — ganhou `layout?: 'stacked' | 'inline'` (default `stacked`, usado no login) para cobrir também o layout horizontal do cadastro ("Já tem conta? Faça seu login!" lado a lado). O `icon` deixou de ter default (`ArrowRightIcon`) porque login e cadastro agora usam ícones diferentes (`AssignmentIcon`/`LoginIcon`).
- **`FormField` / `CheckboxField` / `LabeledDivider`** — sem mudança de contrato, só ajuste de `gap` para a métrica do Figma. `FormField` é o ponto principal de reuso do cadastro.

---

## 5. Organismos, template e páginas

- **`AuthCard`** — reescrito para o layout do Figma: `rounded-card border-card-border`, colunas 407px (imagem) / 346px (form), `<Logo>` sobreposto ao banner via `absolute` (nova prop `showLogo`, default `true`). Empilha em coluna abaixo de `sm`.
- **`SocialAuthSection`** — `gap-2` (era `gap-4`).
- **`LoginForm`** — alinhado ao Figma: "Lembrar-me" (era "Lembre-me") e "Esqueci a senha" movidos para dentro do grupo do campo Senha, como no frame; prompt final usa `layout="stacked"` + `AssignmentIcon`.
- **`SignupForm`** *(novo, [SignupForm.tsx](apps/web/src/components/organisms/SignupForm/SignupForm.tsx))* — espelha o `LoginForm` reaproveitando `FormField`, `CheckboxField`, `Button`, `SocialAuthSection`, `AuthPrompt`: campos Nome/Email/Senha, checkbox "Lembrar-me" sem link de recuperação, botão "Cadastrar", e o prompt final em `layout="inline"` + `LoginIcon` apontando para `/login`. Mesmo padrão de estado do `LoginForm` — um `useState` só, sem biblioteca de formulário, validação via `required` nativo.
- **`AuthLayout`** — removido o gradiente radial e reduzido de três para dois `ChainGlyph` (topo-esquerda / base-direita), como no Figma.
- **`SignupPage`** *(novo)* — espelha [LoginPage.tsx](apps/web/src/components/pages/LoginPage/LoginPage.tsx): `AuthLayout` → `AuthCard` (banner do cadastro) → `SignupForm`, com o mesmo stub `async` (600ms + `console.info`, sem logar a senha).
- **`LoginPage`** — banner trocado para `/login-banner.png`.
- **[main.tsx](apps/web/src/main.tsx)** — nova rota `/cadastro` → `SignupPage` (antes referenciada pelo `LoginForm` mas inexistente).

---

## 6. Testes

Todos os componentes tocados tiveram os testes existentes ajustados (rótulos, classes, contagem de glifos) e os componentes novos ganharam suíte própria, seguindo a convenção já estabelecida (`describe/it/expect` explícitos de `vitest`, queries por role/label, `userEvent`, `renderWithRouter` para o que usa `TextLink`). Resultado: 27 arquivos de teste, 84 testes, todos verdes (`pnpm --filter web test`).

---

## Verificação

```bash
pnpm --filter web test     # vitest run — 27 arquivos, 84 testes
pnpm --filter web lint     # oxlint — sem erros
pnpm --filter web build    # tsc -b && vite build — build de produção ok
pnpm dev:web               # conferência visual manual em /login e /cadastro
```
