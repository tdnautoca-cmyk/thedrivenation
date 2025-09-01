// Vehicle Detail Page Handler
document.addEventListener('DOMContentLoaded', async () => {
  // Get stock number from URL
  const urlParams = new URLSearchParams(window.location.search);
  const stockNumber = urlParams.get('stock');
  
  if (!stockNumber) {
    displayError('No vehicle specified');
    return;
  }
  
  await loadVehicleDetails(stockNumber);
  
  async function loadVehicleDetails(stockNumber) {
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const vehicleContent = document.getElementById('vehicle-content');
    
    try {
      // Load vehicle data
      const vehicle = await InventoryLoader.getVehicleByStock(stockNumber);
      
      if (!vehicle) {
        displayError('Vehicle not found');
        return;
      }
      
      // Hide loading, show content
      loadingMessage.style.display = 'none';
      vehicleContent.style.display = 'block';
      
      // Update page title
      document.title = `${vehicle.displayTitle} - Drive Nation`;
      
      // Populate vehicle details
      populateVehicleDetails(vehicle);
      
      // Load gallery images
      loadGalleryImages(vehicle);
      
    } catch (error) {
      console.error('Error loading vehicle details:', error);
      displayError('Unable to load vehicle details. Please try again later.');
    }
  }
  
  function populateVehicleDetails(vehicle) {
    // Hero image
    const heroImg = document.getElementById('hero-image');
    heroImg.src = vehicle.mainImage;
    heroImg.alt = `${vehicle.displayTitle} - Main Image`;
    heroImg.onerror = function() {
      this.src = CONFIG.DEFAULT_IMAGE;
    };
    
    // Basic details
    document.getElementById('vehicle-price').textContent = vehicle.displayPrice;
    document.getElementById('vehicle-year').textContent = vehicle.year;
    document.getElementById('vehicle-make-model').textContent = 
      `${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`.trim();
    document.getElementById('vehicle-mileage').textContent = vehicle.displayMileage;
    document.getElementById('vehicle-drivetrain').textContent = vehicle.drivetrain;
    document.getElementById('vehicle-transmission').textContent = vehicle.transmission;
    document.getElementById('vehicle-fuel').textContent = vehicle.fuelType;
    document.getElementById('vehicle-vin').textContent = vehicle.vin;
    document.getElementById('vehicle-stock').textContent = vehicle.stockNumber;
    document.getElementById('vehicle-description').textContent = vehicle.description;
  }
  
  function loadGalleryImages(vehicle) {
    const gallery = document.getElementById('image-gallery');
    gallery.innerHTML = '';
    
    // If imageCount is provided and > 0, use it. Otherwise, try to load up to MAX_GALLERY_IMAGES
    const maxImages = vehicle.imageCount > 0 ? vehicle.imageCount : CONFIG.MAX_GALLERY_IMAGES;
    let loadedImages = 0;
    let consecutiveFailures = 0;
    
    // Load images sequentially until we hit max or find 3 consecutive missing images
    for (let i = 1; i <= maxImages; i++) {
      const img = document.createElement('img');
      img.src = `${CONFIG.IMAGE_BASE_PATH}${vehicle.stockNumber}/${i}.jpg`;
      img.alt = `${vehicle.displayTitle} - Image ${i}`;
      img.loading = 'lazy';
      img.dataset.imageNumber = i;
      
      // Track successful loads and failures
      img.onload = function() {
        loadedImages++;
        consecutiveFailures = 0;
        this.style.display = 'block';
      };
      
      img.onerror = function() {
        consecutiveFailures++;
        this.style.display = 'none';
        
        // If we have 3 consecutive failures and we're detecting dynamically, stop trying
        if (vehicle.imageCount === 0 && consecutiveFailures >= 3 && loadedImages > 0) {
          // Remove this and all subsequent images
          const imageNum = parseInt(this.dataset.imageNumber);
          for (let j = imageNum; j <= maxImages; j++) {
            const imgToRemove = gallery.querySelector(`img[data-image-number="${j}"]`);
            if (imgToRemove) imgToRemove.remove();
          }
        }
      };
      
      // Initially hide the image until it loads
      img.style.display = 'none';
      gallery.appendChild(img);
    }
  }
  
  function displayError(message) {
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const vehicleContent = document.getElementById('vehicle-content');
    
    loadingMessage.style.display = 'none';
    vehicleContent.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = `
      <h2>Error</h2>
      <p>${message}</p>
      <p><a href="inventory.html">Return to Inventory</a></p>
    `;
  }
});