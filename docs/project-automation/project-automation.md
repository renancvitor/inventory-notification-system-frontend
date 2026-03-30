# Project Automation

Este documento descreve as automações atualmente configuradas em `.github/workflows` para apoiar o fluxo de trabalho do projeto.

---

## Objetivo

As automações existentes neste repositório não fazem build, teste ou deploy do frontend.

Hoje elas estão voltadas para o gerenciamento operacional do board do GitHub Projects, ajudando a manter o fluxo de trabalho sincronizado com issues, branches e pull requests.

---

## Workflows existentes

### `move-issue-on-branch.yml`

Move uma issue para **In Progress** quando uma branch é criada com número de issue no nome.

O workflow:

- escuta o evento `create`
- extrai o número da issue a partir do nome da branch
- localiza o item correspondente no GitHub Project
- move o status para `In Progress`

---

### `move-issue-on-close.yml`

Move uma issue para **Done** quando ela é encerrada.

O workflow:

- escuta `issues.closed`
- atualiza o campo `Status` no GitHub Project

---

### `move-issue-on-pullrequest.yml`

Move a issue vinculada para **In Review** quando um pull request é aberto ou reaberto.

Além disso, ele remove o card automático do próprio PR do board, evitando duplicidade visual entre:

- card da issue
- card do pull request

Esse workflow depende de a issue estar referenciada no corpo do PR.

---

### `set-type-from-label.yml`

Atualiza o campo **Type** do GitHub Project a partir de labels da issue e também atribui a issue ao mantenedor.

Hoje ele reconhece labels como:

- `feature`
- `bug`
- `refactor`
- `tech-debt`
- `docs`
- `research`

---

## Dependências e pré-requisitos

As automações dependem de:

- acesso ao GitHub Project configurado em `https://github.com/users/renancvitor/projects/2`
- secret `GH_TOKEN`
- convenções de nomenclatura e vínculo entre branch, issue e PR

Sem esses elementos, os workflows podem não encontrar o item correto no board.

---

## O que estas automações não fazem

Atualmente este diretório **não** contém automações para:

- instalação de dependências do frontend
- execução de testes
- geração de build
- deploy da aplicação

Esses temas ficam fora do escopo atual de `.github/workflows`.

---

## Valor para o projeto

Mesmo sem automações de build ou deploy, esses workflows ajudam a manter o projeto com aparência mais profissional e organizada, principalmente para:

- rastreabilidade do fluxo de trabalho
- disciplina no uso do GitHub Projects
- consistência visual do roadmap

---

<p align="right"><a href="../../README.md">🔄 Voltar para a documentação completa</a></p>
