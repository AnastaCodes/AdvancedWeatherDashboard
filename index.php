<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Weather</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="styles.css" />
    <script>
      window.API_OPENWEATHERMAP = '<?= getenv("API_OPENWEATHERMAP") ?>';
      window.API_GEO = '<?= getenv("API_GEO") ?>';
    </script>    
  </head>
  <body>
    <div id="initial-screen">
      <div id="navigation-container">
        <!-- Searchform -->
        <div id="search">
          <form action="" id="find">
            <input
              type="text"
              id="add"
              placeholder="Search for your preferred city..."
            />
            <button type="submit" class="search-button">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
        <!-- Location -->
        <div id="initial-current-location">
          <img src="./img/location-icon.png" alt="Location Icon" />
          <span>Current Location</span>
        </div>
      </div>
    </div>
    <div id="main-screen" style="display: none">
      <div id="main-container">
        <!-- Navigation -->
        <div id="navigation-container">
          <!-- Darkmode -->
          <div id="toggle">
            <div id="onoffswitch">
              <input
                type="checkbox"
                name="onoffswitch"
                class="onoffswitch-checkbox"
                id="myonoffswitch"
                tabindex="0"
                data-theme-toggle
              />
              <label class="onoffswitch-label" for="myonoffswitch"></label>
            </div>
            <p class="onoffswitch-name">Darkmode</p>
          </div>
          <!-- Searchform -->
          <div id="search">
            <form action="" id="find">
              <input
                type="text"
                id="add"
                placeholder="Search for your preferred city..."
              />
              <button type="submit" class="search-button">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
          <!-- Location -->
          <div id="current-location">
            <img src="./img/location-icon.png" alt="Location Icon" />
            <span>Current Location</span>
          </div>
        </div>
        <!-- Forecast Block -->
        <div id="forecast-container">
          <div class="row">
            <!-- City Info -->
            <div id="main-information">
              <div id="main-information-city"></div>
              <div id="main-information-hours"></div>
              <div id="main-information-date"></div>
            </div>
            <!-- Main forecast -->
            <div id="forecast">
              <div>
                <div id="forecast-degrees"><span></span>°C</div>
                <div id="forecast-feels">
                  Feels like:
                  <span id="forecast-feels-degrees"><span></span>°C</span>
                </div>
                <!-- Sunrise -->
                <div id="forecast-sunrise">
                  <div>
                    <img
                      src="./img/sunrise.png"
                      alt="Sunrise"
                      width="32"
                      height="32"
                    />
                  </div>
                  <div id="forecast-sunrise-value">
                    Sunrise <br /><span></span> AM
                  </div>
                </div>
                <!-- Sunset -->
                <div id="forecast-sunset">
                  <div>
                    <img
                      src="./img/sunset.png"
                      alt="Sunset"
                      width="32"
                      height="32"
                    />
                  </div>
                  <div id="forecast-sunset-value">
                    Sunset <br /><span></span> PM
                  </div>
                </div>
              </div>
              <!-- Middle forecast icon-->
              <div>
                <div id="forecast-icon">
                  <img src="" alt="Forecast Icon" width="150" height="150" />
                  <div id="forecast-state"></div>
                </div>
              </div>
              <!-- Additional Info -->
              <div id="forecast-box">
                <div>
                  <!-- Humidity -->
                  <div id="forecast-humidity">
                    <img
                      src="./img/humidity.png"
                      alt="Humidity"
                      width="79"
                      height="56"
                    /><span></span>Humidity
                  </div>
                  <!-- Pressure -->
                  <div id="forecast-pressure">
                    <img
                      src="./img/pressure.png"
                      alt="Pressure"
                      width="48"
                      height="48"
                    /><span></span>Pressure
                  </div>
                </div>
                <!-- Wind speed -->
                <div>
                  <div id="forecast-wind-speed">
                    <img
                      src="./img/wind.png"
                      alt="Wind"
                      width="79"
                      height="78"
                    /><span></span>Wind Speed
                  </div>
                  <!-- UV -->
                  <div id="forecast-uv">
                    <img
                      src="./img/uv.png"
                      alt="Uv"
                      width="64"
                      height="64"
                    /><span></span>UV
                  </div>
                </div>
              </div>
            </div>
            <div id="forecast-additional">
              <div id="forecast-additional-header">Air Pollution:</div>
              <div id="forecast-additional-box">
                <div id="co"><span></span>(Carbon monoxide)</div>
                <div id="no"><span></span>(Nitrogen monoxide)</div>
                <div id="no2"><span></span>(Nitrogen dioxide)</div>
                <div id="o3"><span></span>(Ozone)</div>
                <div id="so2"><span></span>(Sulphur dioxide)</div>
                <div id="pm2"><span></span>(Fine particles matter)</div>
                <div id="pm10"><span></span>(Coarse part. matter)</div>
                <div id="nh3"><span></span>(Ammonia)</div>
                <div>All parameters in <br /><span>μg/m3</span></div>
              </div>
              <div class="aqi">Air Quality Index: <span></span></div>
            </div>
          </div>
          <!-- Additional forecast (5 days & hourly)-->
          <div class="row">
            <!-- 5 Days -->
            <div id="days-forecast">
              <div id="days-forecast-header">5 Days Forecast:</div>
              <!-- Day 1 -->
              <div class="day" id="day-1">
                <img alt="Day 1" />
                <div><span></span>°C</div>
                <div id="day-date"></div>
              </div>
              <!-- Day 2 -->
              <div class="day" id="day-2">
                <img alt="Day 2" />
                <div><span></span>°C</div>
                <div id="day-date"></div>
              </div>
              <!-- Day 3 -->
              <div class="day" id="day-3">
                <img alt="Day 3" />
                <div><span></span>°C</div>
                <div id="day-date"></div>
              </div>
              <!-- Day 4 -->
              <div class="day" id="day-4">
                <img alt="Day 4" />
                <div><span></span>°C</div>
                <div id="day-date"></div>
              </div>
              <!-- Day 5 -->
              <div class="day" id="day-5">
                <img alt="Day 5" />
                <div><span></span>°C</div>
                <div id="day-date"></div>
              </div>
            </div>
            <!-- Hourly -->
            <div id="hourly-forecast">
              <div id="hourly-forecast-header">Hourly Forecast:</div>
              <div id="hourly-forecast-container">
                <!-- Hour-Box 1 -->
                <div class="hour" id="hour-one">
                  <div class="hour-time"></div>
                  <!-- Hour 1 info -->
                  <img alt="Weather Icon" />
                  <div id="hour-forecast-value"><span></span>°C</div>
                  <div class="description"></div>
                  <div class="wind"></div>
                  <img
                    class="navigation"
                    src="./img/navigation.png"
                    alt="Navigation"
                  />
                </div>
                <!-- Hour-Box 2 -->
                <div class="hour" id="hour-two">
                  <div class="hour-time"></div>
                  <!-- Hour 2 info -->
                  <img alt="Weather Icon" />
                  <div id="hour-forecast-value"><span></span>°C</div>
                  <div class="description"></div>
                  <div class="wind"></div>
                  <img
                    class="navigation"
                    src="./img/navigation.png"
                    alt="Navigation"
                  />
                </div>
                <!-- Hour-Box 3 -->
                <div class="hour" id="hour-three">
                  <div class="hour-time"></div>
                  <!-- Hour 3 info -->
                  <img alt="Weather Icon" />
                  <div id="hour-forecast-value"><span></span>°C</div>
                  <div class="description"></div>
                  <div class="wind"></div>
                  <img
                    class="navigation"
                    src="./img/navigation.png"
                    alt="Navigation"
                  />
                </div>
                <!-- Hour-Box 4 -->
                <div class="hour" id="hour-four">
                  <div class="hour-time"></div>
                  <!-- Hour 4 info -->
                  <img alt="Weather Icon" />
                  <div id="hour-forecast-value"><span></span>°C</div>
                  <div class="description"></div>
                  <div class="wind"></div>
                  <img
                    class="navigation"
                    src="./img/navigation.png"
                    alt="Navigation"
                  />
                </div>
                <!-- Hour-Box 5 -->
                <div class="hour" id="hour-five">
                  <div class="hour-time"></div>
                  <!-- Hour 5 info -->
                  <img alt="Weather Icon" />
                  <div id="hour-forecast-value"><span></span>°C</div>
                  <div class="description"></div>
                  <div class="wind"></div>
                  <img
                    class="navigation"
                    src="./img/navigation.png"
                    alt="Navigation"
                  />
                </div>
                <!-- Hour-Box 6 -->
                <div class="hour" id="hour-six">
                  <div class="hour-time"></div>
                  <!-- Hour 6 info -->
                  <img alt="Weather Icon" />
                  <div id="hour-forecast-value"><span></span>°C</div>
                  <div class="description"></div>
                  <div class="wind"></div>
                  <img
                    class="navigation"
                    src="./img/navigation.png"
                    alt="Navigation"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="./app.js" defer type="module"></script>
  </body>
</html>