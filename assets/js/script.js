var apiKey = "b137ba82c0ac5142d6480bc2e0ad3380";

var index = 0;
async function getData(){
    var searchInput = $('#search');
    if(searchInput.val() === ""){
        alert("empty input. please enter a city name.");
        return null;
    }
    var url = "http://api.openweathermap.org/geo/1.0/direct?q="+ searchInput.val() + "&limit=1&appid=" + apiKey;
    searchInput.val("");

    var response1 = await fetch(url);
    var data1 = await response1.json();
    var arr = [data1[0].lat, data1[0].lon, data1[0].name];
    setupLocalHistory(arr);
    // $('#localhistory').children().eq(index).attr('data-latitude')
    // $('#localhistory').children().eq(index).attr('data-longitude')
    var resquestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data1[0].lat + "&lon=" + data1[0].lon + "&exclude=alerts&units=imperial&appid=" + apiKey;
    index++;

    // var responeses = await Promise.all([fetch(url),fetch(resquestURL)]);
    var response2 = await fetch(resquestURL);
    var data2 = await response2.json();
    console.log(data2);
    // $('button').eq(index).attr('data-name')
    var weatherData = [data2.current.temp, data2.current.wind_speed, data2.current.humidity, data2.current.uvi, data1[0].name, data2.current.weather[0].icon];
    setupJumbotron(weatherData);
}

function setupLocalHistory(params){
    var buttonGroupEl = $('#localhistory');
    var buttonEl = $('<button>');
    buttonEl.attr('type', 'button');
    buttonEl.attr('class', 'btn btn-primary form-control mb-3');
    buttonEl.attr('data-latitude', params[0]);
    buttonEl.attr('data-longitude', params[1]);
    buttonEl.attr('data-name', params[2]);
    buttonEl.text(params[2]);
    buttonGroupEl.append(buttonEl);

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
    uvIndex.text(params[3]);


}

function setupForecasts(){

}

$('#search-btn').on('click', getData);