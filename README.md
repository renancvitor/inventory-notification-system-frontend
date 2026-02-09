<h1 id="inicio" align="center">Sistema de Notificação de Estoque — Frontend <br>
<img src="https://img.shields.io/badge/Status-In%20Progress-yellow" width="150" height="30">
</h1>
<p align="center">Interface operacional para gerenciamento de estoque baseada em estados e eventos de negócio.</p>

<!-- Troque o texto e a cor do badge conforme o status do projeto:
     Status-Completed-brightgreen   → Projeto concluído
     Status-In%20Progress-yellow    → Projeto em andamento
     Status-Paused-orange           → Projeto pausado
     Status-Canceled-red            → Projeto cancelado
     Exemplo de uso:
     https://img.shields.io/badge/Status-Completed-brightgreen
-->

---

<h2 align="center">🔗 Backend</h2>
O backend deste sistema está em um repositório separado:

- 🌐 [Sistema de Notificação de Estoque — API RESTful](https://github.com/renancvitor/inventory-notification-system-backend)

Consulte-o para compreender as regras de negócio e o modelo de domínio.

---

### 📊 Progresso do Projeto

Planejamento, tarefas e histórico de evolução disponíveis no GitHub Projects:

- 🗺️ [Inventory System - Roadmap](https://github.com/users/renancvitor/projects/2/views/1)

---

<h2 align="center">📑 Sumário</h2>

- [Visão Geral do Projeto](#visao-geral-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Ferramentas Utilizadas](#ferramentas-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Contribuições](#contribuições)
- [Contato](#contato)
- [Licença](#licenca)

---

<h2 id="visao-geral-do-projeto" align="center">Visão Geral do Projeto</h2>

O **Sistema de Notificação de Estoque — Frontend** é uma aplicação web em **[Angular](https://angular.dev/)** que funciona como painel operacional do domínio de estoque.

A interface foi projetada para operar sobre um backend orientado a domínio e eventos, permitindo que o usuário acompanhe o ciclo completo de movimentações, aprovações e notificações.

Mais do que formulários de cadastro, a aplicação representa fluxos de trabalho reais:

- acompanhamento de pedidos por estado
- validação antes do impacto no estoque
- alertas visuais de estoque crítico
- rastreabilidade das ações do usuário

O objetivo do projeto é consolidar uma experiência fullstack próxima de sistemas corporativos, priorizando clareza de operação, previsibilidade de estado e ergonomia de uso.

<p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---

<h2 id="tecnologias-utilizadas" align="center">Tecnologias Utilizadas</h2>

- 🟦 [TypeScript](https://www.typescriptlang.org/)
- 🅰️ [Angular](https://angular.dev/)
- 🎨 [SCSS](https://sass-lang.com/documentation/)
- 🌐 Consumo de [API REST](https://github.com/renancvitor/inventory-notification-system-backend) com autenticação via JWT

<p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---

<h2 id="ferramentas-utilizadas" align="center">Ferramentas utilizadas</h2>

- 💻 [Visual Studio Code](https://code.visualstudio.com/): Ambiente de desenvolvimento integrado (IDE) leve e extensível.

<p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---

<h2 id="funcionalidades" align="center">Funcionalidades</h2>

Interface para operação do sistema de estoque baseada em permissões e estados de negócio.

### 🔐 Acesso
- Autenticação de usuários
- Interface adaptada conforme perfil de acesso

### 📦 Operação de Estoque
- Visualização de produtos e níveis de estoque
- Movimentações de entrada e saída com validações
- Alertas visuais para estoque crítico

### 🧾 Gestão de Pedidos
- Criação e acompanhamento por estado
- Aprovação e reprovação operacional
- Impacto no estoque somente após aprovação

### 👥 Administração
- Gestão de usuários e permissões
- Ativação e desativação de registros
- Atualização de credenciais

### 🔔 Monitoramento
- Indicação de eventos relevantes do sistema
- Feedback visual de ações concluídas ou bloqueadas

  <p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---

<h2 id="estrutura-do-projeto" align="center">Estrutura do Projeto</h2>

Organização baseada em responsabilidades e módulos funcionais:

```plaintext
src/
 ├── core/            # serviços globais, autenticação, interceptors
 ├── shared/          # componentes reutilizáveis
 ├── features/        # módulos funcionais do sistema
 │    ├── auth/
 │    ├── products/
 │    ├── orders/
 │    ├── movements/
 │    └── users/
 ├── layout/          # estrutura visual da aplicação
 └── environments/    # configurações por ambiente

LICENSE               # Licença do projeto
README.md             # Documentação principal do repositório
```

<p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---

<h2 id="como-executar-o-projeto" align="center">Como Executar o Projeto</h2>

### Pré-requisitos:
- 🟩 [Node.js 18+](https://nodejs.org/pt-br)
- 🅰️ [Angular CLI](https://angular.dev/tools/cli)
- 💻 [Visual Studio Code](https://code.visualstudio.com/)

### Passos:
1. Clone o repositório:
```bash
git clone git@github.com:renancvitor/inventory-notification-system-frontend.git
```
2. Acesse a pasta do projeto:
```bash
cd inventory-notification-system-frontend
```
3. Inicie o [Angular](https://angular.dev/)
```bash
ng serve
```
⚠️ **O backend deve estar em execução antes de iniciar a aplicação.**

<p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---

<h2 id="contribuições" align="center">Contribuições</h2>

Se você quiser contribuir para o projeto, siga estas etapas:

1. Faça um fork deste repositório.
2. Crie uma nova branch (`git checkout -b feature/alguma-coisa`).
3. Faça suas mudanças.
4. Envie um pull request explicando as mudanças realizadas.

Obrigado pelo interesse em contribuir!

<p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---

<h2 id="contato" align="center">Contato</h2>

Se tiver dúvidas ou sugestões, sinta-se à vontade para entrar em contato:

- 📧 **E-mail**: [renan.vitor.cm@gmail.com](mailto:renan.vitor.cm@gmail.com)

- 🟦 **LinkedIn**: [Renan Vitor](https://www.linkedin.com/in/renan-vitor-developer/)

<p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---

<h2 id="licenca" align="center">Licença</h2>

📌 Este projeto está licenciado sob a [Licença MIT](LICENSE), o que significa que você pode utilizá-lo, modificar, compartilhar e distribuir livremente, desde que mantenha os devidos créditos aos autores e inclua uma cópia da licença original - veja o arquivo [LICENSE](LICENSE) para detalhes ou acesse a [licença MIT oficial](https://opensource.org/licenses/MIT).

<p align="right"><a href="#inicio">⬆️ Voltar ao início</a></p>

---
