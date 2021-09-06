describe('Tags in Room Review', function () {
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

    it('Create a tag with a custom label', function () {
        const tagName = 'Curtain';

        cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('addTagRequest');

        cy.get('@videoResponse').then(({ response }) => {
            const { inventory } = response.body.video;
            const customTag = inventory.find(({ name }) => name === tagName);
            const tagQuantity = customTag ? customTag.quantity : 0;
            cy.get('[data-e2e="rr-add-item-button"]').click()
            cy.get('[data-e2e="rr-volume-dropdown-input"]').type(`${tagName}{enter}`);

            // cy.get('.dropdown-wrapper').click().type(tagName).type('{enter}');
            cy.wait('@addTagRequest')

            cy.get('[data-e2e="rr-inventory-table"] .reviewer-name-cell')
                .contains(tagName)
                .scrollIntoView()
                .closest('tr')
                .find('td')
                .eq(2)
                .find('input')
                .should('have.value', tagQuantity + 1);
            // Resetting state by deleting created tag.
            // Note: This is not done by UI here, because this test case is not for testing delete tag.
            cy.get('@addTagRequest').then(({ response }) => {
                const { key } = response.body.responses[0];
                const requestData = {
                    method: 'DELETE',
                    url: `${Cypress.env('apiUrl')}/tag?shouldRebuild=true`,
                    body: { keys: [key] },
                    headers: {
                        'X-Employee-Access-Token': localStorage.getItem('accessToken'),
                    },
                };
                cy.request(requestData).should((response) => expect(response.body.status[0].type).to.equal('ok'));
            });
        });
    });

    // This test case is skipped with '.skip'
    it.only('Add a Tag to the room review', function () {
        const customTag = 'Flower Pot'
        cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('Tagged');
        cy.get('.room-name').contains("Cypress Testing's Living Room");
        cy.get('[data-e2e="rr-add-item-button"]').click()
        cy.get('[data-e2e="rr-volume-dropdown-input"]').type(`${customTag}{enter}`);
        // cy.get('.dropdown-wrapper').last().click().type('Flower Pot');
        // cy.get('.custom-value').first().click({ force: true });
        cy.get('@Tagged').its('response.statusCode').should('eq', 200);
        cy.screenshot('Flower Pot tag is added to the Living room');
        cy.get('tr.MuiTableRow-root [title="Flower Pot"]').should('have.text', 'Flower Pot');
        cy.get('tr.MuiTableRow-root')
            .contains('tr', 'Flower Pot')
            .within(() => {
                cy.get('td>input').first().should('have.value', '1');
            });
        cy.screenshot('Invenory list got updated with Flower Pot');
    });
});

/**
 * Gunashekaran:
 * This test is not working for me. So I tried to add a new one. - https://drive.google.com/file/d/1fLs-8RY62DL0-AeQkUyLKQzxraM1ZH24/view?usp=sharing
 * TODO: After checking below notes updates other tests.
 * TODO: Confirm other tests are working independently.
 *
 *
 * Notes:
 * 1. Every test must be independent. Here each test case should login and go to moves page. You can use beforeEach for that.
 * 2. Each it block can have multiple assertions. Don't hesitate to add if you need.
 * 3. Here we are testing the a thing rooms page. So we should focus on that and that reduce code on doing UI interactions.
 * ... ie, Complete test with minimum test steps. Here, we need to start test from rooms page, So directly visit rooms page.
 * ... Here we can assure room is there or not by the cy.visit() status.
 * ... If we want to check the flow from moves page to room page, do that as a separate test case.
 * 4. You can add room related test cases to same spec, so that we can reuse beforeEach. There will be situations where we need to split
 * ... test on same page to different sections when the spec becomes larger. Here you can create a spec file called 'tag.spec.js' and
 * ... include all tag related test cases in them.
 * 5. Don't use login by UI in other steps. This is an unwanted UI interaction. Login UI interaction is already tested in its test case.
 * 6. { force: true } - This must be avoided as much as possible. This is not recommended.
 * 7. Create a tag with a custom label - Custom label means an item not in the list.
 */
