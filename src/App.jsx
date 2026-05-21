import { useState } from "react";

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=43200,MY&appid=${apiKey}`;

  const [data, setData] = useState("");

  const handleGenerateWeather = async () => {
    try {
      const geocodeResponse = await fetch(url);
      const geocodeData = await geocodeResponse.json();

      const coordinates = {
        lat: geocodeData.lat,
        lon: geocodeData.lon,
      };

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${apiKey}`,
      );

      setData(await weatherResponse.json());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Generate Weather button</h1>
      <button onClick={handleGenerateWeather}>Generate</button>
      {data && (
        <>
          <p>{data.timezone}</p>
          <p>{data.current.temp}</p>
          <p>{data.daily[0].summary}</p>
        </>
      )}
    </>
  );
}

export default App;
