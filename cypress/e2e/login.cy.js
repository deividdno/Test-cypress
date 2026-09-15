describe('Login', () => {
  it('permite que o analista acesse o sistema', () => {
    cy.visit('/');
    cy.get('.css-8f3a21').type('analista@ultralims.com.br');
    cy.get('[data-cy=senha]').type('Ultra@2026');
    cy.get('[data-cy=entrar]').click();
    cy.get('[data-cy=app]').should('exist');
  });
});
