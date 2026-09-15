describe('Cadastro de amostra', () => {

  beforeEach(() => {

    cy.request('POST', '/api/reset');

    cy.visit('/');

    cy.get('[data-cy=email]').type('analista@ultralims.com.br');
    cy.get('[data-cy=senha]').type('Ultra@2026');
    cy.get('[data-cy=entrar]').click();

  });

  it('cadastra uma amostra e exibe na listagem', () => {
    cy.get('[data-cy=nova-amostra]').click();
    cy.get('[data-cy=cliente]').type('Laboratorio Central');
    cy.get('[data-cy=material]').type('Agua potavel');
    cy.intercept('POST', '/api/amostras').as('criarAmostra');
    cy.intercept('GET', '/api/amostras').as('listarAmostras');

cy.get('[data-cy=salvar-amostra]').click();

cy.wait('@criarAmostra').then((interception) => {
  const codigoCriado = interception.response.body.codigo;

  cy.wait('@listarAmostras');

  cy.get('[data-cy=linha-amostra]')
    .eq(0)
    .should('contain', codigoCriado);
});
  });
});
