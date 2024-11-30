let API_KEYS = {}; // Object to store API keys loaded from a configuration file

// Loaded API keys from external config.json file
fetch("config.json")
  .then((response) => response.json()) // Convert the file content to JSON
  .then((config) => {
    API_KEYS = config; // Save the keys in the global object
    searchCity("Paris"); // // Load default weather data for Paris after keys are ready
  })
  .catch((error) => {
    console.error("Error loading API keys:", error); //Log if the file fails to load
    alert("Unable to load API keys. Please check the setup."); //Notify the user
  });
/*Updates the weather details on the page using data from the API response.
 */

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current; //// Current temperature in the city
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000); //// Convert timestamp to a Date object
  let iconElement = document.querySelector("#icon");

  // Displaying updated weather data
  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`; //displays Humidity
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`; //Displays wind speed in km/hr
  temperatureElement.innerHTML = Math.round(temperature); //Displays temperature
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  getForecast(response.data.city); //Fetches the weather forecast for the city
}
/**
 * Formats a JavaScript Date object into a readable string.
 */
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  // Add a leading zero to single-digit minutes
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`; // Returning formatted date and time
}
/**
 * Searches for the weather data of a city and displays it on the page.
 */
function searchCity(city) {
  const apiKey = API_KEYS.CURRENT_WEATHER_API_KEY; // Gets the weather API key
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`; // Builds an API URL
  axios
    .get(apiUrl) // Fetchs data from the weather API
    .then(refreshWeather) // Processes and display the weather data
    .catch((error) => {
      console.error("Error fetching current weather:", error); // Log API request errors
      alert("Unable to fetch weather data. Please try again later."); // Notifys the user in case of errors
    });
}
/**
 * Handles the form submission for searching a city.
 */
function handleSearchSubmit(event) {
  event.preventDefault(); // Prevents form from refreshing the page which is it's normal behaviour
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value); // Fetch weather for the city entered by the user
}

/**
 * Formats a timestamp into the day of the week.
 */
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000); // Converts timestamp to a Date object
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()]; // Returns the day name
}

/**
 * Fetches and displays the 5-day weather forecast for a city.
 */
function getForecast(city) {
  const apiKey = API_KEYS.FORECAST_API_KEY; // Get the forecast API key
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`; // Builds an API URL
  axios
    .get(apiUrl) // Fetch forecast data
    .then(displayForecast) // Display the forecast data
    .catch((error) => {
      console.error("Error fetching forecast data:", error); // Logs errors
      alert("Unable to fetch forecast data. Please try again later."); // Notify the user when an error occurs
    });
}

/**
 * Displays the 5-day weather forecast on the page.
 */
function displayForecast(response) {
  let forecastHTML = ""; // Initializes an empty string for the forecast HTML
  response.data.daily.forEach(function (day, index) {
    // Only shows the first 5 days of the forecast
    if (index < 5) {
      forecastHTML += `<div class="weather-forecast-day">
            <div class="weather-forecast-date">${formatDay(day.time)}</div>
            <img src="${day.condition.icon_url}" class="weather-forecast-icon"/>
            <div class="weather-forecast-temperatures">
              <div class="weather-forecast-temperature-max">
                <strong>${Math.round(day.temperature.maximum)}º</strong>
              </div>
              <div class="weather-forecast-temperature-min">${Math.round(
                day.temperature.minimum
              )}º</div>
            </div>
        </div>`;
    }
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHTML; // Updates the forecast section on the page
}
// Add an event listener to the search form for user submissions
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);
