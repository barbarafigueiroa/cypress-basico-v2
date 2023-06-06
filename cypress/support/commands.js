Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    cy.get('#firstName').type('Bárbara')
        cy.get('#lastName').type('Figueirôa')
        cy.get('#email').type('bfamorim@outlook.com', )
        cy.get('#open-text-area').type('Testando...')
        cy.contains('button', 'Enviar').click()
})