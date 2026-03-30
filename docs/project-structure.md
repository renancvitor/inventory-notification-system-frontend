<h1 align="center">Organização completa do Projeto</h1>

Este documento descreve a estrutura atual do frontend e registra melhorias arquiteturais recomendadas para a evolução do projeto.

---

## Visão Geral

O frontend segue uma organização majoritariamente orientada por feature, com separação entre:

- `core`: autenticação, interceptors e tratamento global de erro
- `features`: telas, formulários e serviços por domínio funcional
- `shared`: componentes reutilizáveis, layout e models genéricos
- raiz de `app`: configuração da aplicação e rotas

Essa base é consistente com um frontend Angular standalone, mas ainda há espaço para tornar a estrutura mais previsível à medida que o projeto crescer.

---

## Estrutura Atual

```plaintext
.github/
 └── workflows/

docs/
 ├── COMMIT_CONVENTION.md
 ├── api-integration/
 │    └── api-integration.md
 ├── authentication/
 │    └── authentication-flow.md
 ├── deployment/
 │    └── DEPLOYMENT.md
 ├── frontend-architecture/
 │    └── frontend-architecture.md
 ├── project-structure.md
 └── testing/
      └── testing-strategy.md

public/
 └── favicon.ico

src/
 ├── app/
 │    ├── core/
 │    │    ├── auth/
 │    │    │    ├── auth.guard.spec.ts
 │    │    │    ├── auth.guard.ts
 │    │    │    ├── auth.model.ts
 │    │    │    ├── auth.service.spec.ts
 │    │    │    └── auth.service.ts
 │    │    ├── errors/
 │    │    │    ├── api-error.model.ts
 │    │    │    ├── error.interceptor.ts
 │    │    │    └── error.service.ts
 │    │    └── http/
 │    │         ├── credentials.interceptor.spec.ts
 │    │         └── credentials.interceptor.ts
 │    ├── features/
 │    │    ├── auth/
 │    │    │    ├── login/
 │    │    │    │    ├── login.component.html
 │    │    │    │    ├── login.component.scss
 │    │    │    │    ├── login.component.spec.ts
 │    │    │    │    └── login.component.ts
 │    │    │    ├── services/
 │    │    │    │    └── update-password.model.ts
 │    │    │    └── update-password/
 │    │    │         ├── update-password-page.component.html
 │    │    │         ├── update-password-page.component.scss
 │    │    │         ├── update-password-page.component.ts
 │    │    │         ├── update-password.component.html
 │    │    │         ├── update-password.component.scss
 │    │    │         ├── update-password.component.spec.ts
 │    │    │         └── update-password.component.ts
 │    │    ├── home/
 │    │    │    ├── home.component.html
 │    │    │    ├── home.component.scss
 │    │    │    ├── home.component.spec.ts
 │    │    │    └── home.component.ts
 │    │    ├── order/
 │    │    │    ├── pages/
 │    │    │    │    ├── components/
 │    │    │    │    │    └── form/
 │    │    │    │    │         ├── order-form.component.html
 │    │    │    │    │         ├── order-form.component.scss
 │    │    │    │    │         ├── order-form.component.spec.ts
 │    │    │    │    │         └── order-form.component.ts
 │    │    │    │    ├── create/
 │    │    │    │    │    ├── order-create.component.html
 │    │    │    │    │    ├── order-create.component.scss
 │    │    │    │    │    ├── order-create.component.spec.ts
 │    │    │    │    │    └── order-create.component.ts
 │    │    │    │    ├── edit/
 │    │    │    │    │    ├── order-edit.component.html
 │    │    │    │    │    ├── order-edit.component.scss
 │    │    │    │    │    ├── order-edit.component.spec.ts
 │    │    │    │    │    └── order-edit.component.ts
 │    │    │    │    └── list/
 │    │    │    │         ├── order-list.component.html
 │    │    │    │         ├── order-list.component.scss
 │    │    │    │         ├── order-list.component.spec.ts
 │    │    │    │         └── order-list.component.ts
 │    │    │    └── services/
 │    │    │         ├── order-form.model.ts
 │    │    │         ├── order.model.ts
 │    │    │         ├── order.service.spec.ts
 │    │    │         └── order.service.ts
 │    │    ├── person/
 │    │    │    ├── components/
 │    │    │    │    └── form/
 │    │    │    │         ├── person-form.component.html
 │    │    │    │         ├── person-form.component.scss
 │    │    │    │         ├── person-form.component.spec.ts
 │    │    │    │         └── person-form.component.ts
 │    │    │    ├── pages/
 │    │    │    │    ├── create/
 │    │    │    │    │    ├── person-create.component.html
 │    │    │    │    │    ├── person-create.component.scss
 │    │    │    │    │    ├── person-create.component.spec.ts
 │    │    │    │    │    └── person-create.component.ts
 │    │    │    │    ├── edit/
 │    │    │    │    │    ├── person-edit.component.html
 │    │    │    │    │    ├── person-edit.component.scss
 │    │    │    │    │    ├── person-edit.component.spec.ts
 │    │    │    │    │    └── person-edit.component.ts
 │    │    │    │    └── list/
 │    │    │    │         ├── person-list.component.html
 │    │    │    │         ├── person-list.component.scss
 │    │    │    │         ├── person-list.component.spec.ts
 │    │    │    │         └── person-list.component.ts
 │    │    │    └── services/
 │    │    │         ├── person.model.ts
 │    │    │         ├── person.service.spec.ts
 │    │    │         └── person.service.ts
 │    │    ├── product/
 │    │    │    ├── components/
 │    │    │    │    └── form/
 │    │    │    │         ├── product-form.component.html
 │    │    │    │         ├── product-form.component.scss
 │    │    │    │         ├── product-form.component.spec.ts
 │    │    │    │         └── product-form.component.ts
 │    │    │    ├── pages/
 │    │    │    │    ├── create/
 │    │    │    │    │    ├── product-create.component.html
 │    │    │    │    │    ├── product-create.component.scss
 │    │    │    │    │    ├── product-create.component.spec.ts
 │    │    │    │    │    └── product-create.component.ts
 │    │    │    │    ├── edit/
 │    │    │    │    │    ├── product-edit.component.html
 │    │    │    │    │    ├── product-edit.component.scss
 │    │    │    │    │    ├── product-edit.component.spec.ts
 │    │    │    │    │    └── product-edit.component.ts
 │    │    │    │    └── list/
 │    │    │    │         ├── product-list.component.html
 │    │    │    │         ├── product-list.component.scss
 │    │    │    │         ├── product-list.component.spec.ts
 │    │    │    │         └── product-list.component.ts
 │    │    │    └── services/
 │    │    │         ├── product-form.model.ts
 │    │    │         ├── product.model.ts
 │    │    │         ├── product.service.spec.ts
 │    │    │         └── product.service.ts
 │    │    └── user/
 │    │         ├── pages/
 │    │         │    ├── edit/
 │    │         │    │    ├── user-edit.component.html
 │    │         │    │    ├── user-edit.component.scss
 │    │         │    │    ├── user-edit.component.spec.ts
 │    │         │    │    └── user-edit.component.ts
 │    │         │    └── list/
 │    │         │         ├── user-list.component.html
 │    │         │         ├── user-list.component.scss
 │    │         │         ├── user-list.component.spec.ts
 │    │         │         └── user-list.component.ts
 │    │         └── services/
 │    │              ├── user.model.ts
 │    │              ├── user.service.spec.ts
 │    │              ├── user.service.ts
 │    │              └── user-type.model.ts
 │    ├── shared/
 │    │    ├── components/
 │    │    │    ├── button/
 │    │    │    ├── error-snackbar/
 │    │    │    ├── filter-panel/
 │    │    │    ├── search-field/
 │    │    │    └── toast/
 │    │    ├── layout/
 │    │    │    ├── footer/
 │    │    │    └── header/
 │    │    ├── services/
 │    │    │    ├── pagination.model.ts
 │    │    │    └── toast.model.ts
 │    │    └── paginator-intl.ts
 │    ├── app.component.html
 │    ├── app.component.scss
 │    ├── app.component.spec.ts
 │    ├── app.component.ts
 │    ├── app.config.ts
 │    └── app.routes.ts
 ├── environments/
 │    ├── environment.prod.ts
 │    └── environment.ts
 ├── index.html
 ├── main.ts
 └── styles.scss

angular.json
package.json
README.md
tsconfig.json
```

