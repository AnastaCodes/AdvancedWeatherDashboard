//import { apiOpenweathermap } from "./apikey.js";
//import { apiGeo } from "./apikey.js";

const apiOpenweathermap = process.env.API_OPENWEATHERMAP;
const apiGeo = process.env.API_GEO;

const initialScreen = document.querySelector("#initial-screen");
const mainContent = document.querySelector("#main-screen");

document.addEventListener("DOMContentLoaded", () => {
  const initialForm = initialScreen.querySelector("#find");
  const mainForm = mainContent.querySelector("#find");

  initialForm.addEventListener("submit", handleCitySubmit);
  mainForm.addEventListener("submit", handleCitySubmit);

  document.querySelector(".onoffswitch-checkbox").addEventListener("click", toggleDarkMode);
  document.querySelector("#initial-current-location").addEventListener("click", getCurrentPosition);
  document.querySelector("#current-location").addEventListener("click", getCurrentPosition);

});

function handleCitySubmit(event) {
  event.preventDefault();
  const cityName = event.target.querySelector("#add").value.trim();
  if(initialScreen.style.display !== "none"){
    initialScreen.style.display = "none";
    mainContent.style.display = "block";
  }
  if (cityName) {
    getData(cityName);
  }
}

async function getData(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiOpenweathermap}&units=metric`
    );
    const data = await response.json();
    
    if (data.cod === "404") {
      console.error("Error getting location");
    } else {
      getWeather(data);
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
}

async function getWeather(data) {
  const dateTime = formatDateTime(data.dt, data.timezone);
  const formattedHours = dateTime.formattedHours;
  const formattedDate = dateTime.formattedDate;
  const dateSunriseTime = formatTime(data.sys.sunrise, data.timezone);
  const dateSunsetTime = formatTime(data.sys.sunset, data.timezone);

  displayMainInformation(data.name, formattedHours, formattedDate);
  displayWeatherForecast(data, dateSunriseTime, dateSunsetTime);

  await display5dayForecast(data);
  await displayHourlyForecast(data);
  await displayAdditionalForecast(data);
  document.querySelector("#main-screen #add").value = data.name;
}

async function displayAdditionalForecast(data) {
  const { lat, lon } = data.coord;
  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiOpenweathermap}`);
    const pollutionData = await response.json();
    const airPollution = document.querySelector("#forecast-additional");
    const { co, no, no2, o3, so2, pm2_5: pm2, pm10, nh3 } = pollutionData.list[0].components;
    const aqi = pollutionData.list[0].main.aqi;
    
    airPollution.querySelector("#co span").textContent = `${co} CO`;
    airPollution.querySelector("#no span").textContent = `${no} NO`;
    airPollution.querySelector("#no2 span").textContent = `${no2} NO2`;
    airPollution.querySelector("#o3 span").textContent = `${o3} O3`;
    airPollution.querySelector("#so2 span").textContent = `${so2} SO2`;
    airPollution.querySelector("#pm2 span").textContent = `${pm2} PM2.5`;
    airPollution.querySelector("#pm10 span").textContent = `${pm10} PM10`;
    airPollution.querySelector("#nh3 span").textContent = `${nh3} NH3`;
    
    const aqiValue = getAqiDescription(aqi);
    airPollution.querySelector(".aqi span").textContent = aqiValue;
  } catch (error) {
    console.error("Failed to fetch air pollution data:", error);
  }
}

function displayMainInformation(cityName, formattedHours, formattedDate) {
  const mainInformation = document.querySelector("#main-information");

  mainInformation.querySelector("#main-information-city").textContent = cityName;
  mainInformation.querySelector("#main-information-hours").textContent = formattedHours;
  mainInformation.querySelector("#main-information-date").textContent = formattedDate;
}

function displayWeatherForecast(data, dateSunriseTime, dateSunsetTime) {
  const icon = data.weather[0].icon;
  const forecast = document.querySelector("#forecast");
  forecast.querySelector("#forecast-degrees span").textContent = Math.ceil(data.main.temp);
  forecast.querySelector("#forecast-feels-degrees span").textContent = Math.ceil(data.main.feels_like);
  forecast.querySelector("#forecast-sunrise-value span").textContent = dateSunriseTime;
  forecast.querySelector("#forecast-sunset-value span").textContent = dateSunsetTime;
  forecast.querySelector("#forecast-icon img").src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  forecast.querySelector("#forecast-state").textContent = data.weather[0].description;
  forecast.querySelector("#forecast-humidity span").textContent = `${Math.ceil(data.main.humidity)}%`;
  forecast.querySelector("#forecast-pressure span").textContent = `${Math.ceil(data.main.pressure)} hPa`;
  forecast.querySelector("#forecast-wind-speed span").textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  getUVIndex(data.coord.lat, data.coord.lon);
}

