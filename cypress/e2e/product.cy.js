describe('Product Page', () => {
   const productDetails = [
      { id: 1, name: 'Red Apple', price: 'MYR5.00', description: 'Sweet and juicy red apples.' },
      { id: 2, name: 'Watermelon', price: 'MYR10.00', description: 'Cooling and refreshing watermelons.' },
      { id: 3, name: 'Pear', price: 'MYR6.00', description: 'Sweet ripe pear.' },
      { id: 4, name: 'Orange', price: 'MYR4.00', description: 'Sweet and juicy oranges.' },
      { id: 5, name: 'Papaya', price: 'MYR8.00', description: 'Amazingly sweet and delicious papayas.' },
      { id: 6, name: 'Banana', price: 'MYR3.00', description: 'Sweet and delicious bananas.' },
      { id: 7, name: 'Mango', price: 'MYR7.00', description: 'Sweet and delicious mangoes.' },
      { id: 8, name: 'Pineapple', price: 'MYR9.00', description: 'Sweet and juicy pineapples.' },
      { id: 9, name: 'Grapes', price: 'MYR6.00', description: 'Sweet and juicy grapes.' },
      { id: 10, name: 'Strawberry', price: 'MYR5.00', description: 'Sweet and delicious strawberries.' },
   ];

   const newProduct = {
      name: 'Test Product',
      description: 'This is a test product.',
      price: 'MYR15.00'
   };

   const updatedProduct = {
      name: 'Updated Product Name',
      description: 'This is an updated description.',
      price: 'MYR20.00'
   };

   beforeEach(() => {
      cy.visit('http://localhost:4200/products/list');
   });

   it('should display the "Create" button', () => {
      cy.get('.create-button-container .btn-success').should('exist');
   });

   it('should display all product cards with correct details', () => {
      productDetails.forEach((product, index) => {
         cy.get('.card').eq(index).within(() => {
            cy.get('.card-title').should('contain.text', product.name).and('contain.text', product.price);
            cy.get('.card-body').should('contain.text', product.description);
         });
      });
   });

   productDetails.forEach(product => {
      let originalProductData = {};

      before(() => {
         cy.request(`http://localhost:3000/products/${product.id}`).then((response) => {
            originalProductData = response.body;
         });
      });

      it(`should allow ordering product ${product.id}`, () => {
         cy.get('.card').eq(product.id - 1).within(() => {
            cy.get('.btn-success').click();
         });
         cy.url().should('include', `/orders/create/${product.id}`);
         cy.go('back');
      });

      it(`should allow editing product ${product.id}`, () => {
         const editProduct = (name, description, price) => {
            cy.get('#product-name').clear().type(name);
            cy.get('#product-description').clear().type(description);
            cy.get('#product-price').clear().type(price);
            cy.get('button[type="submit"]').click();
         };

         cy.get('.card').eq(product.id - 1).find('.btn-primary').click();
         cy.url().should('include', `/products/update/${product.id}`);

         editProduct('New Name', 'New Description', '100');

         cy.get('.card').eq(product.id - 1).within(() => {
            cy.get('.card-title').should('contain.text', 'New Name').and('contain.text', 'MYR100.00');
            cy.get('.card-body').should('contain.text', 'New Description');
         });

         cy.get('.card').eq(product.id - 1).find('.btn-primary').click();
         editProduct(originalProductData.name, originalProductData.description, originalProductData.price);

         cy.get('.card').eq(product.id - 1).within(() => {
            cy.get('.card-title').should('contain.text', originalProductData.name).and('contain.text', `MYR${originalProductData.price}`);
            cy.get('.card-body').should('contain.text', originalProductData.description);
         });
      });
   });

   it('should visit create product from url', () => {
      cy.visit('http://localhost:4200/products/create');
   });

   it('should create, edit, and delete a new product', () => {
      cy.get('.create-button-container .btn-success').click();

      cy.url().should('include', '/products/create');

      cy.get('#product-name').type(newProduct.name);
      cy.get('#product-description').type(newProduct.description);
      cy.get('#product-price').type(newProduct.price.replace('MYR', ''));

      cy.get('button[type="submit"]').click();

      cy.visit('http://localhost:4200/products/list');

      cy.contains('.card', newProduct.name).should('exist');
      cy.contains('.card', newProduct.description).should('exist');
      cy.contains('.card', newProduct.price).should('exist');

      cy.contains('.card', newProduct.name).within(() => {
         cy.get('.btn-primary').click();
      });

      cy.get('#product-name').clear().type(updatedProduct.name);
      cy.get('#product-description').clear().type(updatedProduct.description);
      cy.get('#product-price').clear().type(updatedProduct.price.replace('MYR', ''));
      cy.get('button[type="submit"]').click();

      cy.contains('.card', updatedProduct.name).should('exist');
      cy.contains('.card', updatedProduct.description).should('exist');
      cy.contains('.card', updatedProduct.price).should('exist');

      cy.contains('.card', updatedProduct.name).within(() => {
         cy.get('.btn-danger').click();
      });

      cy.contains('.card', updatedProduct.name).should('not.exist');
   });
});