---

## Responsabilidades por Área

### `src/app/core`

Camada transversal da aplicação. Hoje ela concentra:

- autenticação e sessão
- guardas de rota
- autorização de acesso por tipo de usuário
- interceptors HTTP
- tratamento global de erro

Ponto positivo: os elementos mais sensíveis do fluxo global não estão misturados com features.

Ponto de atenção: o diretório `http` possui apenas o interceptor de credenciais, enquanto parte da responsabilidade HTTP também aparece em `errors/error.interceptor.ts`. Isso ainda é aceitável, mas tende a ficar disperso quando novos interceptors surgirem.

### `src/app/features`

Camada principal de negócio e interface. O projeto já está relativamente alinhado a uma organização por domínio:

- `auth`
- `home`
- `order`
- `person`
- `product`
- `user`

Ponto positivo: cada feature encapsula páginas, componentes internos e serviço de integração correspondente.

Ponto de atenção: há diferenças de profundidade entre features. `order` usa `pages/components/form`, enquanto `person` e `product` usam `components/form` na raiz da feature. Isso reduz previsibilidade.

### `src/app/shared`

Contém elementos reutilizáveis e de infraestrutura visual:

- botões
- snackbar e toast
- filtro e busca
- header e footer
- modelos genéricos de paginação

Ponto positivo: evita duplicação entre telas.