async function displayHourlyForecast(data) {
  const { lat, lon } = data.coord;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiOpenweathermap}&units=metric`;
  const response = await fetch(url);
  const newData = await response.json();
  const hourlyForecasts = newData.list.slice(0, 6);

  const hourElements = [
    document.querySelector("#hour-one"),
    document.querySelector("#hour-two"),
    document.querySelector("#hour-three"),
    document.querySelector("#hour-four"),
    document.querySelector("#hour-five"),
    document.querySelector("#hour-six"),
  ];

  hourElements.forEach((hourElement, index) => {
    const forecast = hourlyForecasts[index];
    const icon = forecast.weather[0].icon;
    const description = forecast.weather[0].description;
    const hour = forecast.dt_txt.split(" ")[1].slice(0, 5);
    const temperature = Math.ceil(forecast.main.temp);
    const wind = forecast.wind.speed;
    const deg = forecast.wind.deg;

    hourElement.querySelector(".hour-time").textContent = hour;
    hourElement.querySelector("img").src = `https://openweathermap.org/img/wn/${icon}.png`;
    hourElement.querySelector(".description").textContent = description;
    hourElement.querySelector("span").textContent = temperature;
    hourElement.querySelector(".wind").textContent = `${(wind * 3.6).toFixed(1)} km/h`;
    hourElement.querySelector(".navigation").style.transform = `rotate(${deg}deg)`;
  });
}

async function display5dayForecast(data) {
  const { lat, lon } = data.coord;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiOpenweathermap}&units=metric`;
  const response = await fetch(url);
  const newData = await response.json();
  const dailyForecasts = {};
  const dayElements = [
    document.querySelector("#day-1"),
    document.querySelector("#day-2"),
    document.querySelector("#day-3"),
    document.querySelector("#day-4"),
    document.querySelector("#day-5"),
  ];
  newData.list.forEach((obj) => {
    const day = obj.dt_txt.split(" ")[0];
    if (!dailyForecasts[day]) {
      dailyForecasts[day] = [];
    }
    dailyForecasts[day].push(obj);
  });

  dayElements.forEach((dayElement, index) => {
    const dayKey = Object.keys(dailyForecasts)[index];
    const forecasts = dailyForecasts[dayKey];
    const midIndex = Math.floor(forecasts.length / 2); 
    const forecast = forecasts[midIndex]; 
    const icon = forecast.weather[0].icon;
    const date = new Date(forecast.dt * 1000);
    const temperature = Math.ceil(forecast.main.temp);
    const formattedDay = date.toLocaleDateString("en-GB", {weekday: "long", day: "2-digit", month: "short"});
    dayElement.querySelector("#day-date").textContent = formattedDay;
    dayElement.querySelector("img").src = `https://openweathermap.org/img/wn/${icon}.png`;
    dayElement.querySelector("span").textContent = temperature;
  });
}

function formatDateTime(unixTime, timezone) {
  const date = new Date((unixTime + timezone) * 1000);
  const currentDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const formattedHours = currentDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const formattedDate = currentDate.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "short" });
  return { formattedHours, formattedDate };
}

function formatTime(unixTime, timezone) {
  const date = new Date((unixTime + timezone) * 1000);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function getIp(json) {
  fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=${apiGeo}&ipAddress=${json.ip}`
  )
    .then((response) => response.json())
    .then((data) => getData(data.location.region));
}

function getUVIndex(lat, lon) {
  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiOpenweathermap}`;

  fetch(uvUrl)
    .then((response) => response.json())
    .then((data) => {
      const uvIndex = data.value;
      document.querySelector("#forecast-uv span").textContent = uvIndex;
    })
    .catch((error) => console.error("Error getting UV index" + error));
}

function getAqiDescription(aqi) {
  switch (aqi) {
    case 1: return "Good";
    case 2: return "Fair";
    case 3: return "Moderate";
    case 4: return "Poor";
    case 5: return "Very Poor";
    default: return "Unknown";
  }
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(success, error);
}

async function currentLocation(lat, lon) {
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiOpenweathermap}&units=metric`
  );
  return await weather.json();
}

let success = function (data) {
  let lat = data.coords.latitude;
  let lon = data.coords.longitude;
  currentLocation(lat, lon).then((data) => {
    getWeather(data);
    initialScreen.style.display = "none";
    mainContent.style.display = "block";
  });
};

let error = function () {
  fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => getIp(data))
    .catch(console.error("Error getting location by IP"));
};

function toggleDarkMode() {
  const mainContainer = document.querySelector("#main-screen");
  const toggleName = document.querySelector(".onoffswitch-name");
  const isDarkMode = mainContainer.classList.toggle("dark-mode");
  const forecast = document.querySelector("#forecast");
  const forecastSunriseImg = forecast.querySelector("#forecast-sunrise img");
  const forecastSunsetImg = forecast.querySelector("#forecast-sunset img");
  const forecastHumidityImg = forecast.querySelector("#forecast-humidity img");
  const forecastWindSpeedImg = forecast.querySelector("#forecast-wind-speed img");
  const forecastPressureImg = forecast.querySelector("#forecast-pressure img");
  const forecastUvImg = forecast.querySelector("#forecast-uv img");
  const forecastIcon = forecast.querySelector("#forecast-icon");

  toggleName.textContent = isDarkMode ? "Lightmode" : "Darkmode";
  forecastSunriseImg.src = isDarkMode ? "./img/sunrise-white.png" : "./img/sunrise.png";
  forecastSunsetImg.src = isDarkMode ? "./img/sunset-white.png" : "./img/sunset.png";
  forecastHumidityImg.src = isDarkMode ? "./img/humidity-white.png" : "./img/humidity.png";
  forecastWindSpeedImg.src = isDarkMode ? "./img/wind-white.png" : "./img/wind.png";
  forecastPressureImg.src = isDarkMode ? "./img/pressure-white.png" : "./img/pressure.png";
  forecastUvImg.src = isDarkMode ? "./img/uv-white.png" : "./img/uv.png";
  forecastIcon.style.backgroundColor = isDarkMode ? "#72a1be36" : "";
};
