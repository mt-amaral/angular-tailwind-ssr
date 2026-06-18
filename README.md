# SSR (Server-Side Rendering) em Angular

Versão **SSR** do template [angular-tailwind](https://github.com/mt-amaral/angular-tailwind): mesma ideia, padrão, cores e componentes, porém **renderizada no servidor** (Angular SSR + Node/Express) em vez de client-side. Stack: **Angular 21 + TypeScript** (standalone, zoneless), **PrimeNG**, **Tailwind CSS v4**, **TanStack Query (Angular)** e **Zod**.

### Backend

- Backend usado: https://github.com/mt-amaral/api-base

---

# O que muda no SSR (vs. angular-tailwind)

- Bootstrap via `app.config.ts` + `app.routes.ts` (`provideRouter`), com `provideClientHydration(withEventReplay())`; no servidor, `provideServerRendering(withRoutes(serverRoutes))`.
- Arquivos de servidor: `src/main.server.ts`, `src/app/app.config.server.ts`, `src/app/app.routes.server.ts` (rotas em `RenderMode.Server`) e `src/server.ts` (Express + `AngularNodeAppEngine`).
- **Auth no servidor**: o interceptor encaminha o header `Cookie` do request recebido (token `REQUEST`) para a API, então `CheckMe`/guards autenticam durante o SSR.
- **Browser-safety**: `ThemeService` e `LayoutComponent` usam `inject(DOCUMENT)` + `isPlatformBrowser`/`afterNextRender`; o estado de refresh do interceptor foi isolado por request (`RefreshCoordinator`) para não vazar entre usuários no servidor.
- **Tema sem flash**: o tema é lido de cookie no servidor (classe `.dark` já vem no HTML renderizado); no browser persiste em `localStorage` + cookie.
- App **zoneless** mantido (sem `zone.js`); `polyfills.ts` removido.

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

### Dev (com SSR)

```bash
npm install
npm start
```

O `ng serve` na porta **5173** (definida no `angular.json`) já renderiza no servidor em desenvolvimento → http://localhost:5173.

### Produção (build + servidor Node)

```bash
npm run build
npm run serve:ssr:angular-tailwind-ssr
```

O `build` gera `dist/angular-tailwind-ssr/browser` (cliente) e `dist/angular-tailwind-ssr/server` (servidor). O `serve:ssr` sobe o Express/Node em http://localhost:4000 (porta configurável via `PORT`).

> A aplicação é executada pelo desenvolvedor (Rider/terminal). O backend (`api-base`) precisa estar acessível pelo processo Node do SSR para o `CheckMe` autenticar no servidor — em dev com `https://localhost:8091` (certificado self-signed) pode ser necessário `NODE_EXTRA_CA_CERTS` ou apontar o `apiUrl` para um host alcançável.

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
