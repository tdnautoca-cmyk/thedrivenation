const urlParams = new URLSearchParams(window.location.search);
const stockNumber = urlParams.get("stock");

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMq8tpDxojExGJllyMGhtNga_mX6k-ZoiClIRk2Mj8nsjBv0cV-ZS4QVHy39yG4_DvQgvgAYZcpp0s/pub?output=csv";

fetch(csvUrl)
  .then((response) => response.text())
  .then((data) => {
    const rows = data.trim().split("\n").map((row) => row.split(","));
    const headers = rows[0].map(h => h.trim());
    const listings = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] ? row[i].trim() : "";
      });
      return obj;
    });

    const car = listings.find((item) => item["Stock Number"] === stockNumber);

    if (!car) {
      document.getElementById("listing").innerHTML = "<p>Vehicle not found.</p>";
      return;
    }

    const title = `${car["Year"]} ${car["Make"]} ${car["Model"]} ${car["Trim"]}`;
    const imageBase = `assets/images/${stockNumber.toLowerCase()}`;
    const mainImage = `${imageBase}_1.jpg`;

    // Insert main content
    document.getElementById("listing").innerHTML = `
      <h2 class="hero-title">${title}</h2>
      <img src="${mainImage}" alt="${title}" class="main-image" />
      <section class="car-specs">
        <p><strong>$${car["Price"]}</strong></p>
        <p><strong>Mileage:</strong> ${car["Mileage (in KM)"]} km</p>
        <p><strong>Drivetrain:</strong> ${car["Drivetrain"]}</p>
        <p><strong>Transmission:</strong> ${car["Transmission"]}</p>
        <p><strong>Fuel Type:</strong> ${car["Fuel Type"]}</p>
        <p><strong>VIN:</strong> ${car["VIN"]}</p>
        <p><strong>Stock No:</strong> ${car["Stock Number"]}</p>
      </section>

      <section class="car-description">
        <h3>Vehicle Overview</h3>
        <p>${car["Vehicle Overview"] || "No description available."}</p>
      </section>

      <section class="gallery">
        <h3>Photo Gallery</h3>
        <div id="gallery-container"></div>
      </section>
    `;

    // Dynamically load gallery images
    const galleryDiv = document.getElementById("gallery-container");

    for (let i = 2; i <= 20; i++) {
      const img = new Image();
      const path = `${imageBase}_${i}.jpg`;

      img.src = path;
      img.alt = `${title} photo ${i}`;
      img.onload = () => galleryDiv.appendChild(img);
      img.onerror = () => {}; // skip if image not found
    }
  })
  .catch((error) => {
    document.getElementById("listing").innerHTML = "<p>Error loading vehicle details.</p>";
    console.error("Error:", error);
  });
