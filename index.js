const city = document.querySelector('.city');
const currentTemp = document.querySelector('.temp');
const type = document.querySelector('.type');
const feelsLikeTemp = document.querySelector('.feelsLikeTemp');
const precipitation = document.querySelector('.precipitationValue');
const visibility = document.querySelector('.visibilityValue');
const humidity = document.querySelector('.humidityValue');
const search = document.querySelector('input');
const country = document.querySelector('.country');
const hourly = document.querySelector('.scrollable');
const changeTemp = document.querySelector('button');
let isCelsius = true;
let lastData = null;

// Sets default to London
window.onload = async function () {
  lastData = await fetchWeather('London');
  renderData(lastData);
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
  if (isCelsius) {
    currentTemp.textContent = `${data.current.temp_c}°C`;
    feelsLikeTemp.textContent = `${data.current.feelslike_c}°C`;
  } else {
    currentTemp.textContent = `${data.current.temp_f}°F`;
    feelsLikeTemp.textContent = `${data.current.feelslike_f}°F`;
  }
  precipitation.textContent = `${data.current.precip_mm} mm`;
  visibility.textContent = `${data.current.vis_miles} mi`;
  humidity.textContent = `${data.current.humidity}%`;
  type.textContent = data.current.condition.text;
  changePicture(data);
  hourlyForecast(data);
}

// Changing background picture based on the weather condition
function changePicture(data) {
  const img = document.querySelector('.left');
  const condition = data.current.condition.text;
  const lowercase = condition.toLowerCase();
  switch (true) {
    case lowercase.includes('cloud') || lowercase.includes('overcast'):
      img.style.backgroundImage = "url('../images/cloudy.jpg')";
      break;

    case lowercase.includes('rain'):
      img.style.backgroundImage = "url('../images/rain.jpg')";
      break;

    case lowercase.includes('sun'):
      img.style.backgroundImage = "url('../images/sunny.jpg')";
      break;

    default:
      img.style.backgroundImage = "url('../images/clearold.jpg')";
      break;
  }
}

function hourlyForecast(data) {
  hourly.innerHTML = '';
  const hours = data.forecast.forecastday[0].hour;
  console.log(hours);
  hours.forEach((hour) => {
    const div = document.createElement('div');
    div.className = 'hour-card';

    const title = document.createElement('p');
    title.className = 'hour-title';
    title.textContent = hour.time.split(' ')[1];

    const hourTemp = document.createElement('p');
    hourTemp.className = 'hour-temp';

    if (isCelsius) {
      hourTemp.textContent = `${hour.temp_c}°C`;
    } else {
      hourTemp.textContent = `${hour.temp_f}°C`;
    }

    const img = document.createElement('img');
    img.className = 'hour-image';
    img.src = hour.condition.icon;

    div.append(title, hourTemp, img);
    hourly.append(div);
  });
}

// Allows data to be rendered on page when enter is pressed
search.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter' && e.target.value !== '') {
    lastData = await fetchWeather(e.target.value);
    renderData(lastData);
  }
});

changeTemp.addEventListener('click', () => {
  isCelsius = !isCelsius;
  changeTemp.textContent = isCelsius ? 'Change to °F' : 'Change to °C';
  if (lastData) {
    renderData(lastData);
  }
});
