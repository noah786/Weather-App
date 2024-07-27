const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchForm]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const userInfoContainer = document.querySelector(".user-info-container");
const loadingScreen = document.querySelector(".loading-container");
const grantAccessButton = document.querySelector("[data-grantAccess]")
const searchInput = document.querySelector("[data-searchInput]");
// Initially
let API_key = "ea2faf186f2c0c5e22ac9637686774ac";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

userTab.addEventListener('click', () => {
    switchTab(userTab);
});
searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains("active")){
           grantAccessContainer.classList.remove("active");
           userInfoContainer.classList.remove("active");
           searchForm.classList.add("active");
        }

        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            getFromSessionStorage();
        }

    }
}

function getFromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderUserWeatherInfo(data);
    }

    catch{
        loadingScreen.classList.remove("active");
    }

}

function renderUserWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloud]");


    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/w20/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;    
}

grantAccessButton.addEventListener('click', getlocation);
function getlocation() {
    if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
    }
    
    else{
        grantAccessContainer.innerText = 'geolocation is not supported';
    }
}

function showPosition(position){
    let userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        let data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderUserWeatherInfo(data);
    }

    catch{

    }
}