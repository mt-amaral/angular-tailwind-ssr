# SPA Client-side em Angular

Projeto simples de autenticação, navegação, listagens e telas administrativas. A base está montada em **Angular 21 + TypeScript** (standalone, zoneless), usando **PrimeNG**, **Tailwind CSS v4**, **TanStack Query (Angular)** e **Zod**. Versão Angular do `app-base` (React).

<img alt="Home" src="docs/home.png" width="100%">
<img alt="Sign in" src="docs/sign-in.png" width="100%">

### Backend

- Backend usado: https://github.com/mt-amaral/api-base

---

# Visão geral

O projeto foi pensado como uma base frontend para painel administrativo, para ser usado como template rápido para futuros projetos. É o equivalente em **Angular** ao `app-base` (React), mantendo o mesmo backend e o mesmo padrão de autenticação.

---

## Stack

- **Angular 21** (standalone, zoneless)
- **TypeScript**
- **Tailwind CSS v4**

## UI e componentes

- **PrimeNG** (preset Material)
- **PrimeIcons**
- **PrimeNG Toast** (`MessageService`)
- **ngx-loading-bar** (barra de progresso no topo)

## Dados, rotas e estado

- **Angular Router** (com guards funcionais)
- **TanStack Query (Angular)**
- **HttpClient** (com interceptor)
- **Angular Signals** (estado)

## Formulários e validação

- **Angular Reactive Forms**
- **Zod**

---

# Autenticação

Pelo `main.ts` + `core/interceptor/api.interceptor.ts`, o projeto já está preparado para tratar erros comuns da API. A validação é feita nos cookies com `http only` (`withCredentials`). Dados de login: consulte o seed do backend.

O interceptor centraliza:

- prefixo da base URL (`environment.apiUrl`) e `withCredentials` em toda request
- toasts de sucesso/erro (4xx → aviso, 5xx → erro) via PrimeNG
- fluxo de **refresh token** no `401` (com fila de requests concorrentes) e redirect pro sign-in quando a sessão expira
- probe de sessão silencioso (`CheckMe`/`Refresh` não geram toast)

Isso deixa o comportamento centralizado e evita tratar tudo manualmente em cada tela.

---

## 1. Router e Guards

O projeto usa o **Angular Router** com **guards funcionais**:

- `authGuard` — **protegido por padrão** (tudo sob o layout exige sessão; redireciona pro `/auth/sign-in` com `returnUrl`)
- `guestGuard` — telas de auth só pra quem não está logado (redireciona logado pra `/`)

Marcar uma página como protegida = colocá-la sob o layout; pública = sob `auth`/`errors`.

## 2. Query centralizada

O **TanStack Query (Angular)** já está plugado via `provideTanStackQuery(new QueryClient())` — use `injectQuery` / `injectMutation` nos componentes. O tratamento global de erro e o refresh ficam no interceptor do `HttpClient`, casando com o padrão de retorno do backend (`ApiResponse<T>` / `PagedResponse<T>` / `PaginationRequest`).

## 3. Tema e componentes

O projeto usa **PrimeNG** com preset **Material** e a cor primária customizada (`#e11d48`, rose) centralizada pra casar com o Tailwind. Dark mode via `ThemeService` (classe `.dark` no `<html>`), alternável pelo toggle no header. Ícones com **PrimeIcons** (`pi pi-*`).

---

## Camada de API

Os services em `core/services/` espelham os controllers do `api-base`:

- `account` — `login`, `checkMe`, `refresh`, `logout`
- `user` — `listUsers`, `create`, `update`, `updateLogged`, `delete`
- `role` — `listRoles`, `listAllRoles`, `create`, `update`, `delete`
- `role-claim` — `getByRoleId`, `update`

Tipos compartilhados: `ApiResponse<T>`, `PagedResponse<T>`, `PaginationRequest`.

---

## Como rodar

### Opção 1: rodar com npm

```bash
npm install
npm start
```

A aplicação sobe pelo `ng serve` na porta **5173** (definida no `angular.json`) → http://localhost:5173.

Build de produção:

```bash
npm run build
```

Saída em `dist/`.

---

# Integração com backend

Esse frontend foi feito para trabalhar junto com:

- https://github.com/mt-amaral/api-base

Então a ideia é:

- `angular-tailwind` e `api-base` no mesmo diretório
- O backend libera **CORS** para `http://localhost:5173` (por isso o front roda nessa porta)
- Autenticação por cookie `http only`

---

### Temas

Para customizar o tema do PrimeNG (presets e cores), vale usar:

- https://primeng.org/theming
- Designer: https://primeng.org/designer

### Base do projeto

- Template Angular base: https://github.com/lannodev/angular-tailwind

---

## Links

- Frontend: https://github.com/mt-amaral/angular-tailwind
- Backend: https://github.com/mt-amaral/api-base
- PrimeNG: https://primeng.org
- Template base: https://github.com/lannodev/angular-tailwind
