import disableServiceWorker from '../_util/disableServiceWorker';
import 'cypress-file-upload';
Cypress.Commands.add('ReviewerLogin', () => {
  cy.visit('/');
  cy.get('h1').should('have.text', 'Welcome back!');
  cy.get('input[name="email"]').type('niyas.ns+employee@teronext.com');
  cy.get('input[name="password"]').type('Yembo2021!');
  cy.get('.yb-primary-button').click();
});

Cypress.Commands.add('visitUrl', (url) => {
  disableServiceWorker;
  cy.visit(url, {
    onBeforeLoad: disableServiceWorker,
  });
});

Cypress.Commands.add('LoginByXHR', () => {
  const storage = window.localStorage;
  const body = { email: 'niyas.ns+employee@teronext.com', password: 'Yembo2021!' };

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
});

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-e2e=${selector}]`, ...args);
});

Cypress.Commands.add('getInventoryTableValue', (tag, columnId) => {
  cy.getBySel('rr-content').scrollTo('center');
  return cy
    .getBySel('rr-inventory-table')
    .contains(tag)
    .scrollIntoView()
    .closest('tr')
    .find('td')
    .eq(columnId)
    .find('input')
    .invoke('val');
});

Cypress.Commands.add('getInventoryTableInput', (tag, columnId) => {
  cy.getBySel('rr-content').scrollTo('center');
  return cy
    .getBySel('rr-inventory-table')
    .contains(tag)
    .scrollIntoView()
    .closest('tr')
    .find('td')
    .eq(columnId)
    .find('input');
});

Cypress.Commands.add('getInventoryTableDelete', (tag, columnId) => {
  return cy
    .getBySel('rr-inventory-table-cell-name')
    .contains(tag)
    .scrollIntoView()
    .closest('tr')
    .find('td')
    .eq(columnId)
    .find('svg')
    .invoke('attr', 'style', 'visibility: visible')
    .click();
});

Cypress.Commands.add('getItemTagDelete', (itemName, indexNo) => {
  return cy
    .getBySel('rr-images')
    .find('.image-img')
    .eq(indexNo)
    .get('[data-e2e="rr-images"] .tag')
    .contains(itemName)
    .dblclick({ force: true })
    .then(() => {
      cy.getBySel('rr-context-menu');
      cy.getBySel('rr-context-menu-delete').click();
    });
});
Cypress.Commands.add('getImage', (indexNo) => {
  return cy.getBySel('rr-images').scrollIntoView().find('.image-img').eq(indexNo).dblclick({ force: true });
});
