# ☁️ Deployment Guide

## Objetivo

Este documento descreve o deploy do frontend em ambiente AWS com hospedagem via AWS Amplify, considerando a aplicação como um artefato estático gerado por Angular.

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

### Estratégia adotada: AWS Amplify Hosting

O deploy atual do projeto é feito via AWS Amplify.

Fluxo adotado:

1. gerar o build de produção
2. conectar o repositório ao AWS Amplify
3. executar o pipeline de build e publicação do artefato estático
4. disponibilizar a SPA em domínio Amplify ou domínio customizado
5. garantir fallback para `index.html` nas rotas da aplicação

---

## Pré-requisitos para publicação na AWS

Antes de publicar, valide:

- URL correta da API em `environment.prod.ts`
- política de CORS compatível no backend
- envio de cookies e sessão habilitado entre frontend e backend
- regra de rewrite da SPA com fallback para `index.html`
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
- `SameSite=None` no cookie de autenticação quando frontend e backend estiverem em origens diferentes

### 3. Fallback de rotas

Por se tratar de uma SPA, acessos diretos como `/orders` ou `/products/edit/1` precisam retornar `index.html`.

No contexto do AWS Amplify, isso deve ser tratado por regras de rewrite/redirect da hospedagem.

### 4. Configuração de build no Amplify

O AWS Amplify precisa executar a instalação de dependências e o build de produção do Angular.

Fluxo esperado no ambiente de publicação:

1. instalar dependências com `npm install`
2. gerar o build com `npm run build`
3. publicar o conteúdo gerado em `dist/inventory-notification-system-frontend/browser`

Se a configuração do projeto no Amplify for alterada, o diretório de saída precisa continuar compatível com o resultado atual do build Angular.

### 5. Domínio customizado

Quando a aplicação for publicada em domínio customizado, esse domínio também precisa estar liberado no backend para:

- CORS com credenciais
- envio de cookies autenticados
- chamadas de sessão como `/login` e `/auth/me`

---

## Checklist de publicação

1. Ajustar `environment.prod.ts`
2. Rodar `npm run build`
3. Confirmar no AWS Amplify o diretório de saída do build
4. Configurar regra de rewrite para SPA com fallback para `index.html`
5. Validar no backend CORS com credenciais e cookie autenticado com `SameSite=None; Secure`
6. Publicar a versão
7. Validar login, navegação protegida, cookies e chamadas autenticadas
8. Confirmar navegação direta em rotas internas como `/products`, `/orders`, `/users` e `/person`

---

## Observações operacionais

Pontos que merecem atenção após o deploy:

- `401` em `/auth/me` após login costuma indicar que o cookie não voltou ao backend
- `403` em endpoints protegidos após um `401` inicial normalmente é efeito secundário da sessão não reconhecida
- `404` em rotas internas da interface costuma indicar ausência de rewrite para `index.html`
- mudanças de domínio no Amplify exigem revisão da lista de origens permitidas no backend

## Alternativa de infraestrutura

Caso a hospedagem deixe de usar AWS Amplify no futuro, uma alternativa aceitável continua sendo servir o build estático por outra infraestrutura, desde que:

- o fallback de SPA esteja configurado
- a integração com o backend preserve cookies e CORS corretamente
- o diretório de saída do build Angular seja publicado corretamente

<p align="right"><a href="../../README.md">🔄 Voltar para a documentação completa</a></p>
