# Convenção de Commits

Use o seguinte padrão para mensagens de commit, para manter o histórico claro e organizado.

---

`<tipo>(escopo opcional): mensagem resumida no imperativo`

---

## Tipos comuns

| Tipo | Quando usar | Exemplo |
| --- | --- | --- |
| **feat** | Adicionou algo novo na interface, fluxo, componente ou integração | `feat(product): adiciona tela de edição de produto` |
| **fix** | Corrigiu um bug visível ao usuário ou erro de integração | `fix(login): corrige redirecionamento no primeiro acesso` |
| **refactor** | Melhorou o código sem alterar comportamento externo | `refactor(order): extrai montagem de payload do formulário` |
| **docs** | Alterou apenas documentação | `docs(readme): adiciona links para documentação técnica` |
| **style** | Alterou apenas formatação ou organização estética | `style(user): ajusta indentação e imports` |
| **test** | Adicionou ou ajustou testes automatizados | `test(auth): cobre cenário de sessão expirada` |
| **chore** | Alterações de manutenção, build, dependências ou config | `chore(deps): atualiza Angular e ferramentas de build` |
| **perf** | Melhorou performance percebida ou custo de renderização/chamada | `perf(product): evita recarga desnecessária de categorias` |

---

## Regras rápidas para escolher o tipo

- Adicionou funcionalidade nova? Use `feat`
- Corrigiu comportamento incorreto? Use `fix`
- Melhorou organização interna sem mudar resultado? Use `refactor`
- Alterou só documentação? Use `docs`
- Alterou só formatação? Use `style`
- Mexeu em testes? Use `test`
- Mexeu em dependências, scripts ou configuração? Use `chore`
- Melhorou desempenho? Use `perf`

---

## Exemplos de uso

```bash
feat(user): adiciona fluxo de atualização de tipo de usuário
fix(order): corrige carregamento de produtos na edição
refactor(product): separa contratos de listagem e detalhe
docs(project-structure): documenta melhorias arquiteturais sugeridas
style(shared): padroniza imports dos componentes reutilizáveis
test(error): adiciona cenários do interceptor global
chore(ci): ajusta pipeline de testes
perf(auth): evita verificação redundante de sessão
```

---

## Corpo opcional

Se necessário, adicione uma explicação curta abaixo da linha de título para registrar contexto, motivação ou impacto técnico.

---

<p align="right"><a href="../README.md">⬅️ Voltar para o README</a></p>
