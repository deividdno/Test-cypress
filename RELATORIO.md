# Relatório de Correção da Suíte

Nome: Deivid Nunes Oliveira
Data: 14/09/2026

---

## 1. Problemas encontrados


| # | Arquivo | Problema | Por que isso é um problema |
|---|---------|----------|-----------------------------|
| 1 | `cypress/e2e/login.cy.js`, linha ~4 | Uso da classe CSS `.css-8f3a21` para localizar o campo de e-mail | Classes CSS podem mudar entre builds sem que a funcionalidade tenha sido alterada, tornando o teste frágil. |
| 2 | `cypress/e2e/login.cy.js`, linha ~7 | Validação apenas da existência do elemento `[data-cy=app]` | O elemento já existe antes da autenticação, permitindo que o teste passe mesmo se o login falhar. |
| 3 | `cypress/e2e/amostra.cy.js`, `beforeEach` | O teste não limpava o estado da aplicação antes da execução | Dados deixados por execuções anteriores poderiam alterar o resultado e criar dependência entre testes. |
| 4 | `cypress/e2e/amostra.cy.js`, linha ~15 | Uso de `cy.wait(1200)` com tempo fixo | O tempo de resposta pode variar, causando falhas intermitentes mesmo quando a aplicação está funcionando corretamente. |
| 5 | `cypress/e2e/amostra.cy.js`, linha ~17 | Validação utilizando o código fixo `AM-0001` | O código da amostra é gerado pelo sistema e pode variar. Fixar esse valor deixa o teste dependente do estado anterior da aplicação. |
| 6 | `cypress/e2e/laudo.cy.js`, linha ~9 | O teste dependia da existência prévia de uma amostra | Ao executar o teste isoladamente, poderia não existir nenhuma amostra para selecionar, criando dependência da ordem de execução da suíte. |
| 7 | `cypress/e2e/laudo.cy.js`, linha ~8 | Uso de `cy.contains('Laudo')` como validação genérica | O texto pode estar presente em diferentes partes da interface e não comprova que o fluxo necessário foi executado corretamente. |
| 8 | `cypress/e2e/laudo.cy.js`, linhas finais | Uso de `cy.url().should('include', '/')` e `expect(true).to.be.true` | As duas verificações podem passar independentemente da liberação do laudo, gerando falso positivo. |


## 2. O que você mudou

No teste de login, substituí o seletor baseado na classe CSS `.css-8f3a21` pelo atributo `[data-cy=email]`. O atributo `data-cy` é destinado à automação e evita que alterações visuais ou de estilização quebrem o teste sem alteração funcional.

Também alterei a validação final do login. Em vez de verificar apenas a existência do elemento `app`, o teste passou a validar que o usuário autenticado é exibido na interface através de `[data-cy=usuario-logado]`. Dessa forma, o teste realmente comprova que a autenticação foi concluída.

No teste de cadastro de amostra, adicionei uma chamada `POST /api/reset` antes da execução para garantir que o cenário sempre comece em um estado conhecido e não dependa de dados deixados por outros testes.

Removi a espera fixa de 1200 ms e passei a interceptar a requisição `GET /api/amostras`. O teste agora aguarda a atualização real da listagem através de `cy.wait('@listarAmostras')`, em vez de depender de um tempo arbitrário.

Também passei a interceptar a requisição `POST /api/amostras` e capturar o código retornado pelo servidor. A validação da listagem utiliza esse código dinâmico em vez do valor fixo `AM-0001`, garantindo que seja validada a amostra realmente criada naquela execução.

No teste de liberação de laudo, adicionei o reset do estado e a criação da amostra necessária diretamente pela API antes do fluxo principal. Dessa forma, o teste pode ser executado isoladamente e não depende do teste de cadastro. A criação pela API também mantém o foco do cenário na funcionalidade de laudo.

Removi a validação genérica `cy.contains('Laudo')`, pois ela não comprovava nenhum resultado relevante do fluxo.

Por fim, substituí as validações `cy.url().should('include', '/')` e `expect(true).to.be.true` pela verificação do elemento `[data-cy=status-laudo]` contendo `Liberado`. Assim, o teste confirma diretamente o resultado esperado da funcionalidade.

## 3. Resultado do teste de estabilidade

Saída de `npm run estabilidade`:

Saída de `npm run estabilidade`:

```text
Execucao 1 de 10... passou
Execucao 2 de 10... passou
Execucao 3 de 10... passou
Execucao 4 de 10... passou
Execucao 5 de 10... passou
Execucao 6 de 10... passou
Execucao 7 de 10... passou
Execucao 8 de 10... passou
Execucao 9 de 10... passou
Execucao 10 de 10... passou

----------------------------------------
Execucoes que passaram: 10 de 10
----------------------------------------

## 4. O que você deixaria para depois

Deixei para depois alguns cenários extras, como login inválido, validação de campos obrigatórios e liberação de laudo sem resultado. Também poderia melhorar a organização dos testes para evitar repetição. Preferi focar primeiro nos problemas que afetavam a estabilidade e a confiabilidade da suíte.
