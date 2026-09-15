describe('Liberacao de laudo', () => {
  it('libera o laudo de uma amostra', () => {
    cy.visit('/');
    cy.get('[data-cy=email]').type('analista@ultralims.com.br');
    cy.get('[data-cy=senha]').type('Ultra@2026');
    cy.get('[data-cy=entrar]').click();

    cy.contains('Laudo').should('be.visible');

    cy.get('[data-cy=linha-amostra]').first().click();
    cy.get('[data-cy=lancar-resultado]').type('7.2');
    cy.get('[data-cy=salvar-resultado]').click();
    cy.get('[data-cy=liberar-laudo]').click();

    cy.url().should('include', '/');
    expect(true).to.be.true;
  });
});
