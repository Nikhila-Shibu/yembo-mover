describe('Room Review', function () {
    beforeEach(() => {
        cy.viewport(1440, 1000);
        cy.LoginByXHR();
        cy.visitUrl(
            'move/mvusj3kcBngljsq0t2D2gxqGSbV0R3x0Mt4p/rooms?key=rmuspFGbhZRMNhZLcz118DBlJ8FnkFh4H9KD#has-inventory'
        );
    });

    it.only('Add tag', () => {
        //cy.intercept('POST', 'tag/batch?shouldRebuild=true').as('checkTable')
        cy.get('.sections-and-list').within(() => {
            cy.get('.search-wrapper input').scrollIntoView().type('Cat Tower');
            cy.get('input[data-reviewer-name="Cat Tower"]').focus().type(1).blur();
            // TODO: Gunashekaran, Add an assertion to confirm image is added
            //cy.wait('@checkTable').its('response.statusCode').should('eq', 200);
            //cy.get('.MuiTableCell-root MuiTableCell-body reviewer-name-cell [tag-key="tgusHnV4g0CqbT8L5rgvL3x8wM9TtB5Kf9fc"](3)').should('have.title', 'Cat Tower')
            //cy.get('tr.MuiTableRow-root [title="Cat Tower"]').should('have.', 'Cat Tower')
            //cy.get('[tag-key="tgusV2KzhHm14cDg0Vp8R6NJqJftkdDTHWBs"] > .tag-border').should('have.class', '.tag-text tiny-text').contains('Cat Tower')
            //cy.get('tr.MuiTableRow-root')
            //cy.get(".MuiTable-root")
            cy.get('tbody.MuiTableBody-root')
                .within(() => {
                    cy.get('tr.MuiTableRow-root')
                        .within(() => {
                            cy.contains('td.MuiTableCell-root MuiTableCell-body reviewer-name-cell').should('have.class', 'reviewer-name-div dropdown-highlight hover').and('have.attr', 'title', 'Cat Tower')
                        }).should('have.data', '[data-inventory-key="tgusKVMl4q3kNtHWw47cSbwGxlxgB7xWJ20q"]')

                }).should('have.title', 'Cat Tower')
            //.contains('data-inventory-key="tgus7JNlFPHk4J55D6D6f1l5hstsV175qDTL"')
            cy.get('.reviewer-name-div dropdown-highlight hover :span').contains("Cat Tower")
        });
    });
});
