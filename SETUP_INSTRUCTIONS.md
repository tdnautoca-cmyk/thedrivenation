# Drive Nation Inventory System Setup Instructions

## Overview
This system pulls inventory data from a Google Sheet (published as CSV) and displays it dynamically on your GitHub Pages website.

## Setup Steps

### 1. Prepare Your Google Sheet

Create a Google Sheet with the following columns:
- **Timestamp**: Auto-generated timestamp (optional)
- **Year**: Vehicle year
- **Make**: Vehicle manufacturer
- **Model**: Vehicle model
- **Trim**: Optional trim level
- **Price**: Price without currency symbol
- **Mileage (in KM)**: Mileage in kilometers
- **Transmission**: Automatic/Manual
- **Drivetrain**: FWD/RWD/AWD
- **Fuel Type**: Gasoline/Diesel/Hybrid/Electric
- **Color**: Vehicle color
- **VIN**: Vehicle identification number
- **Stock Number**: Unique identifier (e.g., DNC-2025-008)
- **Vehicle Overview**: Detailed vehicle description
- **Image Count**: Number of images (optional - system can detect automatically)
- **Listing Status**: "Available" to show, anything else to hide

### 2. Publish Google Sheet as CSV

1. Open your Google Sheet
2. Go to **File > Share > Publish to web**
3. Under "Link", choose:
   - **Entire Document** (or specific sheet)
   - **Comma-separated values (.csv)**
4. Click **Publish**
5. Copy the generated URL

The URL will look like:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0
```

### 3. Configure the Website

The website is already configured with your Google Sheet URL. If you need to change it, edit `/assets/js/config.js`:

```javascript
GOOGLE_SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMq8tpDxojExGJllyMGhtNga_mX6k-ZoiClIRk2Mj8nsjBv0cV-ZS4QVHy39yG4_DvQgvgAYZcpp0s/pub?output=csv',
```

### 4. Image Organization

Images should be organized in folders by stock number (lowercase):
```
/assets/images/inventory/
  /dnc-2025-008/   (lowercase folder name)
    1.jpg
    2.jpg
    3.jpg
    ...
  /dnc-2025-009/
    1.jpg
    2.jpg
    ...
```

- Folder names should be lowercase (e.g., `dnc-2025-008` not `DNC-2025-008`)
- Images must be numbered sequentially starting from 1
- Use .jpg extension
- The system can automatically detect the number of images if Image Count is not specified
- It will try loading images until it finds 3 consecutive missing images

### 5. Testing Locally

To test locally, you'll need to run a local server due to CORS restrictions:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if http-server is installed)
npx http-server
```

Then visit `http://localhost:8000/inventory.html`

### 6. Deployment

1. Commit and push all changes to GitHub
2. Ensure GitHub Pages is enabled in repository settings
3. The site will be available at: `https://[username].github.io/[repository]/`

## Managing Inventory

### Adding a Vehicle
1. Add a new row in Google Sheet with all details
2. Set Listing Status to "Available"
3. Upload images to `/assets/images/inventory/[stock-number]/` (use lowercase folder name)
4. Images automatically appear on the website

### Removing a Vehicle
1. Change Listing Status to "Sold" or anything other than "Available" in Google Sheet
2. Vehicle disappears from website after cache expires or refresh
3. Optionally delete image folder to save space

### Updating Vehicle Information
1. Edit the row in Google Sheet
2. Changes appear after cache expires (1 hour) or when users click "Refresh Inventory"

## Troubleshooting

### Images Not Loading
- Check image folder name matches StockNumber exactly
- Verify images are numbered correctly (1.jpg, 2.jpg, etc.)
- Ensure ImageCount in spreadsheet matches actual number of images

### Inventory Not Loading
- Verify Google Sheet is published correctly
- Check browser console for errors
- Ensure CSV URL is correctly set in config.js
- Try clearing browser cache/localStorage

### CORS Errors
- Make sure Google Sheet is published to web (not just shared)
- The published CSV URL should work without authentication

## Features

- **Automatic Caching**: Data cached for 1 hour to reduce load
- **Offline Support**: Shows cached data if Google Sheets unavailable
- **Lazy Loading**: Images load as user scrolls
- **Responsive Design**: Works on mobile and desktop
- **Dynamic URLs**: Vehicle pages use `vehicle.html?stock=STOCK_NUMBER`

## Sample Data

A sample CSV file is provided at `sample-inventory.csv` for reference.

## Support

For issues or questions, contact Drive Nation at:
- Phone: 250-329-6907
- Email: tdnautoca@gmail.com