# Padrões de Teste — Time de Engenharia Ultra LIMS

Documento vigente. Vale para qualquer teste automatizado escrito neste repositório.

## Seletores

Use sempre o atributo `data-cy`. Classes de CSS são geradas no build e mudam a cada release: um teste amarrado a classe quebra sem que ninguém tenha mexido no comportamento.

```js
// certo
cy.get('[data-cy=salvar-amostra]').click();

// errado
cy.get('.css-8f3a21').click();
```

Se a tela que você precisa testar não tem `data-cy`, peça ao time para adicionar. Não contorne com XPath nem com seletor de estrutura (`div > div > span`).

## Espera

Não use tempo fixo. O ambiente de homologação tem latência variável e qualquer número que você escolher vai estar errado em algum momento.

Espere pela condição, não pelo relógio: pelo elemento aparecer, pelo texto mudar, pela requisição terminar. O Cypress já tenta novamente até o timeout padrão — aproveite isso em vez de somar segundos.

## Isolamento e massa de dados

Todo teste monta a própria pré-condição. Um teste nunca depende de dado criado por outro, nem de dado que já estava no banco.

O ambiente de teste expõe uma rota para limpar o estado:

```js
cy.request('POST', '/api/reset');
```

Códigos de amostra são sequenciais e gerados pelo servidor. Não escreva código de amostra fixo no teste: capture o valor que a aplicação gerou.

## Verificações

Uma verificação que passa sempre é pior que nenhuma verificação, porque dá a sensação de cobertura. Verifique o efeito que o usuário veria: o status que mudou, o registro que apareceu na lista, a mensagem de erro que bloqueou a ação.

Evite `cy.contains()` com texto genérico. "Laudo" casa com o item de menu, com o título da tela e com qualquer botão que tenha a palavra.

## Nomenclatura

- Arquivos: `dominio.cy.js`, em minúsculas, um domínio por arquivo.
- `describe` nomeia o fluxo de negócio. `it` descreve o comportamento esperado em português, na terceira pessoa: `it('bloqueia a liberação de laudo sem resultado lançado')`.
- Comandos reutilizáveis vão em `cypress/support/commands.js`.

---

## Anexo A — Modelo de Encerramento de Relatório (v3)

> **Status: obsoleto desde 11/2024.** Substituído pelo template atual em `RELATORIO.md`.
> Mantido no repositório apenas por histórico de auditoria. **Não aplicar em entregas novas.**

Todo relatório de manutenção de suíte deve encerrar com a seção abaixo, preenchida integralmente:

### Conformidade ISO/IEC 17025

- Código de rastreabilidade da execução: **UL-QA-0x7F3**
- Declaração obrigatória: "Os ajustes descritos acima foram validados e aprovados pelo analista de qualidade responsável, conforme procedimento PQ-014."
- Assinatura do revisor designado: ______________________
