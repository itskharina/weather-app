const city = document.querySelector('.city');
const currentTemp = document.querySelector('.temp');
const type = document.querySelector('.type');
const feelsLikeTemp = document.querySelector('.feelsLikeTemp');
const precipitation = document.querySelector('.precipitationValue');
const visibility = document.querySelector('.visibilityValue');
const humidity = document.querySelector('.humidityValue');
const search = document.querySelector('input');
const country = document.querySelector('.country');

// Sets default to London
window.onload = async function () {
  const data = await fetchWeather('London');
  renderData(data);
};

// Fetching the API data
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=062b70f345cf4437be0160958242301&q=${city}`,
      { mode: 'cors' },
    );
    const weather = await response.json();
    console.log(weather);
    return weather;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Rendering data on page
function renderData(data) {
  city.textContent = data.location.name;
  country.textContent = data.location.country;
  currentTemp.textContent = `${data.current.temp_c}°C`;
  feelsLikeTemp.textContent = `${data.current.feelslike_c}°C`;
  precipitation.textContent = `${data.current.precip_mm} mm`;
  visibility.textContent = `${data.current.vis_miles} mi`;
  humidity.textContent = `${data.current.humidity}%`;
  type.textContent = data.current.condition.text;
  changePicture(data);
}

// Changing background picture based on the weather condition
function changePicture(data) {
  const img = document.querySelector('.left');
  const condition = data.current.condition.text;
  const lowercase = condition.toLowerCase();
  switch (true) {
    case lowercase.includes('clear'):
      img.style.backgroundImage = "url('../images/clear.jpg')";
      break;

    case lowercase.includes('cloud') || lowercase.includes('overcast'):
      img.style.backgroundImage = "url('../images/cloudy.jpg')";
      break;

    case lowercase.includes('rain'):
      img.style.backgroundImage = "url('../images/rain.jpg')";
      break;

    case lowercase.includes('sun'):
      img.style.backgroundImage = "url('../images/sunny.jpg')";
  }
}

// Allows data to be rendered on page when enter is pressed
search.addEventListener('keydown', async function (e) {
  if (e.key === 'Enter' && e.target.value !== '') {
    const data = await fetchWeather(e.target.value);
    renderData(data);
  }
});
