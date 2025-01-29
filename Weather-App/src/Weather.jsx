import { useEffect, useState } from "react";
import "./Weather.css";
function Weathers() {
  const [input, setInput] = useState("Lahore");
  const [city, setcity] = useState("");
  const [weather, setweather] = useState("");
  const [call, setc] = useState("");
  function handleChange(e) {
    setInput(e.target.value);
  }

  useEffect(() => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`;
    const fechingdata = async () => {
      try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        setcity(data);
        let latitude = data.results[0].latitude;
        let longitude = data.results[0].longitude;
        const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,precipitation_probability&timezone=auto`;

        let response2 = await fetch(url2);
        let data2 = await response2.json();
        setweather(data2);
        console.log(data2);
        console.log(data2.daily.weathercode);
      } catch (error) {
        console.log(error);
      }
    };
    fechingdata();
  }, [call]);

  // Map weather codes to emoji icons
  const weatherCodeToIcon = (code) => {
    const icons = {
      0: "☀️", // Clear sky
      1: "⛅", // Mainly clear
      2: "🌤️", // Partly cloudy
      3: "☁️", // Overcast
      61: "🌧️", // Rain showers
      95: "⛈️", // Thunderstorm
      45: "🌫️", // Fog or mist
    };
    return icons[code] || "❓"; // Default icon for unknown codes
  };
  function callapi() {
    setc(input);
  }
  function bydefualt(e) {
    e.preventDefault();
  }
  return (
    <>
      <div>
        <form onSubmit={bydefualt}>
          <input
            className=" input-field focus:outline-none rounded-lg bg-blue-200 h-7 ml-60 mt-10 w-150 p-5"
            type="text"
            placeholder="Search the cities"
            onChange={(e) => handleChange(e)}
          />
          <button
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-md transition duration-300 ease-in-out pointer:cursor"
            onClick={callapi}
          >
            Search
          </button>
        </form>
      </div>
      <div className="container display: inline-block">
        <div className="h-70 w-200 bg-gray-200 ml-60 rounded-lg  pl-20 pt-10">
          <p className="text-4xl font-medium text-stone-100">
            {" "}
            {city.results && city.results[0]
              ? city.results[0].name
              : "City not found"}
          </p>
          <p className="text-sm pl-1 pt-2 ">
            Chance of rain:{" "}
            {weather.daily && weather.daily.precipitation_probability_max
              ? `${weather.daily.precipitation_probability_max[0]}%`
              : "0%"}{" "}
          </p>
          <p className="pt-18 pl-5 text-4xl font-medium">
            {weather.daily && weather.daily.temperature_2m_min
              ? Math.floor(weather.daily.temperature_2m_min[0])
              : "0"}<sup className=" text-base">O</sup>

          </p>
        </div>

        <div className=" grid grid-cols-6 gap-1 mt-2 h-40 w-200 ml-60 bg-slate-400 rounded-lg ">
          <div className="h-40 w-30 bg-gray-200">01</div>
          <div className="h-40 w-30 bg-gray-200">02</div>
          <div className="h-40 w-30 bg-gray-200">03</div>
          <div className="h-40 w-30 bg-gray-200">04</div>
          <div className="h-40 w-30 bg-gray-200">05</div>
          <div className="h-40 w-30 bg-gray-200">06</div>
        </div>
        <p className="mt-2 h-50 w-200 bg-gray-200 ml-60 rounded-lg ">
          Update first
        </p>
      </div>
      <p className=" ptag mt-2 h-160 w-110 bg-gray-200 ml-265 rounded-lg ">
        Update first
      </p>
    </>
  );
}

export default Weathers;
