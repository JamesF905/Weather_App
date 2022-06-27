
let API_key = "52b83ade18965ec1516feaeccd8b85c8";
let co_ord;
$( "#submit_city" ).click(save_info);
$( '#suggest' ).on( "click", "li", set_city);
$( '<nav>' ).on( "click", ".past", compile);
$( "#city" ).keyup(auto_fill);

var timer;
function auto_fill() {    
    clearInterval(timer);
    $("#suggest").empty().hide();
    let city = $( "#city" ).val();
    if (city.length > 0){
        $( "#city" ).addClass("loader");
        var sec = 2
        timer = setInterval(function() {
        sec--;
        //$("#suggest").text(sec);
            if (sec == 0) {
                clearInterval(timer);
                $( "#city" ).removeClass("loader");
                city = city.toLowerCase().replace(/ /g,'').split(",");
                console.log(city);
                let overONE = "";  
                if (city.length >= 2){
                    if(city[1] !== ''){
                        city.length = 2;
                        overONE = ",";
                    }else{
                        city.length = 1;
                    }
                    console.log(city);
                    city = city.toString();                    
                    console.log(city+overONE);
                }     
                    let link = "http://api.openweathermap.org/geo/1.0/direct?q="+city+overONE+"&limit=5&appid="+API_key;
                    fetch(link)
                    .then(response => response.json())
                    .then(function (data) {
                        console.log(data);        
                        if(data.length > 0){
                            $("#city").attr("style","border-color:green");
                            $("#suggest").show();
                            $("#suggest_error").empty();
                            let duplicate_check = [];
                            for(i=0;i<data.length;i++){
                                let full_name = "";                                
                                if (data[i].name) full_name += data[i].name;
                                if (data[i].state) full_name += ","+data[i].state;
                                if (data[i].country) full_name += ","+data[i].country;                            
                                full_name = full_name.toLowerCase();                            
                                
                                
                                if(full_name.startsWith(city)){
                                    if ($.inArray(full_name, duplicate_check) == -1){
                                        let city_info = {
                                            lat : data[i].lat,
                                            lon : data[i].lon,
                                            name : data[i].name,
                                            state : data[i].state,
                                            country : data[i].country
                                        }

                                        city_info = JSON.stringify(city_info);

                                        if (duplicate_check.length == 0){
                                            $( "#city" ).attr("data-info", city_info);
                                        }
                                        if (full_name !== $( "#city" ).val().toLowerCase().replace(/ /g,'')){
                                            $( "<li>" ).text(full_name).attr("data-info", city_info).appendTo($("#suggest"));
                                        }
                                        duplicate_check.push(full_name);
                                    }                               
                                }
                            }
                            console.log(duplicate_check);
                        } else {
                            $( "#city" ).attr({
                                "data-info" : "",
                                "style" : "border-color:red"
                            });
                            $("#suggest_error").text("No results. Check your spelling, or include the full name of the State/Province.");
                        }
                    console.log(data);
                    
                    })
                }
        }   , 1000);
    } else {
        $("#suggest_error").empty();
        $("#city").attr("style","border-color: initial");
        $( "#city" ).removeClass("loader");
    }
}

function set_city(){
    $( "#city" ).attr({
        "data-info" : $(this).attr('data-info'),
        "style" : "border-color:green"
    }).val($(this).text());
    $("#suggest").empty().hide();
}

function save_info(event){
    event.preventDefault();
    let cities = JSON.parse(localStorage.getItem("city_list"));
    console.log(cities);
    let new_city = JSON.parse($("#city").attr('data-info'));
    let found == false;

    if (cities !== null) {
        for(i=0; i < cities.length; i++){
            if ((cities[i].lat === new_city.lat) && (cities[i].lon === new_city.lon)){
                alert("same city silly! lat - "+cities[i].lat+" lat - "+new_city.lat);
                alert("same city silly! lon- "+cities[i].lon+" lon - "+new_city.lon);
                found == true;
                break;
            }
        }
        if(found == false){
            input = cities.push(new_city);
        }
    }

    localStorage.setItem("city_list", JSON.stringify(input));
    //compile(JSON.stringify(new_city));
}
/*
function renderMessage() {
  var lastGrade = JSON.parse(localStorage.getItem("studentGrade"));
  if (lastGrade !== null) {
    document.querySelector(".message").textContent = lastGrade.student + 
    " received a/an " + lastGrade.grade
  }
}

}
*/
function compile(source){  
    co_ord =  JSON.parse(source);
    
    if(co_ord.lat == '' || co_ord.lon == ''){
        return;
    }

    //send first API call
    let link = "https://api.openweathermap.org/data/2.5/onecall?lat="+co_ord.lat+"&lon="+co_ord.lon+"&units=metric&appid="+API_key;
    fetch(link)
    .then(response => response.json())
    .then(function (data) {        
        //compile the html for the one call
        oneDay_forecast(data);
        console.log(data);
    })
}

function oneDay_forecast(data){    
    let time = moment.unix(data.current.dt).format("h:mm A");
    let conditions = data.current.weather[0].description;
    let icon = "http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png";
    let temp = data.current.temp;
    let humidity = data.current.humidity;
    let wind_speed = data.current.wind_speed;
    let uvi = data.current.uvi;

    let state_cty = co_ord.state ? co_ord.state+", "+co_ord.country : co_ord.country;
    $("#icon").attr("src", icon);
    $("span").attr("id","state_name").text(state_cty+" - "+time).appendTo($(" #city_name ").text(co_ord.name));
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