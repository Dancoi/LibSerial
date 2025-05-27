describe('LibSerial Фронтенд', () => {
    beforeEach(() => {
        // Мок для успешного списка сериалов
        cy.intercept('GET', 'http://localhost:8080/api/series', {
            statusCode: 200,
            body: [
                {
                    ID: 1,
                    Title: 'Игра престолов',
                    PosterURL: 'https://example.com/poster.jpg',
                    Rating: 9.3,
                    Genres: [{ Name: 'Фэнтези' }, { Name: 'Драма' }],
                },
                {
                    ID: 2,
                    Title: 'Ведьмак',
                    PosterURL: 'https://example.com/poster2.jpg',
                    Rating: 8.2,
                    Genres: [{ Name: 'Фэнтези' }],
                },
            ],
        }).as('getSeries');

        cy.visit('http://localhost:5173/');
    });

    describe('HomePage', () => {
        it('должен загружать главную страницу и отображать сериалы', () => {
            cy.wait('@getSeries');
            cy.get('h1').should('contain', 'Каталог сериалов');
            cy.get('.series-card').should('have.length', 2);
            cy.get('.series-card').first().should('contain', 'Игра престолов');
        });

        it('должен выполнять поиск сериалов по названию', () => {
            cy.wait('@getSeries');
            cy.get('input[placeholder="Введите название или жанр"]').type('Игра престолов');
            cy.get('button').contains('Поиск').click();
            cy.get('.series-card').should('have.length', 1);
            cy.get('.series-card').should('contain', 'Игра престолов');
        });

        it('должен показывать сообщение при отсутствии результатов поиска', () => {
            cy.wait('@getSeries');
            cy.get('input[placeholder="Введите название или жанр"]').type('Несуществующий сериал');
            cy.get('button').contains('Поиск').click();
            cy.get('.series-card').should('not.exist');
            cy.get('p').should('contain', 'Сериалов по вашему запросу не найдено');
        });

        it('должен показывать ошибку при сбое API', () => {
            cy.intercept('GET', 'http://localhost:8080/api/series', {
                statusCode: 500,
                body: { error: 'Сервер недоступен' },
            }).as('getSeriesError');
            cy.visit('http://localhost:5173/');
            cy.wait('@getSeriesError');
            cy.get('.bg-red-100').should('contain', 'Не удалось загрузить сериалы');
            cy.get('.series-card').should('not.exist');
        });

        it('должен отображать карусель новинок', () => {
            cy.wait('@getSeries');
            cy.get('h2').should('contain', 'Новинки');
            cy.get('.carousel').find('.series-card').should('have.length', 2);
        });
    });

    describe('LoginPage', () => {
        beforeEach(() => {
            cy.visit('http://localhost:5173/login');
        });

        it('должен успешно авторизовать пользователя', () => {
            cy.intercept('POST', 'http://localhost:8080/api/login', {
                statusCode: 200,
                body: { token: 'fake-jwt-token' },
            }).as('login');
            cy.get('h2').should('contain', 'Зайти в свою библиотеку');
            cy.get('input#email').type('user@example.com');
            cy.get('input#password').type('password');
            cy.get('button').contains('Войти').click();
            cy.wait('@login');
            cy.url().should('include', '/');
        });

        it('должен показывать ошибку при неверном пароле', () => {
            cy.intercept('POST', 'http://localhost:8080/api/login', {
                statusCode: 401,
                body: { error: 'Неверный логин или пароль' },
            }).as('loginError');
            cy.get('input#email').type('user@example.com');
            cy.get('input#password').type('wrongpassword');
            cy.get('button').contains('Войти').click();
            cy.wait('@loginError');
            cy.get('.bg-red-100').should('contain', 'Неверный логин или пароль');
        });

        it('должен показывать ошибку валидации при пустом email', () => {
            cy.get('input#password').type('password');
            cy.get('button').contains('Войти').click();
            cy.get('.text-red-600').should('contain', 'Email не должен быть пустым');
        });
    });

    // Кастомная команда для авторизации
    Cypress.Commands.add('login', (email, password) => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8080/api/login',
            body: { email, password },
        }).then((response) => {
            window.localStorage.setItem('token', response.body.token);
        });
    });
}