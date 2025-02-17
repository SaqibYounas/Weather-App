import { useEffect, useRef, useState } from "react";
import "./Weather.css";
function Weathers() {
  const [input, setInput] = useState("Lahore");
  const [city, setcity] = useState("");
  const [weather, setweather] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  let caltime = useRef();
  let hourlyTime = useRef([]);
  let weekDays=useRef([]);
  hourlyTime = [
    caltime.current,
    caltime.current + 2,
    caltime.current + 4,
    caltime.current + 6,
    caltime.current + 8,
    caltime.current + 10,
  ];

  console.log(hourlyTime);
  function handleChange(e) {
    setInput(e.target.value);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInput(input);
    }, 1000); // 500 ms debounce delay
    // Cleanup function to clear timeout if input changes before the delay
    return () => clearTimeout(timeoutId);
  }, [input]); // Runs every time 'input' changes

  useEffect(() => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`;
    const fechingdata = async () => {
      try {
        if (debouncedInput) {
          let response = await fetch(url);
          let data = await response.json();
          console.log(data);
          setcity(data);
          let latitude = data.results[0].latitude;
          let longitude = data.results[0].longitude;
          const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,precipitation_probability,apparent_temperature,uv_index&timezone=auto`;

          let response2 = await fetch(url2);
          let data2 = await response2.json();
          setweather(data2);
          console.log(data2);
          console.log(data2.daily.weathercode);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fechingdata();
  }, [debouncedInput]);

  useEffect(() => {
    let timezone = city.results && city.results[0].timezone;
    let date = new Date();
    let formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      hour12: false,
    });
    const formatters = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const today = new Date(); // Aaj ki date store karo
for (let i = 0; i < 7; i++) {
  let nextDay = new Date(); // Har baar today ka copy lo
  nextDay.setDate(today.getDate() + i); // Sirf date update karo
  weekDays[i]=formatters.format(nextDay);
  console.log(weekDays[i]);
}
    let localHour = parseInt(formatter.format(date));
    caltime.current = localHour;
 
  });

  function timeAMPM(time) {
    if (time === undefined || isNaN(time)) {
      console.error("Invalid time input:", time);
      return "Invalid Time"; // Error handling
    }

    let suffix = time >= 12 ? "PM" : "AM";
    let hour = time % 12 || 12; // 0 ko 12 bna deta hai
    return hour + ":00 " + suffix;
  }

  // Map weather codes to animated GIF icons
  const weatherCodeToIcon = (code, currentTime, sunrise, sunset) => {
    let day =0;
   if(currentTime){
      // Agar currentTime ek valid number hai aur 0 se bara hai, toh yeh condition execute hogi
      day = currentTime >= sunrise && currentTime <= sunset ;
   }
  else{
    day=true;
  }
    const icons = {
      // Clear sky codes
      0: day
        ? "/Weather-Animated-icons/Clear sky.gif"
        : "/Weather-Animated-icons/Night.gif", // Clear sky
      1: day
        ? "/Weather-Animated-icons/Clear sky.gif"
        : "/Weather-Animated-icons/Night.gif", // Mainly clear (same icon as Clear sky)
      2: day
        ? "/Weather-Animated-icons/Clear sky.gif"
        : "/Weather-Animated-icons/Night.gif", // Partly cloudy (similar to clear sky)
      // Overcast
      3: day
        ? "/Weather-Animated-icons/Overcast.gif"
        : "/Weather-Animated-icons/cloudy-night.gif", // Overcast//clody night
      // Fog or mist
      45: day
        ? "/Weather-Animated-icons/Fog or mist.gif"
        : "/Weather-Animated-icons/night fog.gif", // Fog or mist//night b
      // Rain showers codes
      61: "/Weather-Animated-icons/Rain showers.gif", // Rain showers
      63: "/Weather-Animated-icons/Rain showers.gif", // Light rain showers (similar to rain showers)
      71: "/Weather-Animated-icons/Rain showers.gif",
      // Snow
      73: "/Weather-Animated-icons/Snow.gif", // Snow
      77: "/Weather-Animated-icons/Snow.gif", // Snow grains (similar to snow)
      // Thunderstorm
      95: "/Weather-Animated-icons/Thunderstorm.gif", // Thunderstorm
      80: "/Weather-Animated-icons/Thunderstorm.gif", // Rain thunderstorm (similar to thunderstorm)
      81: "/Weather-Animated-icons/Thunderstorm.gif", // Heavy thunderstorm (similar to thunderstorm)

      // Default for unknown weather codes
      default: "/Weather-Animated-icons/Default.gif",
    };
    console.log(day);
    // Return the icon for the given weather code, or a default icon if code is unknown
    return icons[code] || icons.default;
  };




