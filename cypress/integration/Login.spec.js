describe('Login to Mariner application', function () {
    it('Vist the Mariner application in Yembo', function () {
        cy.visit('/');
    });
    it('Valid Email & Invalid Password Login ', function () {
        // Intercept must be added before the request happen
        cy.intercept('PUT', 'employee/login').as('UserLogin');
        cy.visit('/');
        cy.get('input[name="email"]').type('niyas.ns+employee@teronext.com');
        cy.get('input[name="password"]').type('YVtvqj');
        cy.get('.yb-primary-button').click();
        cy.wait('@UserLogin').its('response.statusCode').should('eq', 400);
        cy.get('.error-message').should('be.visible');
    });
    it('Invalid Email & Valid Password Login ', function () {
        cy.visit('/');
        cy.get('input[name="email"]').type('niyas.employee@teronext.com');
        cy.get('input[name="password"]').type('YVtv76qj');
        cy.get('.yb-primary-button').click();
        cy.get('.error-message').should('be.visible');
    });
    it('Login to Yembo application with valid credentials through XHR', function () {
        // TODO: Syntax is not correct here.
        cy.request('PUT', '/employee/login').as('Userlogin'),
            { email: 'niyas.ns+employee@teronext.com', password: 'YVtv76qj' };

        cy.get('@Userlogin').should('have.property', 'status', 200);
    });
});
