var apiKey = "b137ba82c0ac5142d6480bc2e0ad3380";
// search history object
var searchHistory = {
    histories: []
};

/* function loads LocalStorage if there is any */
function loadContent(){
    if(JSON.parse(localStorage.getItem('search-history')) === null){
        return;
    }

    var savedContents = JSON.parse(localStorage.getItem('search-history'));
    for(var i = 0; i < savedContents.histories.length; i++){
        setupLocalHistory(savedContents.histories[i]);
    }
}

/* function perform fetch call to openweathermap api to retrieve weather datas */
async function getData(){
    var searchInput = $('#search');
    if(searchInput.val() === ""){
        alert("Please enter a city name.");
        return null;
    }
    var url = "https://api.openweathermap.org/geo/1.0/direct?q="+ searchInput.val() + "&limit=1&appid=" + apiKey;
    searchInput.val("");

    var response1 = await fetch(url);
    var data1 = await response1.json();

    var searchData = [data1[0].lat, data1[0].lon, data1[0].name];
    setupLocalHistory(searchData);
    
    var resquestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data1[0].lat + "&lon=" + data1[0].lon + "&exclude=alerts,hourly,minutely&units=imperial&appid=" + apiKey;

    var response2 = await fetch(resquestURL);
    var data2 = await response2.json();

    var weatherData = [data2.current.temp, data2.current.wind_speed, data2.current.humidity, data2.current.uvi, data1[0].name, data2.current.weather[0].icon];
    setupJumbotron(weatherData);
    var forecastData = [data2.daily[0], data2.daily[1], data2.daily[2], data2.daily[3], data2.daily[4]];
    setupForecasts(forecastData);
}

/* function setups the html for id local history */
function setupLocalHistory(params){
    var buttonGroupEl = $('#localhistory');
    var buttonEl = $('<button>');
    buttonEl.attr('type', 'button');
    buttonEl.attr('class', 'btn btn-secondary form-control mb-3');
    buttonEl.attr('data-latitude', params[0]);
    buttonEl.attr('data-longitude', params[1]);
    buttonEl.text(params[2]);

    buttonEl.on('click', async() => {
        var resquestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + params[0] + "&lon=" + params[1] + "&exclude=alerts,hourly,minutely&units=imperial&appid=" + apiKey;

        var response = await fetch(resquestURL);
        var data = await response.json();

        var weatherData = [data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, params[2], data.current.weather[0].icon];
        setupJumbotron(weatherData);
        var forecastData = [data.daily[0], data.daily[1], data.daily[2], data.daily[3], data.daily[4]];
        setupForecasts(forecastData);
    });

    buttonGroupEl.append(buttonEl);

    searchHistory.histories.push([params[0], params[1], params[2]]);
    localStorage.setItem('search-history', JSON.stringify(searchHistory));

}

/* function display current weather data */
function setupJumbotron(params){
    var headingEl = $('#search-input');
    var tempEl = $('#temp');
    var windEl = $('#wind');
    var humidityEl = $('#humidity');
    var uvIndex = $('#uv-index');
    headingEl.html(params[4] + " " + moment().format('(M/D/YYYY)') + "<span><img src='http://openweathermap.org/img/wn/" + params[5] + "@2x.png'/></span");
    tempEl.html(params[0] + " &#8457");
    windEl.text(params[1] + " MPH");
    humidityEl.text(params[2] + " %");
    if(params[3] >= 0 && params[3] < 3){
        uvIndex.text(params[3]);
        uvIndex.attr('style', 'background-color: green; border-radius: 10px; padding: 5px 10px; color: white;');
    }
    else if(params[3] > 2 && params[3] < 8){
        uvIndex.text(params[3]);
        uvIndex.attr('style', 'background-color: orange; border-radius: 10px; padding: 5px 10px; color: white;');
    }
    else {
        uvIndex.text(params[3]);
        uvIndex.attr('style', 'background-color: red; border-radius: 10px; padding: 5px 10px; color: white;');
    }

    


}

/* function display 5 day forecast weather data */
function setupForecasts(params){
    var forecastEl = $('#5-day-forecast');
    $('#5-day-forecast.row').empty();

    for(var i = 0; i < params.length; i++){
        var cardEl = $('<div>');
        cardEl.attr('class', 'card col-sm-2 p-2 bg-secondary text-white');
        cardEl.attr('style', 'margin:12px;');

        var cardBodyEl = $('<div>');
        cardBodyEl.attr('class', 'card-body');

        var dateHeading = $('<p>');
        dateHeading.text(moment().add(i + 1, 'd').format('M/D/YYYY'));
        dateHeading.attr('class', 'font-weight-bold');

        var iconHeading = $('<span>');
        iconHeading.html("<img src='http://openweathermap.org/img/wn/" + params[i].weather[0].icon + "@2x.png'/>");

        var tempHeading = $('<p>');
        tempHeading.html("Temp: " + params[i].temp.max + "&#8457");

        var windHeading = $('<p>');
        windHeading.text("Wind: " + params[i].wind_speed + "MPH");

        var humidityHeading = $('<p>');
        humidityHeading.text("Humidity: " + params[i].humidity + " %");

        cardBodyEl.append(dateHeading);
        cardBodyEl.append(iconHeading);
        cardBodyEl.append(tempHeading);
        cardBodyEl.append(windHeading);
        cardBodyEl.append(humidityHeading);
        cardEl.append(cardBodyEl);
        forecastEl.append(cardEl);
    }

}

// call loadContent function to first load any localstorage object
loadContent();
// added a click event to div element with id search-btn
$('#search-btn').on('click', getData);