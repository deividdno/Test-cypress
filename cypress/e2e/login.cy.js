describe('Login', () => {
  it('permite que o analista acesse o sistema', () => {
    cy.visit('/');
    cy.get('[data-cy=email]').type('analista@ultralims.com.br');
    cy.get('[data-cy=senha]').type('Ultra@2026');
    cy.get('[data-cy=entrar]').click();
    cy.get('[data-cy=usuario-logado]').should('be.visible').and('contain', 'analista@ultralims.com.br');
  });
});
