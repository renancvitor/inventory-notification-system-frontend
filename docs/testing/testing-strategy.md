# 🧪 Estratégia de Testes

Este documento descreve como os testes estão organizados hoje e quais direções são recomendadas para a evolução da cobertura.

---

## Situação atual

O projeto mantém arquivos `*.spec.ts` próximos aos arquivos testados, o que facilita leitura e manutenção.

Atualmente há cobertura distribuída por:

- componentes de página
- componentes compartilhados
- serviços
- guard de autenticação
- interceptors

Essa base cobre bem a infraestrutura principal e boa parte dos fluxos funcionais já implementados.

No estado atual do repositório, existem **33 arquivos `*.spec.ts`** em `src/app`.

---

## Execução

Os testes podem ser executados com:

```bash
npm test
```

Ou diretamente com:

```bash
ng test
```

---

## O que já está bem encaminhado

- testes próximos do código correspondente
- cobertura de infraestrutura importante, como guard e interceptors
- cobertura nas features centrais do domínio
- cobertura focada em fluxos recentes de autenticação, edição de pedidos e resolvers críticos
- consistência de nomenclatura com sufixo `.spec.ts`

---

## Prioridades de evolução

### 1. Reforçar fluxos críticos de autenticação

Manter forte cobertura sobre:

- login com sucesso e falha
- redirecionamento no primeiro acesso
- comportamento do guard em sessão inválida

### 2. Cobrir melhor listagens com filtros e paginação

As listagens são parte importante da experiência operacional.

Vale ampliar cenários como:

- montagem correta de filtros
- paginação
- estados vazios
- mensagens de erro
- variação de ações visíveis conforme o perfil autenticado

### 3. Garantir contratos de integração nos serviços

Os serviços concentram a comunicação com a API.

É recomendável reforçar testes para:

- endpoints corretos
- query params opcionais
- comportamento de cache com `shareReplay(1)`

### 4. Validar feedback visual e estados de loading

Os componentes de formulário e telas operacionais ganham muito com testes cobrindo:

- loading durante submissão
- desabilitação de ações
- exibição de mensagens de sucesso e erro
- comportamento responsivo em trechos críticos da interface quando houver regressão relevante de layout

---

## Lacunas documentadas

Hoje ainda não há, nesta pasta `docs`, uma política formal de:

- metas de cobertura
- critérios de teste por tipo de componente
- estratégia para testes de integração entre telas e serviços

Este documento passa a registrar esse ponto e serve como base para amadurecer a estratégia.

---

## Recomendação prática

À medida que o projeto crescer, vale adotar uma divisão mental simples:

- testes unitários para serviços, utilitários e regras locais
- testes de componente para interação, renderização e formulários
- testes de fluxo para jornadas críticas, especialmente autenticação, autorização por perfil e edição

<p align="right"><a href="../../README.md">🔄 Voltar para a documentação completa</a></p>
