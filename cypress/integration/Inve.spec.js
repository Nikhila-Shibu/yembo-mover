describe("Add an Tag to the room", function () {
    const MOVEKEY = 'mvusBzrmP4jgxLgD5hSBgs4qGF25bGbm95Nj';
    const ROOMKEY = 'rmuspTfQ1847xQ8fCn5qGdhw81dP76xlhJj9';
    const VEDIOKEY = 'vidusssNxgHB6zmJmWnxp0Z7bwhwJWnW8nSTm';
    beforeEach(function () {
        cy.viewport(1366, 768);
        cy.LoginByXHR();
    
    cy.intercept(`video?key=${VEDIOKEY}*`).as('vedioResponse') ;
    cy.intercept(`room?moveKey=${MOVEKEY}*`).as('roomResponse');
    cy.visit(`https://app.mariner.dev.yembo.ai/move/${MOVEKEY}/rooms?key=${ROOMKEY}#has-inventory`);
    cy.wait('@vedioResponse');
    cy.wait('@roomResponse');
    
})
it("Add a Tag to the room review", function () {
  cy.get('table').then((table) => {
    if(table.find('#protected-views-wrapper > div.yb-mover-screen.move.rooms.room-review > div.content-wrap > div.grid.one-column > div > div.room-review-new > div.grid > div.wrapper-border.inventory-cell > div > table > tbody > tr:nth-child(2) > td.MuiTableCell-root.MuiTableCell-body.reviewer-name-cell > div > span:nth-child(1)')){
        // cy.contains('flower')
        // cy.get('.room-name').contains("Cypress Testing's Living Room");
        // cy.get('[data-e2e="rr-add-item-button"]').click()
      cy.get('[data-e2e="rr-inventory-table-row"]')
        .closest('tr')
        .find('td')
        .eq(2)
        .find('input').invoke('val')
        .then(val => {
          const value = val;
        });
    } 
    else {

    }
  })
})
})
    // it("Add a Tag to the room review", function () {
    //     cy.get('.room-name').contains("Cypress Testing's Living Room").its('length')
        // cy.screenshot('Before modifying the Inventory table')
            // cy.get('tr.MuiTableRow-root [title="Lamp - Table"]').should('have.text', 'Lamp - Table')
            // cy.get('tr.MuiTableRow-root').contains('tr', 'Lamp - Table').within(() => {
            //     cy.get('td>input').first().focus().clear().type('3').blur()
            // })
//         cy.get('[data-e2e="rr-inventory-table-row"]')
//         .contains('flower')
//         .closest('tr')
//         .find('td')
//         .eq(2)
//         .find('input').clear().type('5')
//         cy.screenshot('After modifying the Inventory table')
//     })
//  })



// cy.get('button').click()
// cy.get('body')
//   .then(($body) => {
    // synchronously query from body
    // to find which element was created
    // if ($body.find('input').length) {
      // input was found, do something else here
    //   return 'input'
    // }

    // else assume it was textarea
    // return 'textarea'
  // })
  // .then((selector) => {
    // selector is a string that represents
    // the selector we could use to find it
  //   cy.get(selector).type(`found the element by selector ${selector}`)
  // })