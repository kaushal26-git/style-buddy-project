document.addEventListener("DOMContentLoaded", () => {
  const greetingText = document.getElementById("greeting-text");
  const weatherMain = document.getElementById("weather-main");
  const weatherTemp = document.getElementById("weather-temp");
  const weatherEmoji1 = document.getElementById("weather-emoji");
  const weatherEmoji2 = document.getElementById("weather-emoji2");

  const apiKey = "b55e86b39d09ff9b4ffc4dd44954e56f";

  async function initGreetingAndWeather() {
    let name = localStorage.getItem("userName");
    let city = localStorage.getItem("userCity");

    
    if (!name) {
      name = prompt("Enter your name:");
      if (name) localStorage.setItem("userName", name);
    }

    if (!city) {
      city = prompt("Enter your city name:");
      if (city) localStorage.setItem("userCity", city);
    }

    if (!name || !city) {
      greetingText.textContent = "Welcome to Style Buddy 👋";
      return;
    }

    greetingText.textContent = `Hello ${name} `;
    updateWeather(city);
  }

  async function updateWeather(city) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        weatherMain.textContent = "City not found";
        weatherTemp.textContent = "--°C";
        weatherEmoji1.textContent = "❓";
        weatherEmoji2.textContent = "❓";
        return;
      }

      const temp = Math.round(data.main.temp);
      const condition = data.weather[0].main.toLowerCase();

      let emoji = "🌤️";
      if (condition.includes("cloud")) emoji = "☁️";
      else if (condition.includes("rain")) emoji = "🌧️";
      else if (condition.includes("clear")) emoji = "☀️";
      else if (condition.includes("snow")) emoji = "❄️";

      weatherMain.textContent = condition.charAt(0).toUpperCase() + condition.slice(1);
      weatherTemp.textContent = `${temp}°C`;
      weatherEmoji1.textContent = emoji;
      weatherEmoji2.textContent = emoji;
    } catch (err) {
      weatherMain.textContent = "N/A";
      weatherTemp.textContent = "--°C";
    }
  }

  initGreetingAndWeather();
});
document.addEventListener("DOMContentLoaded", () => {
  const catCards = document.querySelectorAll(".cat-card");
  const outfitSection = document.getElementById("outfit-section");
  const outfitBox = document.querySelector(".outfit-box");
  const outfitHeading = outfitSection.querySelector("h2");

  
  const outfits = {
    casual: [
      { name: "T-shirt & Jeans", img:"homepage_Casual/casual1.png" },
      { name: "Hoodie & Joggers", img: "homepage_Casual/casual2.jpg" },
      { name: "Shirt & Shorts", img: "homepage_Casual/casual3.jpg" },
    ],
    formal: [
      { name: "Suit & Tie", img:"homepage_Forml/formal1.jpg" },
      { name: "Blazer & Pants", img: "homepage_Forml/formal2.jpg" },
      { name: "Shirt & Trousers", img: "homepage_Forml/formal3.jpg" },
    ],
    partywear: [
      { name: "Black satin shirt & slim-fit jeans", img: "homepage_partywear/party1.jpg" },
      { name: "White linen shirt & beige chinos & loafers", img: "homepage_partywear/party2.jpg" },
      { name: "Jacket & Shirt & cargo pant", img: "homepage_partywear/party3.jpg" },
    ],
    nightwear: [
      { name: "Cotton T-shirt & Shorts", img: "homepage_nightwear/nightWear1.jpg" },
      { name: "Loose tank top & Cotton boxers", img: "homepage_nightwear/nightwear2.jpg" },
      { name: "Plain T-shirt & lower", img: "homepage_nightwear/nightwear3.jpg" },
    ],
  };

  catCards.forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.querySelector("p").textContent.toLowerCase();

    
      outfitSection.style.display = "block";
      outfitSection.scrollIntoView({ behavior: "smooth" });

    
      outfitHeading.textContent = `Your Outfit Idea (${category.charAt(0).toUpperCase() + category.slice(1)})`;

      
      outfitBox.innerHTML = "";

      
      if (outfits[category]) {
        outfits[category].forEach((item) => {
          const cardDiv = document.createElement("div");
          cardDiv.classList.add("cat-card");
          cardDiv.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <p>${item.name}</p>
          `;
          outfitBox.appendChild(cardDiv);
        });
      } else {
        outfitBox.innerHTML = "<p>No outfits found 👕</p>";
      }
    });
  });
});
