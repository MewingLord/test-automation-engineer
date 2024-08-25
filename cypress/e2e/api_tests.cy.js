describe('API Tests', () => {
   describe('Product list', () => {
      const baseUrl = 'http://localhost:3000'; // Replace with your API URL
      let newProductId;

      it('should create a new product', () => {
         cy.request({
            method: 'POST',
            url: `${baseUrl}/products`,
            body: {
               name: 'Apple',
               description: 'Fresh apple',
               price: 1
            },
            headers: {
               'Content-Type': 'application/json'
            }
         }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', 'Apple');
            expect(response.body).to.have.property('description', 'Fresh apple');
            expect(response.body).to.have.property('price', 1);
         });
      });

      it('should get all products and find the new product ID', () => {
         cy.request('GET', `${baseUrl}/products`)
            .then((response) => {
               expect(response.status).to.eq(200);
               const products = response.body;
               const newProduct = products.find(product => product.name === 'Apple');

               if (newProduct) {
                  newProductId = newProduct.id;
                  expect(newProduct).to.have.property('name', 'Apple');
                  expect(newProduct).to.have.property('description', 'Fresh apple');
                  expect(newProduct).to.have.property('price', 1);
               } else {
                  throw new Error('New product not found in the list');
               }
            });
      });

      it('should get a product by id', () => {
         if (newProductId) {
            cy.request('GET', `${baseUrl}/products/${newProductId}`)
               .then((response) => {
                  expect(response.status).to.eq(200);
                  expect(response.body).to.have.property('name', 'Apple');
                  expect(response.body).to.have.property('description', 'Fresh apple');
                  expect(response.body).to.have.property('price', 1);
               });
         } else {
            throw new Error('Product ID not found');
         }
      });

      it('should update the new product', () => {
         if (newProductId) {
            cy.request('PUT', `${baseUrl}/products/${newProductId}`, {
               name: 'Green Apple',
               description: 'A fresh green apple',
               price: 1.5
            }).then((response) => {
               expect(response.status).to.eq(200);
               expect(response.body).to.have.property('name', 'Green Apple');
               expect(response.body).to.have.property('description', 'A fresh green apple');
               expect(response.body).to.have.property('price', 1.5);
            });
         } else {
            throw new Error('Product ID not found');
         }
      });

      it('should delete the new product', () => {
         if (newProductId) {
            cy.request('DELETE', `${baseUrl}/products/${newProductId}`)
               .then((response) => {
                  expect(response.status).to.eq(200);
               });
         } else {
            throw new Error('Product ID not found');
         }
      });
   });

   describe('Order list', () => {
      const baseUrl = 'http://localhost:3000';
      let orderId;

      // Test to create a new order
      it('should create a new order', () => {
         cy.request({
            method: 'POST',
            url: `${baseUrl}/orders`,
            body: {
               product_id: 1,
               quantity: 5,
               product_name: 'Apple',
               price: 1,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString()
            },
            headers: {
               'Content-Type': 'application/json'
            }
         }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('product_id', 1);
            expect(response.body).to.have.property('quantity', 5);
            expect(response.body).to.have.property('product_name', 'Apple');
            expect(response.body).to.have.property('price', 1);
            expect(response.body).to.have.property('created_at');
            expect(response.body).to.have.property('updated_at');
         });
      });

      it('should get all orders and verify if "Apple" exists, then grab the ID', () => {
         cy.request('GET', `${baseUrl}/orders`)
            .then((response) => {
               expect(response.status).to.eq(200);
               cy.log('All orders:', JSON.stringify(response.body, null, 2)); // Log all orders

               const createdOrder = response.body.find(order => order.product_name === 'Apple');
               cy.log(`Found order: ${JSON.stringify(createdOrder)}`); // Log the found order
               expect(createdOrder).to.not.be.undefined;

               orderId = createdOrder.id; // Store the ID for further use
               cy.log(`Created order ID: ${orderId}`);
            });
      });

      // Test to get a specific order by ID
      it('should get the order by ID', () => {
         cy.request('GET', `${baseUrl}/orders/${orderId}`)
            .then((response) => {
               expect(response.status).to.eq(200);
               expect(response.body).to.have.property('product_id', 1);
               expect(response.body).to.have.property('quantity', 5);
               expect(response.body).to.have.property('product_name', 'Apple');
               expect(response.body).to.have.property('price', 1);
               expect(response.body).to.have.property('total', 5);
               expect(response.body).to.have.property('created_at');
               expect(response.body).to.have.property('updated_at');
            });
      });

      // Test to update the order
      it('should update the order', () => {
         cy.request({
            method: 'PATCH',
            url: `${baseUrl}/orders/${orderId}`,
            body: {
               quantity: 10,
               product_name: 'Green Apple',
               price: 1.5
            },
            headers: {
               'Content-Type': 'application/json'
            }
         }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('product_name', 'Green Apple');
            expect(response.body).to.have.property('quantity', 10);
            expect(response.body).to.have.property('price', 1.5);
            expect(response.body).to.have.property('total', 15);
         });
      });

      // Test to delete the order
      it('should delete the order', () => {
         cy.request('DELETE', `${baseUrl}/orders/${orderId}`)
            .then((response) => {
               expect(response.status).to.eq(200);
            });
      });

      // Test to ensure the order is deleted
      it('should not find the deleted order', () => {
         cy.request({
            method: 'GET',
            url: `${baseUrl}/orders/${orderId}`,
            failOnStatusCode: false
         }).then((response) => {
            expect(response.status).to.eq(404);
         });
      });
   });
});
