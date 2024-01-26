const place = document.querySelector('.city');
const currentTemp = document.querySelector('.temp');
const type = document.querySelector('.type');
const feelsLikeTemp = document.querySelector('.feels-like-temp');
const precipitation = document.querySelector('.precip-value');
const visibility = document.querySelector('.vis-value');
const humidity = document.querySelector('.humidity-value');
const search = document.querySelector('input');
const country = document.querySelector('.country');
const hourly = document.querySelector('.scrollable');
const changeTemp = document.querySelector('button');
const daysContainer = document.querySelector('.days-container');
const uv = document.querySelector('.uv-value');
const gust = document.querySelector('.wind-gust');
const wind = document.querySelector('.wind-value');
const range = document.querySelector('.range');
const sunrise = document.querySelector('.sunrise-value');
const sunset = document.querySelector('.sunset-value');

let isCelsius = true;
let lastData = null; // Needed so we can easily toggle the temp units without having to do another api call

// Sets default to London
window.onload = async function () {
  lastData = await fetchWeather('London');
  renderData(lastData);
};

// Fetching the API data
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=062b70f345cf4437be0160958242301&q=${city}&days=3`,
      { mode: 'cors' },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const weather = await response.json();
    console.log(weather);
    return weather;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Rendering data on page
function renderData(data) {
  place.textContent = data.location.name;
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
  uv.textContent = data.current.uv;
  wind.textContent = `${data.current.wind_mph.toFixed(1)}`; // Makes it so number always rounds to 1 decimal place
  gust.textContent = `${data.current.gust_mph.toFixed(1)}`;
  sunrise.textContent = data.forecast.forecastday[0].astro.sunrise;
  sunset.textContent = data.forecast.forecastday[0].astro.sunset;

  if (data.current.uv < 3) {
    range.textContent = 'Low';
  } else if (data.current.uv < 6) {
    range.textContent = 'Moderate';
  } else if (data.current.uv < 8) {
    range.textContent = 'High';
  } else if (data.current.uv < 11) {
    range.textContent = 'Very high';
  } else {
    range.textContent = 'Extreme';
  }

  changePicture(data);
  hourlyForecast(data);
  threeDayForecast(data);
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
      img.style.backgroundImage = "url('../images/clear.jpg')";
      break;
  }
}

// Creates and renders hourly forecast on page
function hourlyForecast(data) {
  hourly.innerHTML = '';
  const hours = data.forecast.forecastday[0].hour;
  hours.forEach((hour) => {
    const hourCard = document.createElement('div');
    hourCard.className = 'hour-card';

    const hourTime = document.createElement('p');
    hourTime.className = 'hour-time';
    hourTime.textContent = hour.time.split(' ')[1];

    const hourTemp = document.createElement('p');
    hourTemp.className = 'hour-temp';

    if (isCelsius) {
      hourTemp.textContent = `${hour.temp_c}°C`;
    } else {
      hourTemp.textContent = `${hour.temp_f}°F`;
    }

    const hourImg = document.createElement('img');
    hourImg.className = 'hour-image';
    hourImg.src = hour.condition.icon;

    hourCard.append(hourTime, hourTemp, hourImg);
    hourly.append(hourCard);
  });
}

// Creates and renders three day forecast on page
function threeDayForecast(data) {
  daysContainer.innerHTML = '';

  const days = data.forecast.forecastday;
  days.forEach((day) => {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';

    const date = document.createElement('p');
    date.className = 'day-date';
    const dayOfWeek = new Date(`${day.date}`).toLocaleString('en-us', {
      weekday: 'long',
    });
    date.textContent = dayOfWeek.slice(0, 3);

    const dayTemp = document.createElement('p');
    dayTemp.className = 'day-temp';

    dayTemp.textContent = isCelsius
      ? `${day.day.avgtemp_c}°C`
      : `${day.day.avgtemp_f}°F`;

    const dayImg = document.createElement('img');
    dayImg.className = 'day-image';
    dayImg.src = day.day.condition.icon;

    const highTemp = document.createElement('p');
    highTemp.className = 'high';
    highTemp.textContent = isCelsius
      ? `${day.day.maxtemp_c}°C `
      : `${day.day.maxtemp_f}°F `;

    const lowTemp = document.createElement('p');
    lowTemp.className = 'low';
    lowTemp.textContent = isCelsius
      ? `${day.day.mintemp_c}°C `
      : `${day.day.mintemp_f}°F `;

    const highAndLow = document.createElement('div');
    highAndLow.className = 'high-and-low';

    const bar = document.createElement('div');
    bar.className = 'bar';

    const chanceOfRain = document.createElement('p');
    chanceOfRain.className = 'rain';
    chanceOfRain.textContent = `Chance of rain: ${day.day.daily_chance_of_rain}%`;

    highAndLow.append(lowTemp, bar, highTemp);
    dayCard.append(date, dayTemp, highAndLow, chanceOfRain, dayImg);
    daysContainer.append(dayCard);
  });
}

// Allows data to be rendered on page when enter is pressed
search.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter' && e.target.value !== '') {
    lastData = await fetchWeather(e.target.value);
    renderData(lastData);
  }
});

// Switches between celsius and fahrenheit
changeTemp.addEventListener('click', () => {
  isCelsius = !isCelsius;
  changeTemp.textContent = isCelsius ? 'Change to °F' : 'Change to °C';
  if (lastData) {
    renderData(lastData);
  }
});
