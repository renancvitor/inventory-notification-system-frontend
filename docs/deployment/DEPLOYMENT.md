# ☁️ Deployment Guide

## Objetivo

Este documento foca no deploy do frontend em ambiente AWS, considerando a aplicação como um artefato estático gerado por Angular.

---

## Build de produção

Antes da publicação:

```bash
npm install
npm run build
```

O artefato gerado ficará em `dist/inventory-notification-system-frontend`.

---

## Deploy na AWS

### Opção recomendada: S3 + CloudFront

Para este projeto, a estratégia mais aderente é publicar o build estático em um bucket S3 e entregar a aplicação via CloudFront.

Fluxo recomendado:

1. gerar o build de produção
2. publicar o conteúdo de `dist/inventory-notification-system-frontend` em um bucket S3
3. configurar distribuição CloudFront apontando para esse bucket
4. garantir fallback para SPA, servindo `index.html` nas rotas da aplicação

---

## Pré-requisitos para publicação na AWS

Antes de publicar, valide:

- URL correta da API em `environment.prod.ts`
- política de CORS compatível no backend
- envio de cookies e sessão habilitado entre frontend e backend
- distribuição com fallback para `index.html`
- domínio e certificado configurados, se houver ambiente público

---

## Configurações importantes

### 1. `environment.prod.ts`

A URL da API de produção deve apontar para o backend publicado.

### 2. CORS e cookies

Como a autenticação depende de sessão/cookies, backend e frontend precisam estar configurados de forma compatível para:

- `withCredentials`
- origem permitida
- cookies seguros em produção

### 3. Fallback de rotas

Por se tratar de uma SPA, acessos diretos como `/orders` ou `/products/edit/1` precisam retornar `index.html`.

No contexto AWS, isso normalmente é tratado na distribuição do CloudFront.

---

## Checklist de publicação

1. Ajustar `environment.prod.ts`
2. Rodar `npm run build`
3. Publicar o conteúdo de `dist/inventory-notification-system-frontend` no S3
4. Configurar distribuição CloudFront com fallback para SPA
5. Validar login, navegação protegida, cookies e chamadas autenticadas
6. Confirmar navegação direta em rotas internas como `/products`, `/orders` e `/users`

---

## Alternativa de infraestrutura

Caso o projeto não seja publicado com S3 + CloudFront, outra alternativa aceitável é servir o build por Nginx em EC2 ou outra infraestrutura equivalente, desde que:

- o fallback de SPA esteja configurado
- a integração com o backend preserve cookies e CORS corretamente

<p align="right"><a href="../../README.md">🔄 Voltar para a documentação completa</a></p>
