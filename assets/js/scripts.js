
let API_key = "52b83ade18965ec1516feaeccd8b85c8";
let city;
let state;
let country;
$( "#submit_city" ).click(compile);


function compile(event){
    event.preventDefault();
    city = $( "#city" ).val();
    state = "Ontario"; /*$( "#city" ).val();*/
    country = "CA"; /*$( "#city" ).val();*/
    let link = "http://api.openweathermap.org/geo/1.0/direct?q="+city+","+state+","+country+"&limit=5&appid="+API_key;
    
    //send first API call
    fetch(link)
    .then(response => response.json())
    .then(function (data) {
        
        console.log(data);
        // get coordinates for the city to use in the oneCall API call
        let oneCall_link = "https://api.openweathermap.org/data/2.5/onecall?lat="+data[0].lat+"&lon="+data[0].lon+"&units=metric&appid="+API_key;
        return fetch(oneCall_link);
    })
    .then(response => response.json())
    .then(function (data) {
        
        //compile the html for the one call
        oneDay_forecast(data);
        console.log(data);
        //send the link for the fiveDay API call 
        let fiveDay_link = "https://api.openweathermap.org/data/2.5/forecast?lat="+data.lat+"&lon="+data.lon+"&units=metric&appid="+API_key;
        return fetch(fiveDay_link);
    })
    .then(response => response.json())
    .then(function (data) {
        
        //compile the html for the 5 day forecast
        fiveDay_forecast(data);
        console.log(data);
    })
}

function oneDay_forecast(data){    
    let time = data.current.dt;
    let conditions = data.current.weather[0].description;
    let icon = "http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png";
    let temp = data.current.temp;
    let humidity = data.current.humidity;
    let wind_speed = data.current.wind_speed;
    let uvi = data.current.uvi;

    $("#icon").attr("src", icon);
    $("span").attr("id","state_name").text(state+", "+country+" - "+moment.unix(time).format("h:mm A")).appendTo($(" #city_name ").text(city));
    $("#conditions").text(conditions);
    $("#temp").text("Temperature : "+temp);
    $("#wind").text("Wind Speed : "+wind_speed);
    $("#humid").text("Humidity : "+humidity);

    let uvStatus = (
    uvi < 3 ? ['uv_low','Low']:
    uvi >= 3 && uvi < 6 ? ['uv_mod','Moderate']:
    uvi >= 6 && uvi < 8 ? ['uv_high','High']:
    uvi >= 8 && uvi < 11 ? ['uv_veryHigh','Very High']:
    uvi >= 11 ? ['uv_ext','Extreme']:
    null 
    );
    
    $("<i>").attr("id","uv_index").text(uvi).addClass(uvStatus[0]).after( document.createTextNode(uvStatus[1])).appendTo($("#uv").text("UV Index:"));
}    

function fiveDay_forecast(data){
    
    for(i=0; i<data.length; i++){
        let time = data.list[i].dt_txt;
        let conditions = data.list[i].weather[0].main;
        let icon = "http://openweathermap.org/img/w/"+data.list[i].weather[0].icon+".png";
        let temp = data.list[i].main.temp;
        let humidity = data.list[i].main.humidity;
        let wind_speed = data.list[i].wind.speed;
    }
}

function city_history(data){
    //Store in local storage
}