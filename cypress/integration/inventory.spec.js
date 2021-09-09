describe('Room Review Inventory', function () {
  const MOVEKEY = 'mvusBzrmP4jgxLgD5hSBgs4qGF25bGbm95Nj';
  const ROOMKEY = 'rmuspTfQ1847xQ8fCn5qGdhw81dP76xlhJj9';
  const VEDIOKEY = 'vidusssNxgHB6zmJmWnxp0Z7bwhwJWnW8nSTm';
  beforeEach(function () {
    cy.viewport(1366, 768);
    cy.LoginByXHR();

    cy.intercept(`video?key=${VEDIOKEY}*`).as('vedioResponse');
    cy.intercept(`room?moveKey=${MOVEKEY}*`).as('roomResponse');
    cy.visit(`https://app.mariner.dev.yembo.ai/move/${MOVEKEY}/rooms?key=${ROOMKEY}#has-inventory`);
    cy.wait('@vedioResponse');
    cy.wait('@roomResponse');
  });

  it('Add a Tag', function () {
    const itemName = 'Rug - Small';

    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');

    // Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemName)) {
          cy.get('[data-e2e="rr-inventory-table-cell-name"]')
            .contains(itemName)
            .scrollIntoView()
            .closest('tr')
            .find('td')
            .eq(0)
            .find('svg')
            .invoke('attr', 'style', 'visibility: visible')
            .click();

          cy.wait('@deleteTagRequest');
        }
      });

    // Test
    cy.get('[data-e2e="rr-inventory-table-add-item"]')
      .click()
      .then(() => {
        cy.get('[data-e2e="rr-volume-dropdown-input"]').type(itemName);
        cy.get(`[data-e2e="rr-default-${itemName}"]`).click();
      });

    // Confirmation
    cy.get('[data-e2e="rr-inventory-table-cell-name"]').contains(itemName);
    cy.get('[data-e2e="rr-images"] .tag').contains(itemName).scrollIntoView();
  });
});
