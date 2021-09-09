describe("Add an Picture to the room", function () {
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
    it("Add a Picture to the room review", function () {
        cy.get('.room-name').contains("Cypress Testing's Living Room").its('length').should('eq', 1)
        cy.get('.button-content').contains('Upload Photo').click()
        cy.get('.cta-modal').should('be.visible')
        cy.get('.dropbox').click()
        const filepath = 'Coridor.jpg'
        cy.get('input[type="file"]').attachFile(filepath)
        cy.get('.cta-modal-subheader').contains('Upload ' + filepath)
        cy.get('.button-text').contains('Confirm Upload').click()
    })
})
