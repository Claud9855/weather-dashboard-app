var apiKey = "b137ba82c0ac5142d6480bc2e0ad3380";

for(var i = 0; i < parseInt(localStorage.getItem('index')); i++){
    console.log(typeof localStorage.getItem('index'));
    var loadContent = [localStorage.getItem('latitude-' + i), localStorage.getItem('longitude-' + i), localStorage.getItem('name-' + i)];
    setupLocalHistory(loadContent);
}

async function getData(){
    var searchInput = $('#search');
    if(searchInput.val() === ""){
        alert("empty input. please enter a city name.");
        return null;
    }
    var url = "https://api.openweathermap.org/geo/1.0/direct?q="+ searchInput.val() + "&limit=1&appid=" + apiKey;
    searchInput.val("");

    var response1 = await fetch(url);
    var data1 = await response1.json();
    console.log(data1);
    var arr = [data1[0].lat, data1[0].lon, data1[0].name];
    setupLocalHistory(arr);
    
    var resquestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data1[0].lat + "&lon=" + data1[0].lon + "&exclude=alerts,hourly,minutely&units=imperial&appid=" + apiKey;

    var response2 = await fetch(resquestURL);
    var data2 = await response2.json();
    console.log(data2);

    var weatherData = [data2.current.temp, data2.current.wind_speed, data2.current.humidity, data2.current.uvi, data1[0].name, data2.current.weather[0].icon];
    setupJumbotron(weatherData);
    console.log(data2.daily[0], data2.daily[1], data2.daily[2], data2.daily[3], data2.daily[4]);
    var forecastData = [data2.daily[0], data2.daily[1], data2.daily[2], data2.daily[3], data2.daily[4]];
    setupForecasts(forecastData);
}
var index = 0;
function setupLocalHistory(params){
    var buttonGroupEl = $('#localhistory');
    var buttonEl = $('<button>');
    buttonEl.attr('type', 'button');
    buttonEl.attr('class', 'btn btn-secondary form-control mb-3');
    buttonEl.attr('data-latitude', params[0]);
    localStorage.setItem('latitude-' + index, params[0]);
    buttonEl.attr('data-longitude', params[1]);
    localStorage.setItem('longitude-' + index, params[1]);
    buttonEl.attr('data-name', params[2]);
    localStorage.setItem('name-' + index, params[2]);
    buttonEl.text(params[2]);
    buttonGroupEl.append(buttonEl);
    index++;
    localStorage.setItem('index', index);

}

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

function setupForecasts(params){
    var forecastEl = $('#5-day-forecast');
    $('#5-day-forecast.row').empty();
    for(var i = 0; i < params.length; i++){
        var cardEl = $('<div>');
        cardEl.attr('class', 'card col bg-secondary text-white');
        cardEl.attr('style', 'margin:12px;');
        var cardBodyEl = $('<div>');
        cardBodyEl.attr('class', 'card-body');
        var dateHeading = $('<p>');
        dateHeading.text(moment().add(i + 1, 'd').format('M/D/YYYY'));
        dateHeading.attr('class', 'font-weight-bold');
        var iconHeading = $('<span>');
        iconHeading.html("<img src='http://openweathermap.org/img/wn/" + params[i].weather[0].icon + "@2x.png'/>");
        var tempHeading = $('<p>');
        console.log(params[i]);
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

console.log(moment().format('(M/D/YYYY)'));
for(var i = 1; i<=5; i++){
    console.log(moment().add(i, 'd').format('M/D/YYYY'));
}
$('#search-btn').on('click', getData);