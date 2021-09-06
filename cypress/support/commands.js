import disableServiceWorker from '../_util/disableServiceWorker';
import 'cypress-file-upload';

Cypress.Commands.add('ReviewerLogin', () => {
    cy.visit('/')
    cy.get('h1').should('have.text', 'Welcome back!')
    cy.get('input[name="email"]').type('niyas.ns+employee@teronext.com')
    cy.get('input[name="password"]').type('Yembo2021!')
    cy.get('.yb-primary-button').click()
});
Cypress.Commands.add('RoomPage', () => {
    cy.url().should('include', '/moves/inbox')
    cy.get('.search-bar-input', { timeout: 5000 }).should('be.visible')
    cy.get('.hamburger-icon', { timeout: 5000 }).should('be.visible').click()
    cy.get('.yb-hamburger-menu > .menu-element > :nth-child(3)').click()
    cy.location('hash').should('contain', 'mine')
    cy.get('.yb-tool-tip > .yb-icon > .blue').click()
    cy.get('.tooltip-content > div').should('be.visible')
    cy.get('div.consumer-name-wrap').should('have.text', 'Cypress Testing').click()
    // cy.get('#overview').should('be.visible')
    cy.get('#rooms').should('be.visible').click()
});
Cypress.Commands.add('visitUrl', (url) => {
    disableServiceWorker
    cy.visit(url, {
        onBeforeLoad: disableServiceWorker
    });
})

Cypress.Commands.add('LoginByXHR', () => {
    const storage = window.localStorage;
    const body = { 'email': 'niyas.ns+employee@teronext.com', 'password': 'Yembo2021!' };

    cy.request({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/employee/login`,
        body,
    }).as('userLogin');

    cy.get('@userLogin').should('have.property', 'status', 200);
    cy.get('@userLogin').then((response) => {
        const { accessToken, key, userKey } = response?.body?.device || {};
        storage.setItem('accessToken', accessToken);
        storage.setItem('deviceKey', key);
        storage.setItem('employeeKey', userKey);
    });
})
