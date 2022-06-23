
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
        /*let fiveDay_link = "https://api.openweathermap.org/data/2.5/forecast?lat="+data.lat+"&lon="+data.lon+"&units=metric&appid="+API_key;
        return fetch(fiveDay_link);*/
    })/*
    .then(response => response.json())
    .then(function (data) {
        
        //compile the html for the 5 day forecast
        fiveDay_forecast(data);
        console.log(data);
    })*/
}

function oneDay_forecast(data){    
    let time = moment.unix(data.current.dt).format("h:mm A");
    let conditions = data.current.weather[0].description;
    let icon = "http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png";
    let temp = data.current.temp;
    let humidity = data.current.humidity;
    let wind_speed = data.current.wind_speed;
    let uvi = data.current.uvi;

    $("#icon").attr("src", icon);
    $("span").attr("id","state_name").text(state+", "+country+" - "+time).appendTo($(" #city_name ").text(city));
    $("#conditions").text(conditions);
    $("#temp").text("Temperature : "+temp+"°C");
    $("#wind").text("Wind Speed : "+wind_speed+"KM/H");
    $("#humid").text("Humidity : "+humidity+"%");

    let uvStatus = (
    uvi < 3 ? ['uv_low','Low']:
    uvi >= 3 && uvi < 6 ? ['uv_mod','Moderate']:
    uvi >= 6 && uvi < 8 ? ['uv_high','High']:
    uvi >= 8 && uvi < 11 ? ['uv_veryHigh','Very High']:
    uvi >= 11 ? ['uv_ext','Extreme']:
    null 
    );
    
    let uv_content = $("<i>").attr("id","uv_index").text(uvi).addClass(uvStatus[0]);
    uv_content.appendTo($("#uv").text("UV Index:"));
    $("#uv").append(uvStatus[1]);
    fiveDay_forecast(data);
}    

function fiveDay_forecast(data){
    $("#cards_container").empty();
    for(i=0; i<5; i++){
        let day = moment.unix(data.daily[i].dt).format("ddd");
        let dayofM = moment.unix(data.daily[i].dt).format("MMM Do");
        let conditions = data.daily[i].weather[0].description;
        let icon = "http://openweathermap.org/img/w/"+data.daily[i].weather[0].icon+".png";
        let max_temp = data.daily[i].temp.max;
        let min_temp = data.daily[i].temp.min;
        let humidity = data.daily[i].humidity;
        let wind_speed = data.daily[i].wind_speed;

        let card = $("<div>").attr("class", "cards");
        let list = $("<ul>");
        $("<li>").text(day).appendTo(list);
        $("<li>").text(dayofM).appendTo(list);
        $("<img>").attr("src", icon).appendTo($("<li>")).appendTo(list);
        $("<li>").text(conditions).appendTo(list);
        $("<li>").text(+max_temp+"°C").appendTo(list);
        $("<li>").text(+min_temp+"°C").appendTo(list);
        $("<li>").text("Wind : "+wind_speed+"KM/H").appendTo(list);
        $("<li>").text("Humidity : "+humidity+"%").appendTo(list);
        list.appendTo(card);
        card.appendTo( $("#cards_container"));
    }
}

function city_history(data){
    //Store in local storage
}