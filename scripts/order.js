// Script to handle the order form functionality
// Authors: Jeff, Abiodun, Taylor
// Date : 2025-06-22

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('dropdown');
  const itemContainer = document.getElementById('item-container');
  const calculateBtn = document.querySelector('.calculate-total-btn');
  const placeOrderBtn = document.querySelector('.place-order-btn');
  const selectedItems = new Set();
  
  const itemPrices = {
    'Pancakes' : 5.99,
    'Omelette': 10.99,
    'French Toast': 8.99,
    'Chicken Wrap' : 10.99,
    'Caesar Salad': 8.99,
    'Burger': 5.99,
    'Tea': 2.00, 
    'Coffee': 2.00,
    'Juice': 3.00
  };

  dropdown.addEventListener('change', () => handleDropdownChange(dropdown, itemContainer, selectedItems));
  calculateBtn.addEventListener('click', () => calculateTotal(itemContainer, itemPrices));
  placeOrderBtn.addEventListener('click', (e) => handlePlaceOrder(e, itemContainer, itemPrices));
});

// Helper function to sanitize strings for use in IDs
const sanitizeId = (str) => str.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');

// Function to handle the dropdown change event
const handleDropdownChange = (dropdown, itemContainer, selectedItems) => {
  const selectedItem = dropdown.value;
  if (!selectedItem || selectedItems.has(selectedItem)) return;

  logSelectedItem(selectedItem);
  addItemRow(itemContainer, selectedItem);

  selectedItems.add(selectedItem);
  dropdown.value = "";
};

const logSelectedItem = (item) => {
  console.log(`Selected item: ${item}`);
};

// Function to create a new row in the form for the selected item
const addItemRow = (container, item) => {
  const row = document.createElement('div');
  row.className = 'form-row';
  row.setAttribute('data-item', item);

  const safeId = sanitizeId(item);

  const itemLabel = document.createElement('label');
  itemLabel.textContent = `Item: ${item}`;
  itemLabel.setAttribute('for', `item-${safeId}`);

  const itemInput = document.createElement('input');
  itemInput.type = 'text';
  itemInput.name = `item-${safeId}`;
  itemInput.id = `item-${safeId}`;
  itemInput.value = item;
  itemInput.readOnly = true;

  const qtyLabel = document.createElement('label');
  qtyLabel.textContent = 'QTY';
  qtyLabel.setAttribute('for', `qty-${safeId}`);

  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.name = `qty-${safeId}`;
  qtyInput.id = `qty-${safeId}`;
  qtyInput.min = 1;
  qtyInput.value = 1;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'remove-item-btn';
  removeBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer; margin-left: 1rem;';
  removeBtn.addEventListener('click', () => removeItem(row, item, document.getElementById('dropdown')));

  [itemLabel, itemInput, qtyLabel, qtyInput, removeBtn].forEach(el => row.appendChild(el));
  container.appendChild(row);
};

const removeItem = (row, item, dropdown) => {
  row.remove();
  
  const event = new CustomEvent('itemRemoved', { detail: { item } });
  document.dispatchEvent(event);
  
  const existingTotal = document.querySelector('.total-display');
  if (existingTotal) {
    existingTotal.remove();
  }
};

// Listen for item removal event
document.addEventListener('itemRemoved', (e) => {
  console.log(`Item ${e.detail.item} removed from order`);
});

// Function to calculate the total cost
const calculateTotal = (container, itemPrices) => {
  let total = 0;
  let itemCount = 0;
  const itemRows = container.querySelectorAll('.form-row[data-item]');
  
  if (itemRows.length === 0) {
    showTotal(0, 0, container);
    return;
  }
  
  itemRows.forEach(row => {
    const item = row.getAttribute('data-item');
    const safeId = sanitizeId(item);
    const qtyInput = document.getElementById(`qty-${safeId}`);
    if (!qtyInput) {
      console.warn(`No quantity input found for item: ${item}`);
      return;
    }
    const quantity = parseInt(qtyInput.value) || 0;
    const price = itemPrices[item] || 0;
    
    total += price * quantity;
    itemCount += quantity;
  });
  
  showTotal(total, itemCount, container);
};

// Function to display the total
const showTotal = (total, itemCount, container) => {
  const existingTotal = document.querySelector('.total-display');
  if (existingTotal) {
    existingTotal.remove();
  }
  
  const totalDisplay = document.createElement('div');
  totalDisplay.className = 'total-display';
  totalDisplay.style.cssText = `
    background: rgba(9, 33, 131, 0.9);
    color: white;
    padding: 1rem;
    border-radius: 10px;
    margin-top: 1rem;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
  `;
  
  if (total > 0) {
    totalDisplay.innerHTML = `
      <div>Total Items: ${itemCount}</div>
      <div>Total Cost: $${total.toFixed(2)}</div>
    `;
  } else {
    totalDisplay.innerHTML = `
      <div>No items selected</div>
      <div>Total: $0.00</div>
    `;
  }
  
  const calculateBtn = document.querySelector('.calculate-total-btn');
  calculateBtn.parentNode.insertBefore(totalDisplay, calculateBtn.nextSibling);
};

// Function to handle place order
const handlePlaceOrder = (e, itemContainer, itemPrices) => {
  e.preventDefault();
  
  // Get contact details
  const contactData = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    comments: document.getElementById('comments').value
  };
  
  // Validate contact details
  if (!contactData.name || !contactData.phone || !contactData.address) {
    alert('Please fill in all required contact details (Name, Phone, Address)');
    return;
  }
  
  // Get order items
  const itemRows = itemContainer.querySelectorAll('.form-row[data-item]');
  
  if (itemRows.length === 0) {
    alert('Please add at least one item to your order');
    return;
  }
  
  const orderItems = [];
  let totalCost = 0;
  let totalQuantity = 0;
  
  itemRows.forEach(row => {
    const item = row.getAttribute('data-item');
    const safeId = sanitizeId(item);
    const qtyInput = row.querySelector(`#qty-${safeId}`);
    if (!qtyInput) {
      console.warn(`Missing quantity input for ${item}`);
      return;
    }
    const quantity = parseInt(qtyInput.value) || 0;
    const price = itemPrices[item] || 0;
    const itemTotal = price * quantity;
    
    orderItems.push({
      name: item,
      quantity: quantity,
      price: price,
      total: itemTotal
    });
    
    totalCost += itemTotal;
    totalQuantity += quantity;
  });
  
  // Create order object
  const order = {
    id: generateOrderId(),
    timestamp: new Date().toISOString(),
    customer: contactData,
    items: orderItems,
    totalQuantity: totalQuantity,
    totalCost: totalCost.toFixed(2),
    status: 'pending'
  };
  
  // Store in localStorage
  try {
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
    existingOrders.push(order);
    
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    localStorage.setItem('latestOrder', JSON.stringify(order));
    
    alert(`
Total Items: ${totalQuantity}
Total Cost: $${order.totalCost}

Thank you for your order!`);
    
    resetOrderForm();
    
  } catch (error) {
    console.error('Error saving order:', error);
    alert('There was an error processing your order. Please try again.');
  }
};

const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Function to reset the order form
const resetOrderForm = () => {
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('address').value = '';
  document.getElementById('comments').value = '';
  
  const itemContainer = document.getElementById('item-container');
  itemContainer.innerHTML = '';
  
  const existingTotal = document.querySelector('.total-display');
  if (existingTotal) {
    existingTotal.remove();
  }
  
  const dropdown = document.getElementById('dropdown');
  dropdown.value = '';
};
