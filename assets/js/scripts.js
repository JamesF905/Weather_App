
let API_key = "52b83ade18965ec1516feaeccd8b85c8";
let city;
let state;
let country;
$( "#submit_city" ).click(compile);
$( "#city" ).keyup(auto_fill);

var timer;
function auto_fill() {    
    clearInterval(timer);
    $("#suggest").empty().hide();
    $( "#city" ).removeClass("loader");
    city = $( "#city" ).val();
    if (city.length > 0){
        $( "#city" ).addClass("loader");
        var sec = 5
        timer = setInterval(function() {
        sec--;
        //$("#suggest").text(sec);
            if (sec <1) {
                clearInterval(timer);
                $( "#city" ).removeClass("loader");
                    let link = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid="+API_key;
                    fetch(link)
                    .then(response => response.json())
                    .then(function (data) {        
                        let found = 0;
                        for(i=0;i<data.length;i++){
                            let full_name = "";                                
                                if (data[i].name) full_name += data[i].name;
                                if (data[i].state) full_name += ", "+data[i].state;
                                if (data[i].country) full_name += ", "+data[i].country;
                                if(full_name.toLowerCase().startsWith(city.toLowerCase())) {
                                    if(found === 0) {
                                        $( "#city" ).val(full_name);
                                    } else{
                                        $( "<li>" ).text(full_name).appendTo($("#suggest").show());
                                    }
                                    found++;
                                }
                        }
                        console.log(data);
                    })
                }
        }   , 1000);
    }
}


/*
var timer;
function myTimer() {
    $("#loader").show();
    $("#suggest").empty();
    var sec = 2
    clearInterval(timer);
    timer = setInterval(function() { 
    $('#suggest').text(sec--);
    if (sec == 0) {
      clearInterval(timer);
        city = $( "#city" ).val();
        if(city.length !== 0){
            let link = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid="+API_key;
            fetch(link)
            .then(response => response.json())
            .then(function (data) {        
                for(i=0;i<data.length;i++){
                    $( "<li>" ).text(`${data[i].name}, ${data[i].state}, ${data[i].country}`).appendTo($("#suggest"));
                }
            console.log(data);
            })
        }
        $("#loader").hide();
    } 
    }   , 1000);

}

$("#reset").click(function() {
   myTimer();
});
*/


function fart(){
    let tot = $( "#city" ).val().length;
    //if(tot % 2 === 0){
        $("#suggest").empty();
        city = $( "#city" ).val();
        let link = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid="+API_key;
        fetch(link)
        .then(response => response.json())
        .then(function (data) {        
            for(i=0;i<data.length;i++){
                $( "<li>" ).text(`${data[i].name},${data[i].state},${data[i].country}`).appendTo($("#suggest"));
            }
        console.log(data);
        })        
    //}    
}

/*
// Keydown event
textAreaEl.addEventListener('keydown', function (event) {
    // Access value of pressed key with key property
    var key = event.key.toLowerCase();
    var alphabetNumericCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789 '.split(
      ''
    );
    if (alphabetNumericCharacters.includes(key)) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].textContent += event.key;
      }
    }
  });*/


function compile(event){
    event.preventDefault();
    city = $( "#city" ).val();
    //state = "Ontario"; /*$( "#city" ).val();*/
    //country = "CA"; /*$( "#city" ).val();*/
    let link = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid="+API_key;
    
    //send first API call
    fetch(link)
    .then(response => response.json())
    .then(function (data) {
        
        console.log(data);
        // get coordinates for the city to use in the oneCall API call
        //let oneCall_link = "https://api.openweathermap.org/data/2.5/onecall?lat="+data[0].lat+"&lon="+data[0].lon+"&units=metric&appid="+API_key;
        //return fetch(oneCall_link);
    })/*
    .then(response => response.json())
    .then(function (data) {
        
        //compile the html for the one call
        oneDay_forecast(data);
        console.log(data);
        //send the link for the fiveDay API call 
        /*let fiveDay_link = "https://api.openweathermap.org/data/2.5/forecast?lat="+data.lat+"&lon="+data.lon+"&units=metric&appid="+API_key;
        return fetch(fiveDay_link);
    })*//*
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
        let dayofM = moment.unix(data.daily[i].dt).format("MMM Do YYYY");
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
        $("<li>").append($("<img>").attr("src", icon)).appendTo(list);
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