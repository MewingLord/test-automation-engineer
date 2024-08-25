describe('frontend', () => {
   it('should show main page', () => {
      cy.visit('http://localhost:4200/')

      cy.contains('.nav-link', 'Products').should('exist')
      cy.contains('.nav-link', 'Orders').should('exist')
   })
})