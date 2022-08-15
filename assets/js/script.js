// $(document).ready(function() {

// });


var apiKey = "b137ba82c0ac5142d6480bc2e0ad3380";
var params;


function getApi(){
    getParam();
    console.log(params);
    if(params === null || params === undefined){
        return;
    }
    var resquestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + params[0] + "&lon=" + params[1] + "&exclude=alerts&appid=" + apiKey;

    setupLocalHistory(params);

    fetch(resquestURL)
    .then(function(response){
        if (response.status === 200) {
            console.log("ok");
        }
        else{
            console.log("not ok");
        }
        return response.json();
    })
    .then(function(data){
        console.log(data);
    });
}

function getParam(){
    var searchInput = $('#search');
    if(searchInput.val() === ""){
        alert("empty input. please enter a city name.");
        return null;
    }
    var url = "http://api.openweathermap.org/geo/1.0/direct?q="+ searchInput.val() + "&limit=1&appid=" + apiKey;
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        console.log(data[0].lat + ", " + data[0].lon + ", " + data[0].name);
        params = [data[0].lat, data[0].lon, data[0].name];
    });
}
function setupLocalHistory(params){
    var buttonGroupEl = $('#localHistory');
    var buttonEl = $('<button>');
    buttonEl.attr('type', 'button');
    buttonEl.attr('class', 'btn btn-primary');
    buttonEl.attr('data-latitude', params[0]);
    buttonEl.attr('data-longitude', params[1]);
    buttonEl.text(params[2]);
    buttonGroupEl.append(buttonEl);

}

$('#search-btn').on('click', getApi);