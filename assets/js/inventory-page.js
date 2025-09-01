// Inventory Page Handler
document.addEventListener('DOMContentLoaded', async () => {
  const inventoryContainer = document.getElementById('inventory-container');
  const loadingMessage = document.getElementById('loading-message');
  const errorMessage = document.getElementById('error-message');
  const refreshButton = document.getElementById('refresh-inventory');
  
  // Add refresh button handler
  if (refreshButton) {
    refreshButton.addEventListener('click', () => loadInventoryPage(true));
  }
  
  // Load inventory on page load
  await loadInventoryPage();
  
  async function loadInventoryPage(forceRefresh = false) {
    try {
      // Show loading state
      if (loadingMessage) loadingMessage.style.display = 'block';
      if (errorMessage) errorMessage.style.display = 'none';
      if (inventoryContainer) inventoryContainer.innerHTML = '';
      
      // Load inventory data
      const inventory = await InventoryLoader.loadInventory(forceRefresh);
      
      // Hide loading state
      if (loadingMessage) loadingMessage.style.display = 'none';
      
      if (inventory.length === 0) {
        displayNoInventory();
        return;
      }
      
      // Display inventory
      displayInventory(inventory);
      
    } catch (error) {
      console.error('Error loading inventory page:', error);
      displayError(error.message);
    }
  }
  
  function displayInventory(vehicles) {
    if (!inventoryContainer) return;
    
    inventoryContainer.innerHTML = '';
    
    vehicles.forEach(vehicle => {
      const card = createVehicleCard(vehicle);
      inventoryContainer.appendChild(card);
    });
  }
  
  function createVehicleCard(vehicle) {
    const link = document.createElement('a');
    link.href = vehicle.detailUrl;
    link.className = 'vehicle-link';
    
    const card = document.createElement('div');
    card.className = 'car-card';
    
    const img = document.createElement('img');
    img.src = vehicle.mainImage;
    img.alt = vehicle.displayTitle;
    img.loading = 'lazy';
    img.onerror = function() {
      this.src = CONFIG.DEFAULT_IMAGE;
    };
    
    const title = document.createElement('h3');
    title.textContent = vehicle.displayTitle;
    
    const details = document.createElement('p');
    details.className = 'vehicle-details';
    details.textContent = `${vehicle.displayMileage} — ${vehicle.displayPrice}`;
    
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(details);
    link.appendChild(card);
    
    return link;
  }
  
  function displayNoInventory() {
    if (!inventoryContainer) return;
    
    inventoryContainer.innerHTML = `
      <div class="no-inventory">
        <h2>No Vehicles Available</h2>
        <p>Please check back soon for our latest inventory.</p>
      </div>
    `;
  }
  
  function displayError(message) {
    if (loadingMessage) loadingMessage.style.display = 'none';
    
    if (errorMessage) {
      errorMessage.style.display = 'block';
      errorMessage.innerHTML = `
        <p>Error loading inventory: ${message}</p>
        <p>Please try refreshing the page or contact us directly.</p>
      `;
    }
    
    if (inventoryContainer) {
      inventoryContainer.innerHTML = `
        <div class="error-message">
          <h2>Unable to Load Inventory</h2>
          <p>Please try refreshing the page or contact us at 250-329-6907</p>
        </div>
      `;
    }
  }
});