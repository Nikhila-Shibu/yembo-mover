describe("Delete a tag from the room", function () {
    const MOVE_KEY = 'mvusj3kcBngljsq0t2D2gxqGSbV0R3x0Mt4p';
    const ROOM_KEY = 'rmuspFGbhZRMNhZLcz118DBlJ8FnkFh4H9KD';
    const VIDEO_KEY = 'viduspKc6540j9gPNqv6NjJBQcjV6FT6QMvTV';

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
    it("Delete an tag in the room review", function () {
        const tagName = 'Rug - Small';
        //cy.intercept('POST', '/tag/batch?shouldRebuild=true').as('InventoryUpdate')
        cy.get('@videoResponse').then(({ response }) => {
            const { inventory } = response.body.video;
            const Tag = inventory.find(({ name }) => name === tagName);
            const tagQuantity = Tag ? Tag.quantity : 0;
            cy.get('.room-name').contains("Jackson Hall (TEST)")
            cy.screenshot("Rug Small tag is present")
            //cy.get('img.image-img').first().rightclick({ force: true })
            //cy.get('.tag-text.tiny-text').contains(tagName).first().rightclick({ force: true })
            // cy.get('.tag.tag-colored.show-resizers').within(() => {
            //     cy.get('.tag-text').contains(tagName).first().rightclick()
            // })
            cy.get('.tag-text').contains(tagName).scrollIntoView().dblclick({ force: true })
            cy.get('.room-review-context-menu').should('be.visible')
            //cy.get('.room-review-context-menu > ul > :nth-child(1)').click()
            cy.get('li.delete').click()
            //cy.wait('@InventoryUpdate')
            cy.get('.inventory-table-new .reviewer-name-cell')
                .contains(tagName)
                .scrollIntoView()
                .parents('.reviewer-name-cell')
                .next()
                .children('input')
                .should('have.value', tagQuantity);
            cy.get('.dropdown-wrapper').click().type(tagName).type('{enter}');
            cy.screenshot('Rug Small tag is deleted')
        })

    })
});