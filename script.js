// DOM ELEMENTS //
const farenheitElement = document.querySelector('h2');
const cityElement = document.querySelector('h1');
const currIcon = document.querySelector(".currIcon");
const currCond = document.querySelector(".currCond");
const currWind = document.querySelector(".wind");
const currHumid = document.querySelector(".humid");
const currFeels = document.querySelector(".feels");
const currCount = document.querySelector(".country");
const currReg = document.querySelector(".region");
const searchInput = document.querySelector('input');
const day1Icon = document.querySelector(".day1Icon");
const day2Icon = document.querySelector(".day2Icon");
const day3Icon = document.querySelector(".day3Icon");
const day1Cond = document.querySelector(".day1cond");
const day2Cond = document.querySelector(".day2cond");
const day3Cond = document.querySelector(".day3cond");
const day1min = document.querySelector(".day1min");
const day2min = document.querySelector(".day2min");
const day3min = document.querySelector(".day3min");
const day1max = document.querySelector(".day1max");
const day2max = document.querySelector(".day2max");
const day3max = document.querySelector(".day3max");
const bodyBackground = document.querySelector('body');
let cityName = "london";


// Wait for fetchData to finish before checking if the key is entered if it is then change the nam to the input data and wait again (at the bottom it will call fetch data to actually display what was just entered)
searchInput.addEventListener('keydown',async (e) => {
    if (e.key == "Enter"){
        e.preventDefault();
        cityName = searchInput.value;
        searchInput.value = "";
        await fetchData();
    }
})

// fetch the current data and wait then parse then using the API calls return the values I need/want 
// by Using a factory function I can add the respecive values I want whenever I want and not blow up my code
async function current() {
    const data = await fetch('http://api.weatherapi.com/v1/current.json?key=137a088efb4a4b8d87a03031231006&q=' + cityName + '&aqi=yes', {mode: 'cors'});
    const result = await data.json();
    return {
        feelsLike: result.current.feelslike_f,
        farenheit: result.current.temp_f,
        city:      result.location.name, 
        region:    result.location.region,
        country:   result.location.country, 
        cond:      result.current.condition.text,
        condicon:  result.current.condition.icon,
        windSpeed: result.current.wind_mph,
        windDir:   result.current.wind_dir,
        humidity:  result.current.humidity
    }
}

// fetch the tiem data and wait then parse then using the API calls return teh values I need/want 
async function time() {
    const data = await fetch('http://api.weatherapi.com/v1/timezone.json?key=137a088efb4a4b8d87a03031231006&q=' + cityName + '&aqi=yes', {mode: 'cors'});
    const result = await data.json();
    return {
        currtime: result.location.localtime
    }
}

// fetch the forecast data and wait then parse then using the API calls return the values I need/want 
async function forecast() {
    const data = await fetch('http://api.weatherapi.com/v1/forecast.json?key=137a088efb4a4b8d87a03031231006&q=' + cityName + '&days=3&aqi=yes', {mode: 'cors'});
    const result = await data.json();
    return {
        forecastday1max: result['forecast']['forecastday'][0]['day']['maxtemp_f'],
        forecastday2max: result['forecast']['forecastday'][1]['day']['maxtemp_f'],
        forecastday3max: result['forecast']['forecastday'][2]['day']['maxtemp_f'],
        forecastday1min: result['forecast']['forecastday'][0]['day']['mintemp_f'],
        forecastday2min: result['forecast']['forecastday'][1]['day']['mintemp_f'],
        forecastday3min: result['forecast']['forecastday'][2]['day']['mintemp_f'],
        forecastday1icon: result['forecast']['forecastday'][0]['day']['condition']['icon'], //Might have to use own Icons based on size of Icon
        forecastday2icon: result['forecast']['forecastday'][1]['day']['condition']['icon'],
        forecastday3icon: result['forecast']['forecastday'][2]['day']['condition']['icon'],
        forecastday1text: result['forecast']['forecastday'][0]['day']['condition']['text'],
        forecastday2text: result['forecast']['forecastday'][1]['day']['condition']['text'],
        forecastday3text: result['forecast']['forecastday'][2]['day']['condition']['text']

    }
}

// Actually finisshes the fetch data and pulls all the respective va;ues then calls the DOM manip function to display teh results!
async function fetchData() {
    const curr = await current();
    const localTime = await time();
    const foreC = await forecast();
    domManipulation(curr, localTime, foreC);
    
    
}

function domManipulation(curr, localTime, foreC) {
    cityElement.textContent = "City: " + curr.city;
    farenheitElement.textContent ="Farenheit: " + curr.farenheit + '\u00B0';
    currFeels.textContent = "Feels Like: " + curr.feelsLike + '\u00B0';
    currHumid.textContent = "Humidity: " + curr.humidity + '\u0025';
    currWind.textContent = "Wind: " + curr.windSpeed + "mph " + curr.windDir;
    currReg.textContent = curr.region;
    currCount.textContent = curr.country

    // Forcast Day Icons Assigned to each src call in the html i.e replaces/places the image in the respective days box
    day1Icon.src = foreC.forecastday1icon.replace("//", 'https://');
    day2Icon.src = foreC.forecastday2icon.replace("//", 'https://');
    day3Icon.src = foreC.forecastday3icon.replace("//", 'https://');

    // Forcast days each assigned condition text, and min and max temps 
    day1Cond.textContent = foreC.forecastday1text;
    day2Cond.textContent = foreC.forecastday2text;
    day3Cond.textContent = foreC.forecastday3text;

    day1min.textContent = "Low: " + foreC.forecastday1min + '\u00B0';
    day2min.textContent = "Low: " + foreC.forecastday2min + '\u00B0';
    day3min.textContent = "Low: " + foreC.forecastday3min + '\u00B0';

    day1max.textContent = "High: " + foreC.forecastday1max + '\u00B0';
    day2max.textContent = "High: " + foreC.forecastday2max + '\u00B0';
    day3max.textContent = "High: " + foreC.forecastday3max + '\u00B0';

    console.log(curr.windDir);

    currCond.textContent = curr.cond;
    currIcon.src = curr.condicon.replace("//", 'https://');

    if (parseInt(localTime.currtime.substring(11, localTime.currtime.indexOf(":"))) > 6 && 
        parseInt(localTime.currtime.substring(11, localTime.currtime.indexOf(":"))) < 22)
    {
       bodyBackground.classList.add('day');
       bodyBackground.classList.remove('night');

    } else {
        bodyBackground.classList.add('night');
        bodyBackground.classList.remove('day');
        
    }
    

}

fetchData();