describe("Delete a tag from the room", function () {
    const MOVE_KEY = 'mvusBzrmP4jgxLgD5hSBgs4qGF25bGbm95Nj';
    const ROOM_KEY = 'rmuspTfQ1847xQ8fCn5qGdhw81dP76xlhJj9';
    const VIDEO_KEY = 'vidusssNxgHB6zmJmWnxp0Z7bwhwJWnW8nSTm';

    beforeEach(function () {
        cy.viewport(1366, 768);
        cy.LoginByXHR();

        // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
        cy.intercept(`video?key=${VIDEO_KEY}*`).as('videoResponse');
        cy.intercept(`room?moveKey=${MOVE_KEY}*`).as('roomResponse');

        cy.visit(`move/${MOVE_KEY}/rooms?key=${ROOM_KEY}#has-inventory`);

        cy.wait('@videoResponse');
        /**
         * Why waiting for rooms response?
         * This is because this request response all rooms data and it take a while to load.
         * Usually this request completes after our add tag or remove tag action is completed, since cypress is doing everything instantly.
         * The response from room will revert the change. So we must start our test only after room response is completed.
         * Obviously, this is an issue. But this issue will not pop up when a human tests this.
         * Anyway I will add a ticket to fix. Until then we must ensure this request is completed before test.
         */
        cy.wait('@roomResponse');
    });

    it('Inventory table quantity deletion', function(){
    const tagName = 'Rug - Small';

        cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
        cy.intercept('POST','tag/batch?shouldRebuild=true').as('quantityUpdateRequest')
      
        //Adding a tag 
        cy.get('[data-e2e="rr-inventory-table-add-item"]')
          .click()
          .then(() => {
            cy.get('[data-e2e="rr-volume-dropdown-input"]').type(tagName);
            cy.get(`[data-e2e="rr-default-${tagName}"]`).click()
          });

        //Deleting the added Tag
        cy.get('[data-e2e="rr-inventory-table"]')
        .scrollIntoView()
        .should('be.visible')
        .find('tr')
        .then((rows) => {
            if(rows.text().includes(tagName)){
              cy.getInventoryTableDelete(tagName, 0)
                cy.wait('@deleteTagRequest');
            }      
        })

    })
});