const { initial } = require("lodash");

describe('Room Review Inventory', function () {
    const MOVEKEY = 'mvusBzrmP4jgxLgD5hSBgs4qGF25bGbm95Nj';
    const ROOMKEY = 'rmuspTfQ1847xQ8fCn5qGdhw81dP76xlhJj9';
    const videoKEY = 'vidusssNxgHB6zmJmWnxp0Z7bwhwJWnW8nSTm';

    beforeEach(function () {
        cy.viewport(1366, 768);
        cy.LoginByXHR();
        
        cy.intercept(`video?key=${videoKEY}*`).as('videoResponse');
        cy.intercept(`room?moveKey=${MOVEKEY}*`).as('roomResponse');
        cy.visit(`https://app.mariner.dev.yembo.ai/move/${MOVEKEY}/rooms?key=${ROOMKEY}#has-inventory`);
        cy.wait('@videoResponse');
        cy.wait('@roomResponse');  
    })

    it('Add a Tag', function () {
        const itemName = 'Rug - Small';
    
        cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
    
        // Initialization
        cy.get('[data-e2e="rr-inventory-table"]')
          .scrollIntoView()
          .should('be.visible')
          .find('tr')
          .then((rows) => {
            if(rows.text().includes(itemName)){
                cy.getInventoryTableDelete(itemName, 0)
                cy.wait('@deleteTagRequest');
            }
          });
    
        // Test
        cy.get('[data-e2e="rr-inventory-table-add-item"]')
          .click()
          .then(() => {
            cy.get('[data-e2e="rr-volume-dropdown-input"]').type(itemName);
            cy.get(`[data-e2e="rr-default-${itemName}"]`).click();
          });
    
        // Confirmation
        cy.get('[data-e2e="rr-inventory-table-cell-name"]').contains(itemName);
        cy.get('[data-e2e="rr-images"] .tag').contains(itemName).scrollIntoView();
    });

    it('Inventory table quantity update', function(){
        const tagName = 'Rug - Small';
        const itemQuantity = 3;

        cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
        cy.intercept('POST','tag/batch?shouldRebuild=true').as('quantityUpdateRequest')
      
        //Initialization
        cy.get('[data-e2e="rr-inventory-table"]')
        .scrollIntoView()
        .should('be.visible')
        .find('tr')
        .then((rows) => {
            if(rows.text().includes(tagName)){
              cy.getInventoryTableDelete(tagName, 0)
                cy.wait('@deleteTagRequest');
            }      
        })

        //Adding a tag 
        cy.get('[data-e2e="rr-inventory-table-add-item"]')
          .click()
          .then(() => {
            cy.get('[data-e2e="rr-volume-dropdown-input"]').type(tagName);
            cy.get(`[data-e2e="rr-default-${tagName}"]`).click()
          });

        //updating quantity value by itemQuantity
        cy.getInventoryTableInput(tagName, 2)
            .clear()
            .type(itemQuantity)
            .type('{enter}')
        cy.wait('@quantityUpdateRequest');

        //confirmation 
        cy.get('[data-e2e="rr-images"]')
        .find(`.tag:contains(${tagName})`)     
        .should('have.length',itemQuantity)     
    })


    it('Inventory table weight updation proportional to volume updation', function(){
        const tagName = 'Rug - Small';
        let stdWgt;
        cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
        cy.intercept('PUT', 'tag/batch?shouldRebuild=true').as('volumeUpdateRequest');

    //Initialization
        cy.get('[data-e2e="rr-inventory-table"]')
        .scrollIntoView()
        .should('be.visible')
        .find('tr')
        .then((rows) => {
            if(rows.text().includes(tagName)){
              cy.getInventoryTableDelete(tagName, 0)
              cy.wait('@deleteTagRequest');
            }      
        })

        //Adding a tag 
        cy.get('[data-e2e="rr-inventory-table-add-item"]')
        .click()
        .then(() => {
            cy.get('[data-e2e="rr-volume-dropdown-input"]').type(tagName);
            cy.get(`[data-e2e="rr-default-${tagName}"]`).click()
        });

        //Getting the ratio between weight and Volume
        cy.getInventoryTableValue(tagName, 4)
        .then((initialWgt) =>{
            cy.getInventoryTableValue(tagName, 3)
            .then((initialVol) => {
                stdWgt = initialWgt/initialVol ;
                cy.log(stdWgt)
            })
        })

        //Volume update
        cy.getInventoryTableValue(tagName, 3)
        .then((currentVolume) => {
            const txt = currentVolume*2;
            cy.getInventoryTableInput(tagName, 3)
            .clear()
            .type(txt)
            .type('{enter}')
            cy.wait('@volumeUpdateRequest');

        //Confirmation
        cy.getInventoryTableInput(tagName, 4)
            .should('have.value', txt*8);        
        })
    })


    it('Inventory table Volume updation without changing the weight', function(){
        const tagName = 'Rug - Small';
        let abc;
        cy.intercept('DELETE', 'tag?shouldRebuild=true').as('deleteTagRequest');
        cy.intercept('PUT', 'tag/batch?shouldRebuild=true').as('volumeUpdateRequest');

    //Initialization
        cy.get('[data-e2e="rr-inventory-table"]')
        .scrollIntoView()
        .should('be.visible')
        .find('tr')
        .then((rows) => {
            if(rows.text().includes(tagName)){
            cy.getInventoryTableDelete(tagName, 0)
            cy.wait('@deleteTagRequest');
            }      
        })

        //Adding a tag 
        cy.get('[data-e2e="rr-inventory-table-add-item"]')
        .click()
        .then(() => {
            cy.get('[data-e2e="rr-volume-dropdown-input"]').type(tagName);
            cy.get(`[data-e2e="rr-default-${tagName}"]`).click()
        });

        //Getting the ratio between weight and Volume
        cy.getInventoryTableValue(tagName, 4)
        .then((initialWgt) =>{
            abc = initialWgt;  
        })

        //Volume update
        cy.getInventoryTableValue(tagName, 3)
        .then((currentVolume) => {
            const txt = '@'+currentVolume;
            cy.getInventoryTableInput(tagName, 3)
            .clear()
            .type(txt)
            .type('{enter}')
            // cy.wait('@volumeUpdateRequest');

        //Confirmation
        cy.getInventoryTableInput(tagName, 4)
            .should('have.value', abc);        
            
        })
    })
})
