import { useEffect, useState } from "react";
import "./App.css";
import { DateTime } from "luxon";
import { CircularProgress, Slide, TextField } from "@mui/material";
import Icon from "./Icon";

function App() {
  const key = "2e83e559867c8706e92fdf33c55ffaf1";
  const [city, setCity] = useState("Kyiv");
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [units, setUnits] = useState("metric");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=${units}`
    )
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [city, units, error]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCity(e.target.value);
      setInputText("");
    }
  };

  const formatToLocalTime = (secs, format = "cccc, dd LLL yyyy' |  'HH:mm ") =>
    DateTime.fromSeconds(secs).setZone("utc").toFormat(format);

  const windUnit = units === "metric" ? "km/h" : "m/s";
  const degree = units === "metric" ? "C" : "F";

  const handleUnit = (e) => {
    const selectedUnit = e.currentTarget.name;
    if (units !== selectedUnit) setUnits(selectedUnit);
  };

  return (
    <div className="App">
      <div className="image">
        <div className="bg_img"></div>
      </div>
      <div className="container">
        {!loading ? (
          <>
            <TextField
              variant="filled"
              label="Search location"
              className="input"
              value={inputText}
              error={error}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleSearch}
            />
            <h1 className="city">{data.name}</h1>
            <h3 className="local-date">
              {formatToLocalTime(data.dt + data.timezone)}
            </h3>
            <div className="group">
              <Icon code={data.weather[0].icon} />
              <span className="description">{data.weather[0].main}</span>
            </div>
            <div className="temp-details">
              <h2 className="temp">{Math.round(data.main.temp)}°</h2>
              <div className="degree">
                <button name="metric" onClick={handleUnit}>
                  C
                </button>
                |
                <button name="imperial" onClick={handleUnit}>
                  F
                </button>
              </div>
            </div>
            <Slide direction="right" timeout={800} in={!loading}>
              <div className="box-container">
                <div className="box">
                  <p>Humidity:</p>
                  <h3>
                    {data.main.humidity}
                    <small>%</small>
                  </h3>
                </div>
                <div className="box">
                  <p>Wind:</p>
                  <h3>
                    {Math.round(data.wind.speed)}
                    <small>{windUnit}</small>
                  </h3>
                </div>
                <div className="box">
                  <p>Feels Like:</p>
                  <h3>
                    {Math.round(data.main.feels_like)}°
                    <small className="degrees">{degree}</small>
                  </h3>
                </div>
              </div>
            </Slide>
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
      <h5>
        <a
          href="https://github.com/LesiaPr/weather_app_react"
          target="_blank"
          rel="noreferrer"
        >
          Open-source code
        </a>
        , by Lesia Pr.
      </h5>
    </div>
  );
}

export default App;
