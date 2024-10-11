let weather = {
  apiKey: "9eaf2f94995496f2911d2cf3d4d5d443",  // OpenWeatherMap API key
  unsplashApiKey: "XZZXikHzrwuuHLyepU3EsnRyf-f66dC6PwtPsKTZaH4",  // Unsplash API key
  
  // Mapping country codes to full country names
  countryNames: {
    "US": "United States",
    "GB": "United Kingdom",
    "FR": "France",
    "DE": "Germany",
    "JP": "Japan",
    "IN": "India",
    // Add more country codes as needed
  },

  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.fetchBackgroundImage(city, data.sys.country);  // Fetch background image with country
        this.displayTime(data.timezone);  // Display the current time
      });
  },

  displayWeather: function (data) {
    const { name } = data;
    const { country } = data.sys;  // Country code from OpenWeatherMap API
    const fullCountryName = this.countryNames[country] || country;  // Get full country name
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = `Weather in ${name}, ${fullCountryName}`;  // Include full country name
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
  },

  fetchBackgroundImage: function (city, country) {
    // Modify the search query to fetch only sky-related images
    fetch(
      `https://api.unsplash.com/photos/random?query=${city},${country},sky&orientation=landscape&client_id=${this.unsplashApiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const imageUrl = data.urls.regular;
        document.body.style.backgroundImage = `url(${imageUrl})`;
      })
      .catch((error) => {
        console.error("Error fetching the background image:", error);
        // Fallback image if Unsplash API fails
        document.body.style.backgroundImage =
          "url('https://source.unsplash.com/1600x900/?sky')";
      });
  },

  displayTime: function (timezone) {
    const date = new Date();
    // Get the current time in the specific timezone
    const utcOffset = timezone * 1000;  // OpenWeatherMap timezone is in seconds
    const localTime = new Date(date.getTime() + utcOffset);
    
    // Format the time to 12-hour format
    let hours = localTime.getUTCHours(); // Use getUTCHours() to avoid timezone issues
    const minutes = String(localTime.getUTCMinutes()).padStart(2, '0'); // Get minutes in UTC
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // The hour '0' should be '12'
    
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    
    // Format the date to "10th October 2024" format
    const day = localTime.getUTCDate();
    const daySuffix = (day === 1 || day === 21 || day === 31) ? "st" : (day === 2 || day === 22) ? "nd" : (day === 3 || day === 23) ? "rd" : "th";
    const month = localTime.toLocaleString('default', { month: 'long' });
    const year = localTime.getUTCFullYear();
    const formattedDate = `${day}${daySuffix} ${month} ${year}`; // e.g., "10th October 2024"
    
    document.querySelector(".time").innerText = formattedTime;  // Display time without "Time:"
    document.querySelector(".date").innerText = formattedDate;  // Display formatted date without "Date:"
  },

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });

weather.fetchWeather("Denver");  // Default city
