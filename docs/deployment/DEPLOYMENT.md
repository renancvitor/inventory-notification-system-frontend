# ☁️ Deployment Guide

## Estado atual

Este repositório ainda não possui pipeline de deploy automatizado para a aplicação frontend.

Os workflows existentes em `.github/workflows` estão voltados para automações de fluxo de trabalho
do repositório e não para build ou publicação da interface.

---

## Deploy manual

### Build de produção

```bash
npm install
npm run build
```

O artefato gerado ficará em `dist/inventory-notification-system-frontend`.

---

## Pré-requisitos para publicação

Antes de publicar a aplicação em qualquer ambiente, valide:

- URL correta da API em `environment.prod.ts`
- política de CORS compatível no backend
- envio de cookies e sessão habilitado entre frontend e backend
- estratégia de hospedagem para SPA com fallback de rotas

---

## Opções recomendadas de hospedagem

### Opção 1: Static hosting

Serviços como S3 + CloudFront, Netlify, Vercel ou Nginx servem bem este projeto,
desde que exista fallback para `index.html`.

### Opção 2: Servir build por Nginx

Adequado para ambientes simples ou quando frontend e backend compartilham infraestrutura.

---

## Checklist de publicação

1. Ajustar `environment.prod.ts`
2. Rodar `npm run build`
3. Publicar o conteúdo de `dist/inventory-notification-system-frontend`
4. Configurar fallback de rotas para SPA
5. Validar login, navegação protegida e chamadas autenticadas

---

## Evolução recomendada

O próximo passo natural é adicionar uma pipeline de CI/CD para:

- instalar dependências
- rodar testes
- gerar build de produção
- publicar artefato em ambiente estático

Isso aproxima o frontend do padrão operacional mais completo já documentado no backend.

<p align="right"><a href="../../README.md">🔄 Voltar para a documentação completa</a></p>
