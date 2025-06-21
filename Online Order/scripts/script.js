document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('dropdown');
  const itemContainer = document.getElementById('item-container');
  const selectedItems = new Set();

  dropdown.addEventListener('change', () => handleDropdownChange(dropdown, itemContainer, selectedItems));
});

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

const addItemRow = (container, item) => {
  const row = document.createElement('div');
  row.className = 'form-row';

  const itemLabel = document.createElement('label');
  itemLabel.textContent = `Item: ${item}`;
  itemLabel.setAttribute('for', `item-${item}`);

  const itemInput = document.createElement('input');
  itemInput.type = 'text';
  itemInput.name = `item-${item}`;
  itemInput.id = `item-${item}`;
  itemInput.value = item;
  itemInput.readOnly = true;

  const qtyLabel = document.createElement('label');
  qtyLabel.textContent = 'QTY';
  qtyLabel.setAttribute('for', `qty-${item}`);

  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.name = `qty-${item}`;
  qtyInput.id = `qty-${item}`;
  qtyInput.min = 1;
  qtyInput.value = 1;

  [itemLabel, itemInput, qtyLabel, qtyInput].forEach(el => row.appendChild(el));
  container.appendChild(row);
};
