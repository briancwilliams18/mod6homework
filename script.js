const apiKey = 'f7e25f016aa26d2ed9043017c2bcef99';
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const searchHistorySection = document.getElementById('search-history');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city !== '') {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const weatherData = await response.json();

    // Fetch forecast data
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();

    // Display current weather and forecast data
    displayCurrentWeather(weatherData);
    displayForecast(forecastData);

    // Add the searched city to search history
    addToSearchHistory(city);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function displayCurrentWeather(data) {
  currentWeatherSection.innerHTML = `
    <h2>${data.name}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  const forecastList = data.list;
  const forecastHTML = forecastList.slice(0, 5).map(item => `
    <div class="forecast-item">
      <p>Date: ${item.dt_txt}</p>
      <p>Temperature: ${item.main.temp}°C</p>
      <p>Humidity: ${item.main.humidity}%</p>
      <p>Wind Speed: ${item.wind.speed} m/s</p>
    </div>
  `).join('');

  forecastSection.innerHTML = forecastHTML;
}

function addToSearchHistory(city) {
  const searchHistoryItem = document.createElement('div');
  searchHistoryItem.textContent = city;
  searchHistoryItem.classList.add('search-history-item');
  searchHistoryItem.addEventListener('click', () => {
    fetchWeather(city);
  });

  searchHistorySection.appendChild(searchHistoryItem);
}

function loadSearchHistory() {
  const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

  history.forEach(city => {
    addToSearchHistory(city);
  });
}

loadSearchHistory();