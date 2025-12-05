import React, { useEffect, useState } from "react";
import "./App.css";

const API_KEY = "ea4d539c2c5fa797e22b2972fec9403c"; // 🔐 replace with your OpenWeatherMap API key

const weatherIcons = {
  Clear: "fa-sun",
  Clouds: "fa-cloud",
  Rain: "fa-cloud-showers-heavy",
  Thunderstorm: "fa-bolt",
  Snow: "fa-snowflake",
  Mist: "fa-smog",
  Haze: "fa-smog",
  Fog: "fa-smog",
  Drizzle: "fa-cloud-rain",
};

const gradients = {
  Clear: ["#1d2948", "#fbba5b"],
  Clouds: ["#141b33", "#4b648f"],
  Rain: ["#070b18", "#385a79"],
  Thunderstorm: ["#03040c", "#303649"],
  Snow: ["#1f2b48", "#88c6ff"],
  Mist: ["#171d30", "#4d6073"],
  Haze: ["#171d30", "#4d6073"],
};

function App() {
  const [cityInput, setCityInput] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [particles, setParticles] = useState([]);

  // change body background based on weather type
  function updateBackground(weatherCondition) {
    const colors = gradients[weatherCondition] || ["#050713", "#1d2948"];
    document.body.style.background = `radial-gradient(circle at top, ${colors[1]} 0, ${colors[0]} 55%)`;
  }

  // create moving particles
  function createWeatherEffects(condition) {
    const particlesMap = {
      Clear: ["sun", 4],
      Clouds: ["cloud", 5],
      Rain: ["tint", 18],
      Thunderstorm: ["bolt", 7],
      Snow: ["snowflake", 14],
      Mist: ["smog", 10],
      Haze: ["smog", 10],
    };

    let config = particlesMap[condition];
    if (!config) {
      config = ["circle", 4];
    }

    const [iconName, count] = config;

    const newParticles = Array.from({ length: count }).map(() => ({
      icon: iconName,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      fontSize: Math.random() * 18 + 10 + "px",
      delay: Math.random() * 6 + "s",
    }));

    setParticles(newParticles);
  }

  async function fetchWeather(city) {
    if (!city) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setError("");

    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      encodeURIComponent(city) +
      "&appid=" +
      API_KEY +
      "&units=metric";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        setError("Unable to find that city. Try another one.");
        setWeather(null);
        return;
      }

      const data = await response.json();

      const name = data.name;
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;
      const humidity = data.main.humidity;
      const windKmh = Math.round(data.wind.speed * 3.6);
      const mainCondition = data.weather[0].main;
      const dt = data.dt;
      const timezone = data.timezone;
      const localTimeMs = (dt + timezone) * 1000;
      const localDate = new Date(localTimeMs);

      const dateText = localDate.toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setWeather({
        name,
        temp,
        desc,
        humidity,
        windKmh,
        mainCondition,
        dateText,
      });

      updateBackground(mainCondition);
      createWeatherEffects(mainCondition);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setWeather(null);
    }
  }

  // default city on load
  useEffect(() => {
    fetchWeather("New Delhi");
  }, []);

  function handleSearchClick() {
    fetchWeather(cityInput.trim());
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  }

  const iconClass = weather
    ? weatherIcons[weather.mainCondition] || "fa-cloud"
    : "fa-sun";

  return (
    <div className="weather-root">
      {/* particles */}
      <div className="background-effects">
        {particles.map((p, index) => (
          <i
            key={index}
            className={`fas fa-${p.icon} weather-particle`}
            style={{
              left: p.left,
              top: p.top,
              fontSize: p.fontSize,
              animationDelay: p.delay,
            }}
          ></i>
        ))}
      </div>

      <div className="weather-app">
        <div className="search">
          <input
            type="text"
            id="city-input"
            placeholder="Search by city name"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            id="search-btn"
            aria-label="Search weather"
            title="Search Weather"
            onClick={handleSearchClick}
          >
            <i className="fas fa-search"></i>
            <span className="visually-hidden">Search</span>
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="current-weather">
          <h1 id="city-name">{weather ? weather.name : "City Name"}</h1>
          <p id="date-time">
            {weather ? weather.dateText : "Monday, 1 January 2023 12:00 PM"}
          </p>
          <i className={`weather-icon fas ${iconClass}`}></i>
          <p id="temperature">
            {weather ? `${weather.temp}°C` : "--°C"}
          </p>
          <p id="description">
            {weather ? weather.desc : "Clear Sky"}
          </p>
        </div>

        <div className="extra-info">
          <div className="info-card">
            <i className="fas fa-tint"></i>
            <p id="humidity">
              {weather ? `${weather.humidity}%` : "--%"}
            </p>
            <p>Humidity</p>
          </div>
          <div className="info-card">
            <i className="fas fa-wind"></i>
            <p id="wind-speed">
              {weather ? `${weather.windKmh} km/h` : "-- km/h"}
            </p>
            <p>Wind Speed</p>
          </div>
          <div><p className="Mithun">Mithun kumar G S</p></div>
        </div>
      </div>
    </div>
  );
}

export default App;