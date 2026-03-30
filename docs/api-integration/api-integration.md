# 🌐 Integração com a API

Este documento resume como o frontend se integra com o backend, quais serviços existem hoje e quais contratos operacionais já aparecem no código.

---

## Base de integração

A URL base da API é definida em:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Todos os serviços utilizam `HttpClient` e enviam credenciais com `withCredentials: true`.

---

## Serviços por domínio

### `AuthService`

Responsável por:

- login
- logout
- verificação de sessão
- manutenção do usuário autenticado em memória

Endpoints utilizados:

- `POST /login`
- `POST /auth/logout`
- `GET /auth/me`

### `PersonService`

Responsável por operações de pessoas.

Endpoints utilizados:

- `GET /person`
- `POST /person`
- `GET /person/{id}`
- `DELETE /person/{id}`
- `PUT /person/{id}/activate`

### `UserService`

Responsável por usuários e permissões.

Endpoints utilizados:

- `GET /users`
- `GET /users/{id}`
- `PUT /users/type/{id}`
- `PUT /users/{id}/password`
- `DELETE /users/{id}`
- `PUT /users/{id}/activate`
- `GET /users/user-types`

### `ProductService`

Responsável por produtos e categorias.

Endpoints utilizados:

- `GET /products`
- `POST /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `PUT /products/{id}/activate`
- `PUT /products/{id}/categories`
- `GET /categories`

### `OrderService`

Responsável por pedidos e tipos de movimentação.

Endpoints utilizados:

- `GET /orders`
- `POST /orders`
- `GET /orders/{id}`
- `PUT /orders/{id}`
- `PUT /orders/{id}/approve`
- `PUT /orders/{id}/reject`
- `GET /movement-types`

---

## Padrões já adotados

### Query params montados dinamicamente

As listagens enviam filtros apenas quando o valor está presente. Isso evita ruído e torna as chamadas mais previsíveis.

### Serviços especializados por feature

Cada domínio possui seu próprio serviço, o que reduz acoplamento entre telas e mantém os contratos próximos do contexto funcional.

### Cache leve para dados de apoio

O projeto já usa `shareReplay(1)` em cenários de leitura recorrente:

- categorias de produto
- tipos de movimentação

Esse padrão evita requisições repetidas para dados mais estáveis durante a sessão de uso.

---

## Tratamento de erros da API

O `errorInterceptor` centraliza o comportamento de falhas HTTP.

Regras importantes:

- `401` esperado em login ou checagem de sessão não dispara mensagem global desnecessária
- `403` redireciona o usuário para `/login`
- mensagens de validação da API têm prioridade sobre mensagens genéricas

O componente visual de erro é exibido via `ErrorService`.

Além disso, algumas rotas críticas usam resolvers que redirecionam a navegação quando o preload obrigatório falha. Isso evita abrir telas de edição com estado inconsistente.

---

## Oportunidades de evolução

- criar uma camada explícita de `models/` por feature para separar contratos de API dos serviços
- padronizar tipos de filtros em arquivos próprios, principalmente para listagens mais ricas
- considerar adaptadores ou mappers se o contrato da API crescer em complexidade
- centralizar constantes de endpoints se a quantidade de recursos aumentar muito

---

## Próximos documentos úteis

Se a integração crescer, os próximos artefatos recomendados são:

- catálogo de endpoints consumidos por tela
- matriz frontend x backend por feature
- guia de ambientes com URLs, CORS e cookies

<p align="right"><a href="../../README.md">🔄 Voltar para a documentação completa</a></p>
