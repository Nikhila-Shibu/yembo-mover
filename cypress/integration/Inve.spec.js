describe("Add an Tag to the room", function () {
    before(function () {
        cy.ReviewerLogin()
    })
    it("Navigate Room page in application", function () {
        cy.url().should('include', '?nextPage=/')
        Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('ResizeObserver loop limit exceeded')) {
                return false
            }
        })
        cy.url().should('include', '/moves/inbox')
        cy.get('.search-bar-input', { timeout: 5000 }).should('be.visible')
        cy.get('.hamburger-icon', { timeout: 5000 }).should('be.visible').click()
        cy.get('.yb-hamburger-menu > .menu-element > :nth-child(3)').click()
        cy.location('hash').should('contain', 'mine')
        cy.get('.yb-tool-tip > .yb-icon > .blue').click()
        cy.get('.tooltip-content > div').should('be.visible')
        cy.get('div.consumer-name-wrap').should('have.text', 'Cypress Testing').click()
        cy.get('#overview').should('be.visible')
        cy.get('#rooms').should('be.visible').click()
        //Note: The Living Room should be aviable for review
        if (cy.get('.is-not-ios').contains('Living Roomreviewed')
            .within(() => {
                cy.get('span.yb-icon').eq(1).click({ force: true })
            }))
            cy.get('.is-not-ios').contains('Living Roomneeds review').click();
    })
    it("Add a Tag to the room review", function () {
        cy.get('.room-name').contains("Jackson Hall (TEST)'s Living Room").its('length')
        cy.screenshot('Before modifying the Inventory table')
        cy.get('tr.MuiTableRow-root [title="Lamp - Table"]').should('have.text', 'Lamp - Table')
        cy.get('tr.MuiTableRow-root').contains('tr', 'Lamp - Table').within(() => {
            cy.get('td>input').first().focus().clear().type('3').blur()
        })
        cy.screenshot('After modifying the Inventory table')
    })
})
