describe('Liberacao de laudo', () => {
  it('libera o laudo de uma amostra', () => {
    cy.request('POST', '/api/reset');
    cy.request('POST', '/api/amostras', {
      cliente: 'Laboratorio Central',
      material: 'Agua potavel'
});
    cy.visit('/');
    cy.get('[data-cy=email]').type('analista@ultralims.com.br');
    cy.get('[data-cy=senha]').type('Ultra@2026');
    cy.get('[data-cy=entrar]').click();


    cy.get('[data-cy=linha-amostra]').first().click();
    cy.get('[data-cy=lancar-resultado]').type('7.2');
    cy.get('[data-cy=salvar-resultado]').click();
    cy.get('[data-cy=liberar-laudo]').click();

    cy.get('[data-cy=status-laudo]')
  .should('be.visible')
  .and('contain', 'Liberado');
  });
});
