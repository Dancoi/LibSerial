describe('Страница входа', () => {
    const baseUrl = 'http://localhost:5173';

    beforeEach(() => {
        cy.visit(`${baseUrl}/login`);
    });

    it('Успешный вход с тестовым пользователем', () => {
        cy.get('input#email').type('user@example.com');
        cy.get('input#password').type('password');
        cy.get('button[type="submit"]').click();

        // Проверяем, что после входа мы на главной странице
        cy.url().should('eq', `${baseUrl}/`);
    });

    it('Показывает ошибку при вводе неверного пароля', () => {
        cy.get('input#email').type('user@example.com');
        cy.get('input#password').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', ''); // уточни текст ошибки, если он известен
    });

    it('Показывает ошибку валидации при пустых полях', () => {
        cy.get('button[type="submit"]').click();

        cy.get('#email + p')
            .should('contain', 'Email не должен быть пустым');

        cy.get('#password + p')
            .should('contain', 'Пароль не может быть пустым');
    });

    it('Успешный вход с тестовым пользователем', () => {
        cy.get('input#email').type('user@example.com');
        cy.get('input#password').type('password');
        cy.get('button[type="submit"]').click();

        // Проверяем, что после входа происходит редирект на главную
        cy.url().should('eq', `${baseUrl}/`);


        // Проверяем наличие токена в localStorage (если используется)
        cy.window().then((win) => {
            const token = win.localStorage.getItem('token'); // замени ключ на свой
            expect(token).to.not.be.null;
        });
    });

});
