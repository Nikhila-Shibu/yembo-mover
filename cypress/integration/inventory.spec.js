describe('Room Review Inventory', function () {
  const MOVEKEY = 'mvusBzrmP4jgxLgD5hSBgs4qGF25bGbm95Nj';
  const ROOMKEY = 'rmuspTfQ1847xQ8fCn5qGdhw81dP76xlhJj9';
  const videoKEY = 'vidusssNxgHB6zmJmWnxp0Z7bwhwJWnW8nSTm';

  beforeEach(function () {
    cy.viewport(1366, 768);
    cy.LoginByXHR();

    cy.intercept(`video?key=${videoKEY}*`).as('videoResponse');
    cy.intercept(`room?moveKey=${MOVEKEY}*`).as('roomResponse');
    cy.visit(`https://app.mariner.dev.yembo.ai/move/${MOVEKEY}/rooms?key=${ROOMKEY}#has-inventory`);
    cy.wait('@videoResponse');
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
          cy.getInventoryTableDelete(itemName, 0);
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

  it('Inventory table quantity update', function () {
    const tagName = 'Rug - Small';
    const itemQuantity = 3;

    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('quantityUpdateRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(tagName)) {
          cy.getInventoryTableDelete(tagName, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    //Adding a tag
    cy.get('[data-e2e="rr-inventory-table-add-item"]')
      .click()
      .then(() => {
        cy.get('[data-e2e="rr-volume-dropdown-input"]').type(tagName);
        cy.get(`[data-e2e="rr-default-${tagName}"]`).click();
      });

    //updating quantity value by itemQuantity
    cy.getInventoryTableInput(tagName, 2).clear().type(itemQuantity).type('{enter}');
    cy.wait('@quantityUpdateRequest');

    //confirmation
    cy.get('[data-e2e="rr-images"]').find(`.tag:contains(${tagName})`).should('have.length', itemQuantity);
  });

  it('Inventory table weight updation proportional to volume updation', function () {
    const tagName = 'Rug - Small';
    let stdWgt;
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('PUT', 'tag/batch?shouldRebuild=true').as('volumeUpdateRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(tagName)) {
          cy.getInventoryTableDelete(tagName, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    //Adding a tag
    cy.get('[data-e2e="rr-inventory-table-add-item"]')
      .click()
      .then(() => {
        cy.get('[data-e2e="rr-volume-dropdown-input"]').type(tagName);
        cy.get(`[data-e2e="rr-default-${tagName}"]`).click();
      });

    //Getting the ratio between weight and Volume
    cy.getInventoryTableValue(tagName, 4).then((initialWgt) => {
      cy.getInventoryTableValue(tagName, 3).then((initialVol) => {
        stdWgt = initialWgt / initialVol;
        cy.log(stdWgt);
      });
    });

    //Volume update
    cy.getInventoryTableValue(tagName, 3).then((currentVolume) => {
      const txt = parseInt(currentVolume) + 1;
      cy.getInventoryTableInput(tagName, 3).clear().type(txt).type('{enter}');
      cy.wait('@volumeUpdateRequest');

      //Confirmation
      cy.getInventoryTableInput(tagName, 4).should('have.value', txt * stdWgt);
    });
    console.log('ratio: ', stdWgt);
    cy.log(stdWgt);
  });

  it('Inventory table Volume updation without changing the weight', function () {
    const tagName = 'Rug - Small';
    let initialWgt;
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('PUT', 'tag/batch?shouldRebuild=true').as('volumeUpdateRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(tagName)) {
          cy.getInventoryTableDelete(tagName, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    //Adding a tag
    cy.get('[data-e2e="rr-inventory-table-add-item"]')
      .click()
      .then(() => {
        cy.get('[data-e2e="rr-volume-dropdown-input"]').type(tagName);
        cy.get(`[data-e2e="rr-default-${tagName}"]`).click();
      });

    //Getting the initial Wgt
    cy.getInventoryTableValue(tagName, 4).then((Wgt) => {
      initialWgt = Wgt;
    });

    //Volume update
    cy.getInventoryTableValue(tagName, 3).then((currentVolume) => {
      const txt = '@' + currentVolume;
      cy.getInventoryTableInput(tagName, 3).clear().type(txt).type('{enter}');

      //Confirmation
      cy.getInventoryTableInput(tagName, 4).should('have.value', initialWgt);
    });
  });

  it('Add an item from  image', function () {
    const itemName = 'Bag';
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');

    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemName);
        cy.getBySel(`'rr-default-${itemName}'`).click();
        cy.wait('@addItemRequest');
      });

    //confirmation
    cy.get('[data-e2e="rr-images"] .tag').contains(itemName).scrollIntoView();
    cy.getBySel('rr-inventory-table-cell-name').contains(itemName).scrollIntoView();
  });

  it('Change category of item', function () {
    const itemName = 'Cradle';
    const newItem = 'BBQ Grill';
    const itemQuantity = 2;

    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('quantityUpdateRequest');
    cy.intercept('PUT', 'tag/batch?shouldRebuild=true').as('changeCategoryRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemName)) {
          cy.getInventoryTableDelete(itemName, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    //Add a tag
    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemName);
        cy.getBySel(`'rr-default-${itemName}'`).click();
        cy.wait('@addItemRequest');
      });

    //updating quantity value by itemQuantity
    cy.getInventoryTableInput(itemName, 2).clear().type(itemQuantity).type('{enter}');
    cy.wait('@quantityUpdateRequest');

    //Change category
    cy.get('[data-e2e="rr-images"] .tag')
      .contains(itemName)
      .scrollIntoView()
      .dblclick({ force: true })
      .then(() => {
        cy.getBySel('rr-context-menu');
        cy.getBySel('rr-context-menu-change-category').click();
        cy.getBySel('rr-volume-dropdown-input').type(newItem);
        cy.get('[data-e2e="rr-default-BBQ Grill - Large"]').click();
        cy.wait('@changeCategoryRequest');
      });

    //Confirmation
    cy.get('[data-e2e="rr-images"]')
      .find(`.tag:contains(${itemName})`)
      .should('have.length', parseInt(itemQuantity) - 1);
    cy.getInventoryTableInput(itemName, 2).should('have.value', parseInt(itemQuantity) - 1);
    cy.get('[data-e2e="rr-inventory-table-cell-name"]').contains(newItem);
  });

  it('mark an item as not moving', function () {
    const itemName = 'Cradle';
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');
    cy.intercept('PUT', 'tag/batch?shouldRebuild=true').as('notMovingRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemName)) {
          cy.getInventoryTableDelete(itemName, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    //Add a tag
    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemName);
        cy.getBySel(`'rr-default-${itemName}'`).click();
        cy.wait('@addItemRequest');
      });

    //Mark the item to not moving
    cy.get('[data-e2e="rr-images"] .tag')
      .contains(itemName)
      .dblclick({ force: true })
      .then(() => {
        cy.getBySel('rr-context-menu');
        cy.getBySel('rr-context-menu-toggle-section').click();
        cy.wait('@notMovingRequest');
      });

    //Confirmation
    cy.getBySel('rr-inventory-not_moving').scrollIntoView().should('be.visible').click();
    cy.get('[data-e2e="rr-inventory-table-cell-name"]').contains(itemName).scrollIntoView();
  });

  it('drag a tag to another image ', function () {
    const itemName = 'Cradle';
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');
    cy.intercept('PUT', 'tag/batch?shouldRebuild=true').as('updateTagRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemName)) {
          cy.getInventoryTableDelete(itemName, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    //Add a tag
    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemName);
        cy.getBySel(`'rr-default-${itemName}'`).click();
        cy.wait('@addItemRequest');
      });

    cy.getBySel('rr-tag-text')
      .contains(itemName)
      .parent()
      .scrollIntoView()
      .then((tag) => {
        cy.wrap(tag)
          .trigger('mousedown', { buttons: 1, force: true })
          .trigger('mousemove', { clientX: 450, clientY: 0, force: true })
          .trigger('mouseup', { force: true });
      });
    cy.wait('@updateTagRequest');

    //confirmation
    cy.getInventoryTableInput(itemName, 2).should('have.value', 1);
  });

  it('resize a tag', function () {
    const itemName = 'Cradle';
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');
    cy.intercept('PUT', 'tag/batch?shouldRebuild=true').as('updateTagRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemName)) {
          cy.getInventoryTableDelete(itemName, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    //Add a tag
    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemName);
        cy.getBySel(`'rr-default-${itemName}'`).click();
        cy.wait('@addItemRequest');
      });

    cy.getBySel('rr-tag-text')
      .contains(itemName)
      .parent()
      .scrollIntoView()
      .then((tag) => {
        cy.wrap(tag)
          .find('[data-e2e="cursor-s-resize"]')
          .then((resizer) => {
            cy.wrap(resizer)
              .trigger('mousedown', { buttons: 1, force: true })
              .trigger('mousemove', { clientX: 0, clientY: 70, force: true })
              .trigger('mouseup', { force: true });
          });
      });
    cy.wait('@updateTagRequest');
  });
});
