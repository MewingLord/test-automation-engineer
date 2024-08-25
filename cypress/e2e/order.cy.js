describe('Order List', () => {
   beforeEach(() => {
      cy.visit('http://localhost:4200/orders/list');
   });

   it('should display the correct order table headers', () => {
      cy.contains('Order ID').should('be.visible');
      cy.contains('Order Date').should('be.visible');
      cy.contains('Product Name').should('be.visible');
      cy.contains('Price').should('be.visible');
      cy.contains('Quantity').should('be.visible');
      cy.contains('Total').should('be.visible');
      cy.contains('Actions').should('be.visible');
   });

   it('should create an order for Red Apple and verify it in the orders list', () => {
      cy.visit('http://localhost:4200/products/list');
      cy.get('.card')
         .filter(':contains("Red Apple")')
         .find('a')
         .contains('Order')
         .click();
      cy.url().should('include', '/orders/create');
      cy.get('#product-quantity')
         .type('5', { force: true });
      cy.contains('button', 'Create').click();
      cy.visit('http://localhost:4200/orders/list');
      cy.url().should('include', '/orders/list');
      cy.get('tbody tr')
         .contains('td', 'Red Apple')
         .parent('tr')
         .within(() => {
            cy.get('td').eq(3).invoke('text').then(priceText => {
               const price = parseFloat(priceText.replace('MYR', '').trim());
               cy.get('td').eq(4).invoke('text').then(quantityText => {
                  const quantity = parseInt(quantityText.trim(), 10);
                  cy.get('td').eq(5).invoke('text').then(totalText => {
                     const total = parseFloat(totalText.replace('MYR', '').trim());
                     const expectedTotal = price * quantity;
                     expect(total).to.equal(expectedTotal);
                     cy.get('td').eq(3).should('contain.text', `MYR${price}`);
                     cy.get('td').eq(4).should('contain.text', quantity);
                     cy.get('td').eq(5).should('contain.text', `MYR${expectedTotal}`);
                  });
               });
            });
         });
   });

   it('should delete an order and verify it is removed from the orders list', () => {
      cy.get('tbody tr')
         .contains('td', 'Red Apple')
         .parent('tr')
         .within(() => {
            cy.contains('button', 'Delete').click();
         });
   });
});
