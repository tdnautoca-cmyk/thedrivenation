// Configuration for Drive Nation Inventory System
const CONFIG = {
  // Google Sheets CSV URL
  GOOGLE_SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMq8tpDxojExGJllyMGhtNga_mX6k-ZoiClIRk2Mj8nsjBv0cV-ZS4QVHy39yG4_DvQgvgAYZcpp0s/pub?output=csv',
  
  // CORS proxy for local development
  CORS_PROXY: 'https://corsproxy.io/?',
  
  // Cache settings
  CACHE_DURATION: 60 * 60 * 1000, // 1 hour in milliseconds
  CACHE_KEY: 'driveNationInventory',
  
  // Image settings
  IMAGE_BASE_PATH: 'assets/images/inventory/',
  DEFAULT_IMAGE: 'assets/images/logo.jpeg',
  MAX_GALLERY_IMAGES: 20, // Maximum number of images to try loading
  
  // UI settings
  CURRENCY_SYMBOL: '$',
  DISTANCE_UNIT: 'km'
};