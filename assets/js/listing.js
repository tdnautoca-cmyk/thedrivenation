const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMq8tpDxojExGJllyMGhtNga_mX6k-ZoiClIRk2Mj8nsjBv0cV-ZS4QVHy39yG4_DvQgvgAYZcpp0s/pub?output=csv";

const urlParams = new URLSearchParams(window.location.search);
const stockNumber = urlParams.get("stock");

fetch(csvUrl)
  .then(response => response.text())
  .then(data => {
    const rows = data.trim().split("\n").map(row => row.split(","));
    const headers = rows[0].map(h => h.trim());
    const listings = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]?.trim() || "");
      return obj;
    });

    const car = listings.find(car => car["Stock Number"] === stockNumber);
    const container = document.getElementById("listing");

    if (!car) {
      container.innerHTML = "<p>Car not found.</p>";
      return;
    }

    const title = `${car["Year"]} ${car["Make"]} ${car["Model"]} ${car["Trim"]}`;
    const heroImage = `assets/images/${stockNumber.toLowerCase()}_1.jpg`;
    const imageCount = parseInt(car["Image Count"]) || 0;

    let galleryHTML = "";
    for (let i = 1; i <= imageCount; i++) {
      const imgSrc = `assets/images/${stockNumber.toLowerCase()}_${i}.jpg`;
      galleryHTML += `<img src="${imgSrc}" alt="${title} - ${i}">`;
    }

    const soldBanner = car["Listing Status"]?.toLowerCase() === "sold"
      ? `<div class="sold-banner">SOLD</div>` : "";

    document.title = title; // Set browser title

    container.innerHTML = `
      <h1>${title}</h1>
      ${soldBanner}
      <img src="${heroImage}" alt="${title}" class="hero-img">

      <section class="car-specs">
        <h2>$${car["Price"]}</h2>
        <p><strong>Mileage:</strong> ${car["Mileage (in KM)"]} km</p>
        <p><strong>Drivetrain:</strong> ${car["Drivetrain"] || car["Drivetrain "]}</p>
        <p><strong>Transmission:</strong> ${car["Transmission"]}</p>
        <p><strong>Fuel Type:</strong> ${car["Fuel Type"] || car["Fuel Type "]}</p>
        <p><strong>VIN:</strong> ${car["VIN"]}</p>
        <p><strong>Stock No:</strong> ${car["Stock Number"]}</p>
      </section>

      <section class="car-description">
        <h3>Vehicle Overview</h3>
        <p>${car["Vehicle Overview"]}</p>
      </section>

      <section class="gallery">
        <h3>Photo Gallery</h3>
        ${galleryHTML}
      </section>
    `;
  })
  .catch(error => {
    document.getElementById("listing").innerHTML = "<p>Error loading listing.</p>";
    console.error("Error fetching listing:", error);
  });
