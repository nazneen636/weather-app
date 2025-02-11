const weatherDiv = document.getElementById("weatherDiv");
const inputField = document.getElementById("inputField");
const searchBtn = document.getElementById("search");
const weatherImg = document.getElementById("weatherImg");
const weatherDegree = document.getElementById("degree");
const WeatherDescription = document.getElementById("city");
const weatherHumidity = document.getElementById("humidity");
const weatherWind = document.getElementById("wind");
const hourlyTime = document.getElementById("hourlyTime");
const hourlyIcon = document.getElementById("hourlyIcon");
const hourlyTemperature = document.getElementById("hourlyTemperature");
const hourlyWeatherDiv = document.getElementById("hourlyWeather");
const today = document.getElementById("today");
const cityInfo = document.getElementById("cityInfo");
const locationBtn = document.getElementById("location");

// weatherDiv.style.display = "none";
console.log(weatherImg);

const apiKey = "4e9908a0e6d2484a9ea40538251002";
// let currentCity = "dhaka";

function commonInfo(data) {
  const city = data.location.name;
  console.log(city);

  const temperature = Math.round(data.current.temp_c);
  const description = data.current.condition.text;
  const weatherIcon = data.current.condition.icon;
  const wind = data.current.wind_kph;
  const humidity = data.current.humidity;
  const hourlyData = data.forecast.forecastday[0].hour;
  const localtime = data.location.localtime.split(" ")[1];
  const localDate = data.location.localtime.split(" ")[0];
  const date = new Date(localDate);
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formatDate = date.toLocaleDateString("en-US", options);
  console.log(formatDate);

  weatherImg.src = weatherIcon;
  weatherImg.style.scale = "1.3";
  weatherDegree.innerHTML = temperature;
  WeatherDescription.innerHTML = description;
  weatherWind.innerHTML = wind;
  weatherHumidity.innerHTML = humidity;
  today.innerHTML = `${formatDate}`;
  cityInfo.innerHTML = city + ",";
  console.log(cityInfo);

  getHourlyData(hourlyData, localtime);
}

function getHourlyData(hourlyData, localtime) {
  // const currentTime = new Date(localtime).getHours();
  const cityTime = parseInt(localtime);
  hourlyWeatherDiv.innerHTML = "";
  const futureHours = hourlyData.filter((hour) => {
    const hourTime = new Date(hour.time).getHours();
    return hourTime >= cityTime;
  });
  console.log(futureHours);
  futureHours.forEach((hour) => {
    const time = hour.time.split(" ")[1];
    const icon = hour.condition.icon;
    const temperature = Math.floor(hour.temp_c);
    const hourlyMarkup = `<div
    class="hour flex items-center justify-center flex-col border border-gray-100 w-fit py-1 px-4 rounded-lg"
  >
    <span id="hourlyTime" class="text-base font-medium text-white"
      >${time}</span
    >
    <img id="hourlyIcon" src=${icon} alt="" class="w-10" />
    <span
      id="hourlyTemperature"
      class="text-base font-medium text-white"
      >${temperature}°</span
    >
  </div>`;
    hourlyWeatherDiv.innerHTML += hourlyMarkup;
  });

  console.log(hourlyData);
}

async function getWeatherInfo(cityName) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    commonInfo(data);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

inputField.addEventListener("keyup", (e) => {
  const cityName = inputField.value;
  if (e.key == "Enter" && cityName) {
    getWeatherInfo(cityName);
    inputField.value = "";
    console.log(cityName);
  }
});
searchBtn.addEventListener("click", () => {
  const cityName = inputField.value;
  getWeatherInfo(cityName);
  inputField.value = "";
});

// location api=====
async function getLocationApi(lat, lon) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    commonInfo(data);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getLocationApi(lat, lon);
      },
      (error) => {
        console.log("Error getting location:", error);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});
