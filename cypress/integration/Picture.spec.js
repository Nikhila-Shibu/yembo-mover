describe("Add an Picture to the room", function () {
    before(function () {
        cy.ReviewerLogin()
    })
    it.only("Navigate Room page in application", function () {
        cy.url().should('include', '?nextPage=/')
        Cypress.on('uncaught:exception', (err, runnable) => {
            if (err.message.includes('ResizeObserver loop limit exceeded')) {
                return false
            }
        })
        cy.RoomPage()
        if (cy.get('.is-not-ios').contains('Living Roomreviewed').within(() => {
            cy.get('span.yb-icon').eq(1).click({ force: true })
        }))
            cy.get('.is-not-ios').contains('Living Roomneeds review').click();
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
