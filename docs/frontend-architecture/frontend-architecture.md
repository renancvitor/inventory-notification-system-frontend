# 🧭 Arquitetura do Frontend

Este documento descreve a arquitetura atual do frontend e as decisões centrais de organização adotadas no projeto.

---

## Visão geral

O frontend foi construído com [Angular](https://angular.dev/) utilizando componentes standalone e organização por feature.

O objetivo da aplicação é fornecer uma interface operacional para o domínio de estoque, consumindo a API REST do backend com foco em:

- autenticação de sessão
- navegação protegida
- autorização por perfil de usuário
- listagens com filtros e paginação
- formulários de criação e edição
- feedback visual para sucesso e erro
- comportamento responsivo para desktop e mobile

---

## Organização principal

O código é dividido em três áreas centrais:

- `core`: autenticação, interceptors, erros e infraestrutura transversal
- `features`: implementação dos fluxos de negócio da interface
- `shared`: componentes reutilizáveis, layout e contratos utilitários

Essa divisão reduz acoplamento entre as telas e mantém responsabilidades mais claras.

---

## Padrão por feature

As features seguem, em geral, esta composição:

- `pages/`: componentes vinculados a rotas
- `components/`: componentes internos reutilizáveis da própria feature
- `services/`: consumo da API e contratos próximos do domínio

Exemplos já presentes no projeto:

- `person`: formulário reutilizável e páginas de listagem, criação e edição
- `product`: listagem, edição, criação e carregamento de categorias
- `order`: criação, listagem, edição e ações operacionais de aprovação/reprovação

---

## Fluxo técnico da aplicação

O fluxo principal funciona assim:

1. O bootstrap registra providers em `app.config.ts`.
2. As rotas são declaradas em `app.routes.ts`.
3. O `authGuard` valida sessão antes de liberar páginas protegidas.
4. Os componentes acionam serviços específicos por domínio.
5. Os interceptors anexam credenciais e tratam erros padronizados.
6. Componentes compartilhados exibem notificações e feedbacks visuais.

---

## Autenticação e sessão

A autenticação é baseada em sessão HTTP com `withCredentials: true`.

Pontos relevantes da implementação atual:

- login via `AuthService`
- verificação de sessão com `/auth/me`
- redirecionamento para `/login` quando a sessão não é válida
- redirecionamento obrigatório para `/update-password` no primeiro acesso
- normalização do tipo de usuário retornado pelo backend para regras de autorização no frontend
- helpers de permissão reutilizáveis no `AuthService`

Esse fluxo está detalhado em [Fluxo de Autenticação](../authentication/authentication-flow.md).

---

## Integração com API

Cada domínio possui um serviço dedicado para comunicação com o backend:

- `PersonService`
- `UserService`
- `ProductService`
- `OrderService`

Alguns serviços fazem cache de dados auxiliares com `shareReplay(1)`, como:

- categorias de produto
- tipos de movimentação

Mais detalhes estão em [Integração com a API](../api-integration/api-integration.md).

---

## Tratamento de erros

O tratamento de erros é centralizado em duas peças:

- `errorInterceptor`: interpreta respostas HTTP e decide o comportamento
- `ErrorService`: renderiza mensagens com `MatSnackBar`

Regras já implementadas:

- `401` esperado em `/auth/me` e `/login` não dispara erro global indevido
- `403` redireciona para login com mensagem de sessão expirada
- erros de validação priorizam a primeira mensagem retornada pela API

---

## Roteamento

As rotas são centralizadas em `app.routes.ts` e cobrem:

- login
- home
- atualização de senha
- pessoas
- usuários
- produtos
- pedidos

O projeto já usa resolvers em rotas que dependem de dados prévios, como:

- categorias antes de criar/editar produto
- pedido, produtos e tipos de movimentação antes de editar pedido

Nas rotas de edição, esses resolvers também evitam abrir a tela quando o preload obrigatório falha, redirecionando o usuário para a listagem correspondente.

Além da autenticação, parte das rotas protegidas declara `allowedUserTypes`, permitindo bloquear navegação para áreas administrativas ou operacionais incompatíveis com o perfil autenticado.

Na camada visual, o header e as páginas de listagem também ocultam links, botões e ações que o usuário não pode executar.

### Matriz de acesso atual

- `ADMIN`: acesso completo, incluindo pessoas, usuários, produtos e pedidos
- `PRODUCT_MANAGER`: acesso operacional a produtos e revisão de pedidos
- `COMMON`: acesso focado em pedidos e movimentações sem áreas administrativas

No caso dos pedidos, a interface ainda respeita regras contextuais do backend, como permitir edição apenas ao solicitante do pedido enquanto o status estiver pendente.

---

## Responsividade

O projeto adota responsividade como requisito funcional da interface, não apenas como acabamento visual.

Hoje isso aparece principalmente em:

- header com navegação desktop e menu mobile
- formulários com reorganização vertical em breakpoints menores
- componentes de pedido com versões adaptadas para tabela e cards mobile
- controles de ação com empilhamento em telas menores

Como o sistema tem caráter operacional, vale ressaltar essa característica na documentação principal, mas de forma objetiva. Ela ajuda a contextualizar a experiência real de uso sem transformar a responsividade no foco central do projeto.

---

## Estratégia de estado

O estado hoje é majoritariamente local a componentes e serviços.

Esse modelo funciona bem para o porte atual porque:

- reduz complexidade inicial
- evita introdução prematura de store global
- mantém a lógica próxima de cada fluxo

Se as telas crescerem em orquestração de filtros, cache e múltiplas ações simultâneas, a próxima evolução natural é introduzir facades por feature.

---

## Direções de evolução

As melhorias mais relevantes para a próxima fase são:

- separar `models/` de `services/` dentro das features
- padronizar a localização de componentes internos
- agrupar rotas por feature com `children`
- preparar lazy loading para áreas maiores
- introduzir facades nas listagens mais ricas

<p align="right"><a href="../../README.md">🔄 Voltar para a documentação completa</a></p>
