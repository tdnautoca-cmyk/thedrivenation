const urlParams = new URLSearchParams(window.location.search);
const stockNumber = urlParams.get("stock");

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMq8tpDxojExGJllyMGhtNga_mX6k-ZoiClIRk2Mj8nsjBv0cV-ZS4QVHy39yG4_DvQgvgAYZcpp0s/pub?output=csv";

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    const listings = results.data;
    const car = listings.find((item) => item["Stock Number"] === stockNumber);

    if (!car) {
      document.getElementById("listing").innerHTML = "<p>Vehicle not found.</p>";
      return;
    }

    const title = `${car["Year"]} ${car["Make"]} ${car["Model"]} ${car["Trim"]}`;
    const imageBase = `assets/images/${stockNumber.toLowerCase()}`;
    const mainImage = `${imageBase}_1.jpg`;

    // Render main car data
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
        <p>${car["Vehicle Overview"]}</p>
      </section>

      <section class="gallery">
        <h3>Photo Gallery</h3>
        <div id="gallery-container" class="gallery-grid"></div>
      </section>
    `;

    // Dynamically load gallery images with Lightbox support
    const galleryDiv = document.getElementById("gallery-container");

    for (let i = 1; i <= 20; i++) {
      const path = `${imageBase}_${i}.jpg`;
      const img = new Image();

      img.src = path;
      img.alt = `${title} photo ${i}`;
      img.className = "gallery-image";
      img.loading = "lazy";

      const anchor = document.createElement("a");
      anchor.href = path;
      anchor.setAttribute("data-lightbox", stockNumber);  // Group by stock
      anchor.setAttribute("data-title", `${title} photo ${i}`);  // Better UX
      anchor.appendChild(img);

      img.onerror = () => {}; // Skip missing images
      img.onload = () => {
        link.appendChild(img);
        galleryDiv.appendChild(link);
      };
    }
  },
  error: function(err) {
    document.getElementById("listing").innerHTML = "<p>Error loading vehicle details.</p>";
    console.error("Error parsing CSV:", err);
  }
});