Ponto de atenção: o subdiretório `shared/services` guarda apenas tipos (`pagination.model.ts` e `toast.model.ts`). O nome `services` não representa bem o conteúdo atual.

### Raiz de `src/app`

Concentra bootstrap e composição:

- `app.routes.ts`
- `app.config.ts`
- `app.component.*`

Esse arranjo está adequado para Angular standalone.

---

## Inconsistências Atuais

### Organização interna das features

- `order/pages/components/form` usa uma profundidade diferente das demais features.
- `auth/services/update-password.model.ts` guarda apenas um model em uma pasta chamada `services`.
- `shared/services` contém modelos, não serviços.

### Naming

- `usertype.model.ts` foge do padrão esperado. O nome mais consistente seria `user-type.model.ts`.
- há mistura entre arquivos `*.model.ts` e `*.form.model.ts` sem uma convenção documentada para diferenciar payload, DTO de tela e resposta da API.
- componentes de página usam tanto nomes baseados em ação (`person-create.component.ts`) quanto em contexto (`update-password-page.component.ts`). A distinção é compreensível, mas hoje não está formalizada.

### Rotas

- todas as rotas estão centralizadas em `app.routes.ts`, o que funciona no tamanho atual.
- conforme novas features surgirem, esse arquivo tende a crescer rápido e dificultar manutenção.

---

## Melhorias Recomendadas

### 1. Padronizar a anatomia das features

Adotar uma convenção única por feature, por exemplo:

```plaintext
features/<feature>/
 ├── components/
 ├── pages/
 ├── models/
 ├── services/
 └── utils/
```

Benefícios:

- reduz assimetria entre módulos
- acelera onboarding
- facilita extração futura para lazy routes ou bibliotecas internas

### 2. Separar models de services

Hoje vários `*.model.ts` estão dentro de `services/`. O ideal é migrar gradualmente para:

- `models/` para contratos de API, view models e payloads
- `services/` apenas para classes/funções de acesso e orquestração

Essa mudança melhora legibilidade e reduz acoplamento conceitual.

### 3. Criar rotas por feature

Quando o projeto crescer, vale quebrar `app.routes.ts` em arquivos por domínio, por exemplo:

```plaintext
features/product/product.routes.ts
features/order/order.routes.ts
features/user/user.routes.ts
```

`app.routes.ts` passaria a compor apenas a árvore principal.

### 4. Consolidar a estratégia HTTP

Centralizar conceitos HTTP em uma convenção mais explícita:

- `core/http/interceptors/`
- `core/http/models/`
- `core/http/utils/`

Isso ajuda a acomodar crescimento sem espalhar responsabilidades.

---

## Consideração Final

A estrutura atual já é suficiente para o porte do projeto e demonstra boa base para evolução. As melhorias sugeridas aqui não são correções urgentes, mas sim passos naturais para manter consistência conforme o frontend ganhar mais fluxos, regras de autorização e variações de interface.

<p align="right"><a href="../README.md">🔄 Voltar para a documentação completa</a></p>
