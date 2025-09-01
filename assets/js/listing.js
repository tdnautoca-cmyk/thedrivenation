const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMq8tpDxojExGJllyMGhtNga_mX6k-ZoiClIRk2Mj8nsjBv0cV-ZS4QVHy39yG4_DvQgvgAYZcpp0s/pub?output=csv";
const params = new URLSearchParams(window.location.search);
const stockNumber = params.get("stock");
const listingContainer = document.getElementById("listing");

if (!stockNumber) {
  listingContainer.innerHTML = "<p>Invalid stock number.</p>";
} else {
  fetch(csvUrl)
    .then((response) => response.text())
    .then((data) => {
      const rows = data.trim().split("\n").map((row) => row.split(","));
      const headers = rows[0].map((h) => h.trim());
      const listings = rows.slice(1).map((row) => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = row[i]?.trim();
        });
        return obj;
      });

      const car = listings.find((car) => car["Stock Number"] === stockNumber);

      if (!car) {
        listingContainer.innerHTML = "<p>Listing not found.</p>";
        return;
      }

      const {
        Year,
        Make,
        Model,
        Trim,
        Price,
        "Mileage (in KM)": Mileage,
        Transmission,
        Drivetrain,
        "Fuel Type": Fuel,
        VIN,
        "Stock Number": Stock,
        "Vehicle Overview": Overview,
        "Image Count": ImageCount,
        "Listing Status": Status,
      } = car;

      const title = `${Year} ${Make} ${Model} ${Trim}`;
      document.title = title;

      let galleryHTML = "";
      const count = parseInt(ImageCount);
      for (let i = 1; i <= count; i++) {
        galleryHTML += `<img src="assets/images/${Stock.toLowerCase()}_${i}.jpg" alt="${title} - ${i}">`;
      }

      listingContainer.innerHTML = `
        <img src="assets/images/${Stock.toLowerCase()}_1.jpg" alt="${title}" class="hero-img">

        ${Status.toLowerCase() === "sold" ? '<div class="sold-banner">SOLD</div>' : ''}

        <section class="car-specs">
          <h2>$${Price}</h2>
          <p><strong>Mileage:</strong> ${Mileage} km</p>
          <p><strong>Drivetrain:</strong> ${Drivetrain}</p>
          <p><strong>Transmission:</strong> ${Transmission}</p>
          <p><strong>Fuel Type:</strong> ${Fuel}</p>
          <p><strong>VIN:</strong> ${VIN}</p>
          <p><strong>Stock No:</strong> ${Stock}</p>
        </section>

        <section class="car-description">
          <h3>Vehicle Overview</h3>
          <p>${Overview}</p>
        </section>

        <section class="gallery">
          <h3>Photo Gallery</h3>
          ${galleryHTML}
        </section>
      `;
    })
    .catch((error) => {
      listingContainer.innerHTML = "<p>Error loading listing.</p>";
      console.error("Error fetching listing:", error);
    });
}
