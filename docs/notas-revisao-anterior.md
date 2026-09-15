# Notas rápidas — revisão da suíte

Anotações soltas de quem olhou a suíte por cima antes de abrirmos a vaga. Não é um levantamento completo nem revisado.

- O login está preso em classe de CSS gerada. Vai quebrar no próximo build do front.
- Tem espera fixa em `laudo.cy.js` (`cy.wait(3000)`) esperando a listagem carregar. É a causa mais provável das falhas intermitentes no pipeline.
- O spec de laudo não cria a amostra que ele usa. Rodando isolado, ele nem chega no botão.
- Login pela interface repetido em todo spec. Dá para virar comando customizado, mas é melhoria, não urgência.
