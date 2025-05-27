describe('Поиск сериалов', () => {
    it('должен находить сериалы по запросу', () => {
        cy.visit('/'); // Переход на главную страницу
        cy.get('input[placeholder="Поиск сериалов"]').type('Игра престолов');
        cy.get('button').contains('Поиск').click();
        cy.get('.series-card').should('have.length.greaterThan', 0);
        cy.get('.series-card').first().should('contain', 'Игра престолов');
    });
});