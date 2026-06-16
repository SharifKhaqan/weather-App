import { useState } from 'react';

const apiKey = '4193cd9a14293b4bbf32f2c9aa339b0d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

type WeatherResponse = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
  }>;
};

const weatherIcons: Record<string, string> = {
  Clouds: '/images/clouds.png',
  Clear: '/images/clear.png',
  Rain: '/images/rain.png',
  Drizzle: '/images/drizzle.png',
  Mist: '/images/mist.png',
  Snow: '/images/snow.png',
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState('');

  const checkWeather = async (searchCity: string) => {
    if (!searchCity.trim()) {
      return;
    }

    const response = await fetch(`${apiUrl}${encodeURIComponent(searchCity)}&appid=${apiKey}`);

    if (response.status === 404) {
      setWeather(null);
      setError('Invalid City Name');
      return;
    }

    const data = (await response.json()) as WeatherResponse;
    setWeather(data);
    setError('');
  };

  const weatherImage = weather ? weatherIcons[weather.weather[0].main] ?? '/images/rain.png' : '/images/rain.png';

  return (
    <div className="min-h-screen bg-[#222] px-4 py-20 text-white">
      <div className="mx-auto w-full max-w-xl rounded-[20px] bg-gradient-to-br from-[#00feba] via-[#1d8c99] to-[#5b548a] p-10 text-center shadow-2xl">
        <div className="flex w-full items-center gap-4">
          <input
            type="text"
            placeholder="Enter city name"
            spellCheck="false"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 rounded-full border-0 bg-[#ebfffc] px-6 py-4 text-[18px] text-[#555] outline-none"
          />
          <button
            onClick={() => void checkWeather(city)}
            className="inline-flex h-15 w-15 items-center justify-center rounded-full bg-[#ebfffc] p-4 text-center"
          >
            <img src="/images/search.png" alt="Search Button" className="h-4 w-4" />
          </button>
        </div>

        {error ? (
          <div className="mt-4 text-left text-sm text-white/90">{error}</div>
        ) : null}

        {weather ? (
          <div className="weather mt-8 block">
            <img src={weatherImage} alt="Weather icon" className="mx-auto w-40" />
            <h1 className="mt-6 text-[80px] font-medium leading-none">{Math.round(weather.main.temp)}°c</h1>
            <h2 className="mt-[-10px] text-[45px] font-normal">{weather.name}</h2>
            <div className="details mt-12 flex items-center justify-between px-5 text-left">
              <div className="col flex items-center gap-3">
                <img src="/images/humidity.png" alt="Humidity icon" className="w-10" />
                <div>
                  <p className="text-[28px]">{weather.main.humidity}%</p>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="col flex items-center gap-3">
                <img src="/images/wind.png" alt="Wind icon" className="w-10" />
                <div>
                  <p className="text-[28px]">{weather.wind.speed} km/h</p>
                  <p>Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
