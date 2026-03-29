# 🔐 Fluxo de Autenticação

Este documento descreve o comportamento atual de autenticação, sessão e controle de acesso do frontend.

---

## Visão geral

O frontend utiliza autenticação baseada em sessão com credenciais HTTP enviadas em todas as chamadas relevantes.

Os elementos centrais do fluxo são:

- `AuthService`
- `authGuard`
- `authInterceptor`
- `errorInterceptor`

---

## Login

O login acontece em `features/auth/login/login.component.ts`.

Fluxo:

1. O usuário informa e-mail e senha.
2. O formulário valida obrigatoriedade, formato de e-mail e tamanho mínimo da senha.
3. O `AuthService` envia `POST /login`.
4. Em caso de sucesso, o usuário é redirecionado:
   - para `/update-password` se `firstAccess` for `true`
   - para `/` nos demais casos

---

## Sessão autenticada

O `AuthService` mantém em memória:

- status de autenticação
- usuário autenticado

Quando a aplicação ainda não tem o estado em memória, o `authGuard` consulta `checkSession()` via `GET /auth/me`.

Se a sessão for válida:

- o usuário continua na rota solicitada
- ou é redirecionado para atualização de senha no primeiro acesso

Se a sessão não for válida:

- o usuário é redirecionado para `/login`

---

## Primeiro acesso

O projeto possui uma regra de negócio importante:

- se `currentUser.firstAccess` for `true`, o usuário deve atualizar a senha antes de continuar usando a aplicação

Essa regra é aplicada no `authGuard`.

Após atualização bem-sucedida:

- o frontend limpa a flag local com `clearFirstAccess()`
- o usuário recebe feedback visual
- a navegação pode seguir para a tela inicial

---

## Guard de rotas

O `authGuard` protege as rotas autenticadas e também controla o desvio para a atualização obrigatória de senha.

Hoje ele é aplicado nas rotas de:

- home
- update-password
- person
- users
- products
- orders

---

## Interceptors envolvidos

### `authInterceptor`

Adiciona `withCredentials: true` às requisições.

### `errorInterceptor`

Trata falhas ligadas a autenticação e sessão:

- ignora `401` esperados de login incorreto
- ignora `401` esperados de checagem de sessão
- em `403`, mostra mensagem e redireciona para login

---

## Pontos de atenção

- o estado de autenticação principal fica em memória; após reload, a sessão é reidratada por `checkSession()`
- a proteção atual depende do backend responder corretamente aos endpoints de sessão
- a experiência de primeiro acesso já está embutida no fluxo principal da aplicação

---

## Melhorias futuras recomendadas

- documentar visualmente esse fluxo com GIFs ou screenshots, se houver interesse em aproximar ainda mais o padrão do backend
- agrupar rotas protegidas sob uma configuração comum para reduzir repetição de `canActivate`
- avaliar um facade de autenticação caso novos estados de sessão sejam adicionados

<p align="right"><a href="../../README.md">🔄 Voltar para a documentação completa</a></p>
