describe('Room Review Keyword Shortcuts', function () {
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

  it('keypress on "b" to move item to back', function () {
    const itemNameBag = 'Bag';
    const itemNameBuffet = 'Buffet Base';
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemNameBag, itemNameBuffet)) {
          cy.getInventoryTableDelete(itemNameBag, 0);
          cy.getInventoryTableDelete(itemNameBuffet, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemNameBag);
        cy.getBySel(`'rr-default-${itemNameBag}'`).click();
        cy.wait('@addItemRequest');
      });
    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemNameBuffet);
        cy.getBySel(`'rr-default-${itemNameBuffet}'`).click();
        cy.wait('@addItemRequest');
      });

    //keypress on "b" to move item to back
    cy.getBySel('rr-tag-text')
      .contains('Buffet Base')
      .parent()
      .scrollIntoView()
      .focus()
      .click()
      .trigger('keydown', {
        key: 'b',
        which: 66,
        Code: 'KeyB',
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      })
      .then(() => {
        cy.getBySel('rr-tag-text').contains('Bag').should('be.visible').scrollIntoView();
      });
  });

  it('keypress on "d" to duplicate the item', function () {
    const itemNameCooler = 'Cooler';
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemNameCooler)) {
          cy.getInventoryTableDelete(itemNameCooler, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemNameCooler);
        cy.getBySel(`'rr-default-${itemNameCooler}'`).click();
        cy.wait('@addItemRequest');
      });

    //keypress on "d" to duplicate the item
    cy.getBySel('rr-tag-text')
      .contains('Cooler')
      .parent()
      .scrollIntoView()
      .focus()
      .click()
      .trigger('keydown', {
        key: 'd',
        which: 68,
        Code: 'KeyD',
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      })
      .then(() => {
        cy.getInventoryTableInput(itemNameCooler, 2).should('have.value', 2);
      });
  });

  it('keypress on "c" to change th category of item', function () {
    const itemName = 'Arcade Machine';
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

    //keypress on "c" to change th category of item
    // cy.getBySel('rr-images').scrollIntoView().find('.image-img').eq(0);
    cy.getBySel('rr-tag-text')
      .contains(itemName)
      .parent()
      .scrollIntoView()
      .focus()
      .click()
      .trigger('keydown', {
        key: 'c',
        which: 67,
        Code: 'KeyC',
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        force: true,
      })
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

  it('keypress "h" to toggle hiding all items', function () {
    cy.get('[data-e2e="rr-images"] .tag').parent().scrollIntoView().click().trigger('keydown', {
      key: 'h',
      which: 72,
      Code: 'KeyH',
      shiftKey: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
    });
  });

  it('keypress "n" to mark item as not moving , "m" to mark as moving and "del" to delete the selected item ', function () {
    const itemNameCooler = 'Cooler';
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemNameCooler)) {
          cy.getInventoryTableDelete(itemNameCooler, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemNameCooler);
        cy.getBySel(`'rr-default-${itemNameCooler}'`).click();
        cy.wait('@addItemRequest');
      });

    //keypress on "n" to mark item as not moving
    cy.get('[data-e2e="rr-images"] .tag')
      .contains('Cooler')
      .parent()
      .scrollIntoView()
      .focus()
      .click()
      .trigger('keydown', {
        key: 'n',
        which: 78,
        Code: 'KeyN',
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      })
      .then(() => {
        cy.getBySel('rr-inventory-not_moving').scrollIntoView().should('be.visible').click();
        cy.get('[data-e2e="rr-inventory-table-cell-name"]').contains(itemNameCooler).scrollIntoView();
      });

    //keypress on "m" to mark item as  moving
    cy.getBySel('rr-tag-text')
      .contains(itemNameCooler)
      .parent()
      .scrollIntoView()
      .focus()
      .click()
      .trigger('keydown', {
        key: 'm',
        which: 77,
        Code: 'KeyM',
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
      })
      .then(() => {
        cy.getBySel('rr-inventory-moving').scrollIntoView().should('be.visible').click();
        cy.get('[data-e2e="rr-inventory-table-cell-name"]').contains(itemNameCooler).scrollIntoView();
      });

    //keypress on "del" to delete the selected item
    cy.getBySel('rr-tag-text').contains(itemNameCooler).parent().scrollIntoView().focus().click().trigger('keydown', {
      key: 'Delete',
      which: 46,
      Code: 'Delete',
      shiftKey: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
    });
    cy.wait('@deleteTagRequest');
    //confirmation
    cy.getBySel('rr-inventory-moving').scrollIntoView().should('be.visible').click();
    cy.get('[data-e2e="rr-inventory-table-cell-name"]').should('not.have.value', itemNameCooler);
  });

  it('keypress on "Esc" to deselect item and "Backspace" to delete the item', function () {
    const itemNameBag = 'Bag';
    cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addItemRequest');

    //Initialization
    cy.get('[data-e2e="rr-inventory-table"]')
      .scrollIntoView()
      .should('be.visible')
      .find('tr')
      .then((rows) => {
        if (rows.text().includes(itemNameBag)) {
          cy.getInventoryTableDelete(itemNameBag, 0);
          cy.wait('@deleteTagRequest');
        }
      });

    cy.getImage(0);
    cy.getBySel('rr-context-menu').scrollIntoView();
    cy.get('ul>li')
      .eq(0)
      .click()
      .then(() => {
        cy.getBySel('rr-volume-dropdown-input').type(itemNameBag);
        cy.getBySel(`'rr-default-${itemNameBag}'`).click();
        cy.wait('@addItemRequest');
      });

    cy.getBySel('rr-tag-text').contains(itemNameBag).parent().scrollIntoView().focus().dblclick().trigger('keydown', {
      key: 'Escape',
      which: 27,
      Code: 'Escape',
      shiftKey: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
    });

    cy.getBySel('rr-tag-text').contains(itemNameBag).parent().scrollIntoView().focus().dblclick().trigger('keydown', {
      key: 'Backspace',
      which: 8,
      Code: 'Backspace',
      shiftKey: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
    });
    cy.wait('@deleteTagRequest');
  });
});
