// Enhanced Inventory Data Loader with Multiple Fallbacks
class InventoryLoader {
  static async loadInventory(forceRefresh = false) {
    // Check cache first
    if (!forceRefresh) {
      const cachedData = this.getCachedData();
      if (cachedData) {
        console.log('Loading inventory from cache');
        return cachedData;
      }
    }
    
    // Try different data sources in order
    let data = null;
    
    // Method 1: Try direct Google Sheets fetch (works on GitHub Pages)
    try {
      console.log('Attempting to fetch from Google Sheets directly...');
      data = await this.fetchGoogleSheetData();
      console.log('Successfully loaded from Google Sheets');
    } catch (error) {
      console.warn('Direct Google Sheets fetch failed:', error.message);
      
      // Method 2: Try with CORS proxy (for local development)
      try {
        console.log('Attempting with CORS proxy for local development...');
        data = await this.fetchWithCorsProxy();
        console.log('Successfully loaded via CORS proxy');
      } catch (proxyError) {
        console.error('CORS proxy failed:', proxyError.message);
        
        // Last resort: return cached data even if expired
        const expiredCache = this.getCachedData(true);
        if (expiredCache) {
          console.log('Using expired cache as last resort');
          return expiredCache;
        }
        
        throw new Error('Unable to load inventory data. Please ensure you are running a local server or try again later.');
      }
    }
    
    // Cache the successful data
    if (data) {
      this.setCachedData(data);
    }
    
    return data;
  }
  
  static async fetchGoogleSheetData() {
    const response = await fetch(CONFIG.GOOGLE_SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    const data = CSVParser.parse(csvText);
    
    // Filter and process the data
    const activeInventory = data.filter(vehicle => 
      vehicle['Listing Status']?.toLowerCase() === 'available'
    );
    
    return activeInventory.map(vehicle => this.processVehicle(vehicle));
  }
  
  static async fetchWithCorsProxy() {
    const proxyUrl = CONFIG.CORS_PROXY + encodeURIComponent(CONFIG.GOOGLE_SHEET_CSV_URL);
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Proxy error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    const data = CSVParser.parse(csvText);
    
    const activeInventory = data.filter(vehicle => 
      vehicle['Listing Status']?.toLowerCase() === 'available'
    );
    
    return activeInventory.map(vehicle => this.processVehicle(vehicle));
  }
  
  static processVehicle(vehicle) {
    // Map the actual Google Sheet column names
    const stockNumber = (vehicle['Stock Number'] || '').toLowerCase();
    const year = vehicle.Year || '';
    const make = vehicle.Make || '';
    const model = vehicle.Model || '';
    const trim = vehicle.Trim || '';
    const price = vehicle.Price || '0';
    const mileage = vehicle['Mileage (in KM)'] || '0';
    
    return {
      stockNumber: stockNumber,
      year: year,
      make: make,
      model: model,
      trim: trim,
      price: price,
      mileage: mileage,
      transmission: vehicle.Transmission || '',
      drivetrain: vehicle.Drivetrain || '',
      fuelType: vehicle['Fuel Type'] || '',
      color: vehicle.Color || '',
      vin: vehicle.VIN || '',
      description: vehicle['Vehicle Overview'] || '',
      imageCount: parseInt(vehicle['Image Count']) || 0,
      status: vehicle['Listing Status'] || 'Available',
      timestamp: vehicle.Timestamp || '',
      
      // Computed properties
      mainImage: this.getMainImageUrl(stockNumber),
      detailUrl: `vehicle.html?stock=${stockNumber}`,
      displayPrice: this.formatPrice(price),
      displayMileage: this.formatMileage(mileage),
      displayTitle: `${year} ${make} ${model} ${trim || ''}`.trim()
    };
  }
  
  static getMainImageUrl(stockNumber) {
    if (!stockNumber) return CONFIG.DEFAULT_IMAGE;
    return `${CONFIG.IMAGE_BASE_PATH}${stockNumber}/1.jpg`;
  }
  
  static getImageUrls(stockNumber, imageCount) {
    const urls = [];
    for (let i = 1; i <= imageCount; i++) {
      urls.push(`${CONFIG.IMAGE_BASE_PATH}${stockNumber}/${i}.jpg`);
    }
    return urls;
  }
  
  static formatPrice(price) {
    const num = parseFloat(price) || 0;
    return CONFIG.CURRENCY_SYMBOL + num.toLocaleString();
  }
  
  static formatMileage(mileage) {
    const num = parseFloat(mileage) || 0;
    return num.toLocaleString() + ' ' + CONFIG.DISTANCE_UNIT;
  }
  
  static getCachedData(ignoreExpiry = false) {
    try {
      const cached = localStorage.getItem(CONFIG.CACHE_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      
      // Check if cache is expired
      if (!ignoreExpiry && Date.now() - timestamp > CONFIG.CACHE_DURATION) {
        localStorage.removeItem(CONFIG.CACHE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }
  
  static setCachedData(data) {
    try {
      const cacheObject = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }
  
  static clearCache() {
    localStorage.removeItem(CONFIG.CACHE_KEY);
  }
  
  static async getVehicleByStock(stockNumber) {
    const inventory = await this.loadInventory();
    // Convert to lowercase for comparison
    return inventory.find(vehicle => vehicle.stockNumber === stockNumber.toLowerCase());
  }
}