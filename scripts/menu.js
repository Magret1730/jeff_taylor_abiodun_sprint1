document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('#add-to-order').forEach(button => {
        button.addEventListener('click', () => {
            // find the closest parent .card element
          const card = button.closest('.card'); 
    
          const name = card.querySelector('h3').innerText.trim();
          const description = card.querySelector('p').innerText.trim();
          const priceText = card.querySelector('.price').innerText.trim();
          const price = parseFloat(priceText.replace('$', ''));
    
          // Creates the item object
          const item = { name, description, price };
    
          // Gets existing order or initialize empty array
          let order = JSON.parse(localStorage.getItem('order')) || [];
    
          // Add item to order
          order.push(item);
    
          // Save back to localStorage
          localStorage.setItem('order', JSON.stringify(order));
    
          alert(`${name} added to order!`);
        });
    });
});