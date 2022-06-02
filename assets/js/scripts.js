let API_key = "52b83ade18965ec1516feaeccd8b85c8";

$( "#submit_city" ).click(compile());


function compile(event){
    event.preventDefault();
    let city = $( "#city" ).val();
    let state = "ontario"; /*$( "#city" ).val();*/
    let country = "CA"; /*$( "#city" ).val();*/
    let link = "http://api.openweathermap.org/geo/1.0/direct?q="+city+","+state+","+country+"&limit=5&appid="+API_key;
    
    //send first API call
    fetch(link)
    .then(response => response.json())
    .then(function (data) {
        // get coordinates for the city to use in the oneCall API call
        let oneCall_link = "https://api.openweathermap.org/data/2.5/onecall?lat="+data[0].lat+"&lon="+data[0].lon+"&units=metric&appid="+API_key;
        return fetch(oneCall_link);
    })
    .then(response => response.json())
    .then(function (data) {
        //compile the html for the one call
        oneDay_forecast(data);
        //send the link for the fiveDay API call 
        let fiveDay_link = "https://api.openweathermap.org/data/2.5/forecast?lat="+data.lat+"&lon="+data.lon+"&units=metric&appid="+API_key;
        return fetch(fiveDay_link);
    })
    .then(response => response.json())
    .then(function (data) {
        //compile the html for the 5 day forecast
        fiveDay_forecast(data);
    })

    console.log(coordinates);
}

function oneDay_forecast(data){
    let time = data.current.dt;
    let conditions = data.current.weather[0].main;
    let icon = data.current.weather[0].icon;
    let temp = data.current.temp;
    let humidity = data.current.humidity;
    let wind_speed = data.current.wind_speed;
    let uvi = data.current.uvi;
}

function fiveDay_forecast(data){
    for(i=0; i<data.length; i++){
        let time = data[i].dt_txt;
        let conditions = data[i].weather[0].main;
        let icon = data[i].weather[0].icon;
        let temp = data[i].main.temp;
        let humidity = data[i].main.humidity;
        let wind_speed = data[i].wind.speed;
    }
}

function city_history(data){
    //Store in local storage
}