function weatherConditions(code){
  let weatherName={
    0:"Sunny", 
    1:"Mainly clear", 
    2:"Partly cloudy", 
    3:"Overcast", 
    45:"Fog", 
    61:"Rain showers", 
    63:"Light rain", 
    71:"Snow", 
    73:"Heavy snow", 
    77:"Snow grains", 
    95:"T-Stormy", 
    80:"Light rain ", 
    81:"Heavy Rain",
    default:"Sunny",
  }
  return weatherName[code]||weatherName.default;
}


  function bydefualt(e) {
    e.preventDefault();
  }
  return (
    <>
    <div className="h-screen w-screen ml-[2%]">
      <div>
        <form onSubmit={bydefualt}>
          <input
            className=" md:w-[50%] input-field focus:outline-none rounded-lg bg-blue-200 h-7  mt-[1%] w-[50%] sm:w-[50%] p-5 sm:text-sm md:text-lg " 
            type="text"
            placeholder="Search the cities"
            onChange={(e) => handleChange(e)}
          />{" "}
          <div className=" absolute top-0 p-8 left-0 mt-2 h-[90%] w-[40%] bg-gray-200 mt-22 ml-[55%] rounded-lg  md:w-[40%] sm:w-[40%] md:h-[90%] sm:h-[90%]  sm:text-xs md:text-lg">
            <p>7-DAY FORECAST</p>

          <div className=" grid grid-cols-3 grid-rows-7 gap-2 pt-[1%] h-[100%] font-bold  md:w-[100%] sm:w-[100%] sm-h:[100%] md:h-[100%] ">
            <div className="content-center">Today</div>
            
            <div><img className="inline-block " src={weather?.daily?.weathercode?.[0] !== undefined
                  ? weatherCodeToIcon(
                      weather.daily.weathercode[0],
                      weather.hourly.time[caltime.current],
                      weather.daily.sunrise[0],
                      weather.daily.sunset[0]
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
              width={90} /> <p  className="inline-block"> {weather?.daily?.weathercode?.[0]!==undefined?weatherConditions(weather.daily.weathercode[0]):"loadinng"}</p></div>
            <div className="text-center content-center  ">{weather?.daily?.temperature_2m_max?.[0]!==undefined?Math.round(weather.daily.temperature_2m_max[0]):0}/{weather?.daily?.temperature_2m_min?.[0]!==undefined?Math.round(weather.daily.temperature_2m_min[0]):0}</div>


            <div className="content-center" >{weekDays?.[1]!==undefined?weekDays[1]:"Sunday"}</div>
            <div><img className="inline-block " src={weather?.daily?.weathercode?.[1] !== undefined
                  ? weatherCodeToIcon(
                      weather.daily.weathercode[1],
                      weather.hourly.time[" no"],
                      weather.daily.sunrise[1],
                      weather.daily.sunset[1]
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
              width={90} /> <p  className="inline-block"> {weather?.daily?.weathercode?.[1]!==undefined?weatherConditions(weather.daily.weathercode[1]):"loadinng"}</p></div>
            <div className="text-center content-center  ">{weather?.daily?.temperature_2m_max?.[1]!==undefined?Math.round(weather.daily.temperature_2m_max[1]):0}/{weather?.daily?.temperature_2m_min?.[1]!==undefined?Math.round(weather.daily.temperature_2m_min[1]):0}</div>
            
            <div className="content-center" >{weekDays?.[1]!==undefined?weekDays[1]:"Sunday"}</div>
            <div><img className="inline-block " src={weather?.daily?.weathercode?.[1] !== undefined
                  ? weatherCodeToIcon(
                      weather.daily.weathercode[2],
                      weather.hourly.time[" no"],
                      weather.daily.sunrise[1],
                      weather.daily.sunset[1]
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
              width={90} /> <p  className="inline-block"> {weather?.daily?.weathercode?.[2]!==undefined?weatherConditions(weather.daily.weathercode[2]):"loadinng"}</p></div>
            <div className="text-center content-center  ">{weather?.daily?.temperature_2m_max?.[2]!==undefined?Math.round(weather.daily.temperature_2m_max[2]):0}/{weather?.daily?.temperature_2m_min?.[2]!==undefined?Math.round(weather.daily.temperature_2m_min[2]):0}</div>

            <div className="content-center" >{weekDays?.[3]!==undefined?weekDays[3]:"Sunday"}</div>
            <div><img className="inline-block " src={weather?.daily?.weathercode?.[3] !== undefined
                  ? weatherCodeToIcon(
                      weather.daily.weathercode[3],
                      weather.hourly.time[" no"],
                      weather.daily.sunrise[1],
                      weather.daily.sunset[1]
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
              width={90} /> <p  className="inline-block "> {weather?.daily?.weathercode?.[3]!==undefined?weatherConditions(weather.daily.weathercode[3]):"loadinng"}</p></div>
            <div className="text-center content-center  ">{weather?.daily?.temperature_2m_max?.[3]!==undefined?Math.round(weather.daily.temperature_2m_max[3]):0}/{weather?.daily?.temperature_2m_min?.[3]!==undefined?Math.round(weather.daily.temperature_2m_min[3]):0}</div>

            <div className="content-center" >{weekDays?.[4]!==undefined?weekDays[4]:"Sunday"}</div>
            <div><img className="inline-block " src={weather?.daily?.weathercode?.[4] !== undefined
                  ? weatherCodeToIcon(
                      weather.daily.weathercode[4],
                      weather.hourly.time[" no"],
                      weather.daily.sunrise[1],
                      weather.daily.sunset[1]
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
              width={90} /> <p  className="inline-block"> {weather?.daily?.weathercode?.[4]!==undefined?weatherConditions(weather.daily.weathercode[4]):"loadinng"}</p></div>
            <div className="text-center content-center  ">{weather?.daily?.temperature_2m_max?.[4]!==undefined?Math.round(weather.daily.temperature_2m_max[4]):0}/{weather?.daily?.temperature_2m_min?.[4]!==undefined?Math.round(weather.daily.temperature_2m_min[4]):0}</div>

            <div className="content-center" >{weekDays?.[5]!==undefined?weekDays[5]:"Sunday"}</div>
            <div><img className="inline-block " src={weather?.daily?.weathercode?.[5] !== undefined
                  ? weatherCodeToIcon(
                      weather.daily.weathercode[5],
                      weather.hourly.time[" no"],
                      weather.daily.sunrise[1],
                      weather.daily.sunset[1]
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
              width={90} /> <p  className="inline-block"> {weather?.daily?.weathercode?.[5]!==undefined?weatherConditions(weather.daily.weathercode[5]):"loadinng"}</p></div>
            <div className="text-center content-center  ">{weather?.daily?.temperature_2m_max?.[5]!==undefined?Math.round(weather.daily.temperature_2m_max[5]):0}/{weather?.daily?.temperature_2m_min?.[5]!==undefined?Math.round(weather.daily.temperature_2m_min[5]):0}</div>

            <div className="content-center" >{weekDays?.[6]!==undefined?weekDays[6]:"Sunday"}</div>
            <div><img className="inline-block " src={weather?.daily?.weathercode?.[6] !== undefined
                  ? weatherCodeToIcon(
                      weather.daily.weathercode[6],
                      weather.hourly.time[" no"],
                      weather.daily.sunrise[1],
                      weather.daily.sunset[1]
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
              width={90} /> <p  className="inline-block"> {weather?.daily?.weathercode?.[6]!==undefined?weatherConditions(weather.daily.weathercode[6]):"loadinng"}</p></div>
            <div className="text-center content-center  ">{weather?.daily?.temperature_2m_max?.[6]!==undefined?Math.round(weather.daily.temperature_2m_max[6]):0}/{weather?.daily?.temperature_2m_min?.[6]!==undefined?Math.round(weather.daily.temperature_2m_min[6]):0}</div>
          </div>
          </div>
         
        </form>
      </div>
      
        <div className=" h-[35%] w-[50%] bg-gray-200  rounded-lg  pl-[4%] pt-[2%]">
         

          <div>
            <p className=" text-4xl font-medium text-stone-100">
              {city.results && city.results[0]
                ? city.results[0].name
                : "City not found"}{" "}
              <p className="inline-block text-xl text-stone-500 ">
                ,{" "}
                {city.results && city.results[0].country
                  ? city.results[0].country
                  : " "}
              </p>
            </p>
            <p className="inline-block text-sm pl-1  clear-both ">
              Chance of rain:{" "}
              {weather.daily && weather.daily.precipitation_probability_max
                ? `${weather.daily.precipitation_probability_max[0]}%`
                : "0%"}{" "}
            </p>
            {/* <p className="inline-block pl-36 font-medium">{formateTime.current??0}</p> */}
          </div>
          <div>
            <p className="inline-block pl-5 pt-20 text-4xl font-medium">
              {weather.hourly && weather.hourly.temperature_2m
                ? Math.round(weather.hourly.temperature_2m[caltime.current])
                : "0"}
              <sup className="  inline-block">o</sup>
            </p>

            <img
              className="img-icon w-38 pl-110 w-142 inline-block"
              src={
                weather?.daily?.weathercode?.[0] !== undefined
                  ? weatherCodeToIcon(
                      weather.daily.weathercode[0],
                      weather.hourly.time[caltime.current],
                      weather.daily.sunrise[0],
                      weather.daily.sunset[0]
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
              width={100}
            />
          </div>
        </div>
<div>
        <div className="flex flex-wrap justify-between h-[30%]  w-[50%] bg-slate-400 rounded-lg p-[1%]">
          <p className="w-full font-bold">TODAY&apos;S FORECAST</p>
          <div className="h-46 w-32 pt-2 text-center bg-gray-200 ">
            {hourlyTime?.[0] !== undefined
              ? timeAMPM(hourlyTime[0])
              : "...loading"}
            <img
              className="p-4 w-xlg"
              src={
                weather?.hourly?.weathercode?.[0] !== undefined
                  ? weatherCodeToIcon(
                      weather.hourly.weathercode?.[hourlyTime[0]] ?? 0,
                      weather.hourly.time?.[caltime.current] ?? "00:00",
                      weather.daily.sunrise?.[0] ?? "00:00",
                      weather.daily.sunset?.[0] ?? "00:00"
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
            />{" "}
            <p className="inline-block">
              {weather?.hourly?.temperature_2m?.[0] !== undefined
                ? Math.round(weather.hourly.temperature_2m[caltime.current]) ??
                  "No Data"
                : "loading"}
            </p>
            <sup className=" text-xs inilne-block">o</sup>
          </div>
          <div className="h-46 w-32 pt-2 text-center bg-gray-200 ">
            {hourlyTime?.[1] !== undefined
              ? timeAMPM(hourlyTime[1])
              : "Loading..."}
            <img
              className="p-4"
              src={
                hourlyTime?.[1] !== undefined &&
                weather?.hourly?.weathercode?.[hourlyTime[1]] !== undefined
                  ? weatherCodeToIcon(
                      weather.hourly.weathercode?.[hourlyTime[1]] ?? 0,
                      weather.hourly.time?.[caltime.current + 2] ?? "00:00",
                      weather.daily.sunrise?.[0] ?? "06:00",
                      weather.daily.sunset?.[0] ?? "18:00"
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
            />
            <p className="inline-block">
              {weather?.hourly?.temperature_2m?.[0] !== undefined
                ? Math.round(
                    weather.hourly.temperature_2m[caltime.current + 2]
                  ) ?? "No Data"
                : "loading"}
            </p>
            <sup className=" text-xs inilne-block">o</sup>
          </div>
          <div className="h-46 w-32 pt-2 text-center  bg-gray-200">
            {timeAMPM(hourlyTime[2])}
            <img
              className="p-4"
              src={
                weather?.hourly?.weathercode?.[0] !== undefined
                  ? weatherCodeToIcon(
                      weather.hourly.weathercode?.[hourlyTime[2]] ?? 0,
                      weather.hourly.time?.[caltime.current + 4] ?? "00:00",
                      weather.daily.sunrise?.[0] ?? "06:00",
                      weather.daily.sunset?.[0] ?? "18:00"
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
            />
            <p className="inline-block">
              {weather?.hourly?.temperature_2m?.[0] !== undefined
                ? Math.round(
                    weather.hourly.temperature_2m[caltime.current + 4]
                  ) ?? "No Data"
                : "loading"}
            </p>
            <sup className=" text-xs inilne-block">o</sup>
          </div>
          <div className="h-46 w-32 pt-2 text-center bg-gray-200 ">
            {" "}
            {hourlyTime?.[3] !== undefined
              ? timeAMPM(hourlyTime[3])
              : "...loading"}
            <img
              className="p-4"
              src={
                weather?.hourly?.weathercode?.[0] !== undefined
                  ? weatherCodeToIcon(
                      weather.hourly.weathercode?.[hourlyTime[3]] ?? 0,
                      weather.hourly.time?.[caltime.current + 6] ?? "00:00",
                      weather.daily.sunrise?.[0] ?? "06:00",
                      weather.daily.sunset?.[0] ?? "18:00"
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
            />{" "}
            <p className="inline-block">
              {weather?.hourly?.temperature_2m?.[0] !== undefined
                ? Math.round(
                    weather.hourly.temperature_2m[caltime.current + 6]
                  ) ?? "No Data"
                : "loading"}
            </p>
            <sup className=" text-xs inilne-block">o</sup>
          </div>
          <div className="h-46 w-32 pt-2 text-center bg-gray-200 ">
            {" "}
            {hourlyTime?.[4] !== undefined
              ? timeAMPM(hourlyTime[4])
              : "...loading"}
            <img
              className="p-4"
              src={
                weather?.hourly?.weathercode?.[0] !== undefined
                  ? weatherCodeToIcon(
                      weather.hourly.weathercode?.[hourlyTime[4]] ?? 0,
                      weather.hourly.time?.[caltime.current + 8] ?? "00:00",
                      weather.daily.sunrise?.[0] ?? "06:00",
                      weather.daily.sunset?.[0] ?? "18:00"
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
            />{" "}
            <p className="inline-block">
              {weather?.hourly?.temperature_2m?.[0] !== undefined
                ? Math.round(
                    weather.hourly.temperature_2m[caltime.current + 8]
                  ) ?? "No Data"
                : "loading"}
            </p>
            <sup className=" text-xs inilne-block">o</sup>
          </div>
          <div className="h-46 w-32 pt-2 text-center bg-gray-200 ">
            {" "}
            {hourlyTime?.[5] !== undefined
              ? timeAMPM(hourlyTime[5])
              : "...loading"}
            <img
              className="p-4"
              src={
                weather?.hourly?.weathercode?.[0] !== undefined
                  ? weatherCodeToIcon(
                      weather.hourly.weathercode?.[hourlyTime[5]] ?? 0,
                      weather.hourly.time?.[caltime.current + 10] ?? "00:00",
                      weather.daily.sunrise?.[0] ?? "06:00",
                      weather.daily.sunset?.[0] ?? "18:00"
                    )
                  : "/Weather-Animated-icons/default.gif"
              }
              alt="Weather Icon"
            />{" "}
            <p className="inline-block">
              {weather?.hourly?.temperature_2m?.[0] !== undefined
                ? Math.round(
                    weather.hourly.temperature_2m[caltime.current + 10]
                  ) ?? "No Data"
                : "loading"}
            </p>
            <sup className=" text-xs inilne-block">o</sup>
          </div>
        </div>
        </div>


        
<div className=" font-bold pt-2 mt-1 h-[27%] w-[50%] bg-gray-200 rounded-lg p-2">
<p>Air Condition</p>
          <div className="grid grid-cols-2 grid-rows-2 h-50 w-200 p-2 ">
            <div>
              <img
                className="h-12 w-12 inline-block"
                src="Weather-Animated-icons/hot.gif"
                alt="Real-feel-weather.icon"
              />
              Real Feel{" "}
              <p className=" pl-12 text-2xl">
                {weather?.hourly?.apparent_temperature?.[hourlyTime[0]] !== undefined
                  ? Math.round(weather.hourly.apparent_temperature[hourlyTime[0]])
                  : "...loading"}
                <sup className="  inline-block">o</sup>
              </p>
            </div>
            <div >
              <img
                className="h-12 inline-block"
                src="Weather-Animated-icons/Wind.gif"
                alt="Real-feel-weather.icon"
              />
              Wind{" "}
              <p className="pl-12 text-2xl">
                {weather?.hourly?.wind_speed_10m?.[hourlyTime[0]] !== undefined
                  ? Math.round(weather.hourly.wind_speed_10m[hourlyTime[0]])
                  : " ...loading"}{" "}
                <span>
                  {weather?.hourly_units?.wind_speed_10m !== undefined
                    ? weather.hourly_units.wind_speed_10m
                    : "km/h"}
                </span>
              </p>
           
          </div>
            <div>
              <img
                className="h-12 inline-block"
                src="Weather-Animated-icons/Humidiltiy.gif"
                alt="Real-feel-weather.icon"
              />
              Humidity{" "}
              <p className="pl-12 text-2xl">
                {weather?.hourly?.relative_humidity_2m?.[hourlyTime[0]] !== undefined
                  ? weather.hourly.relative_humidity_2m[hourlyTime[0]]
                  : "...loading "}
                   <span>
                  {weather?.hourly_units?.relative_humidity_2m !== undefined
                    ? weather.hourly_units.
                    relative_humidity_2m
                    : "%"}
                </span>
              </p>
            </div>
            <div >
              <img
                className="h-12 inline-block"
                src="Weather-Animated-icons/UVindex.gif"
                alt="Real-feel-weather.icon"
              />
              UV index{" "}
              <p className="pl-12 text-2xl">
                {weather?.hourly?.uv_index?.[hourlyTime[0]] !== undefined
                  ? Math.round(weather.hourly.
                  uv_index[hourlyTime[0]])
                  :  " ...loading"}
              </p>
            </div>
        </div></div>
      </div>
    </>
  );
}

export default Weathers;



