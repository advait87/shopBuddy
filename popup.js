// When the "Analyze" button is clicked
document.getElementById('abtn').addEventListener('click', () => {
    // Open the new tab for analysis
    chrome.tabs.create({ url: chrome.runtime.getURL('analyze.html') });
  });


  // When the "Add to List" button is clicked
document.getElementById('addToListBtn').addEventListener('click', () => {
    console.log('Sending message to background script...');
    
    // Send message to background.js to add product
    chrome.runtime.sendMessage({ action: 'addToList' }, (response) => {
      console.log(response.message);  // Log the result of adding the product
    });
});
  
  // When the "Clear" button is clicked
document.getElementById('clearBtn').addEventListener('click', () => {
    console.log('Clearing list...');
    chrome.storage.local.set({ products: [] }, () => {
      console.log('List cleared!');
    });
});
  
  // Get the list of products from chrome.storage.local
chrome.storage.local.get({ products: [] }, (result) => {
    const products = result.products;
  
    console.log('Populating list...');
    products.forEach((product) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${product.productName}`;
      document.getElementById('productList').appendChild(listItem);
    });
});
  