
let API_key = "52b83ade18965ec1516feaeccd8b85c8";
const default_city ='{"lat":43.6534817,"lon":-79.3839347,"name":"Toronto","state":"Ontario","country":"CA"}'
let co_ord;
$( "#city" ).keyup(auto_fill);
$( '#suggest' ).on( "click", "li", set_city);
$( "#submit_city" ).click(save_info);
$( '#past_searches' ).on( "click", ".past", function (){compile($(this).attr('data-info'))});
$( "#clear" ).click(function(){
    localStorage.removeItem("city_list");
    renderPast_buttons();
})


var timer;
function auto_fill() {    
    clearInterval(timer);
    $("#suggest").empty().hide();
    let city = $( "#city" ).val();
    if (city.length > 0){
        $( "#city" ).addClass("loader");
        var sec = 1
        timer = setInterval(function() {
        sec--;
            if (sec == 0) {
                clearInterval(timer);
                $("#city").attr({
                    "style" : "border-color: initial", 
                    "data-info" : ""
                }).removeClass("loader");
                $("#suggest_error").empty().hide();               
                city = city.toLowerCase().split(",");
                console.log(city);
                for(i=0; i<city.length; i++){
                    city[i] = $.trim(city[i]);
                }
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
                            let duplicate_check = [];
                            for(i=0;i<data.length;i++){
                                let full_name = "";                                
                                if (data[i].name) full_name += data[i].name;
                                if (data[i].state) full_name += ","+data[i].state;
                                if (data[i].country) full_name += ","+data[i].country;                            
                                full_name = full_name.toLowerCase();                            
                                
                                
                                if(full_name.startsWith(city)){
                                    $("#city").css("border-color","green");
                                    $("#suggest").show();
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
                                        if (full_name !== $( "#city" ).val().toLowerCase()){
                                            $( "<li>" ).text(full_name.replace(/,/g,', ')).attr("data-info", city_info).appendTo($("#suggest"));
                                        }
                                        duplicate_check.push(full_name);
                                    }                               
                                }
                            }
                            if(duplicate_check.length == 0){
                                $( "#city" ).css("border-color","red");
                                $("#suggest_error").text("No results. Check your spelling, or include the full name of the State/Province.").show();
                            }
                            console.log(duplicate_check);
                        } else {
                            $( "#city" ).css("border-color","red");
                            $("#suggest_error").text("No results. Check your spelling, or include the full name of the State/Province.").show();
                        }                    
                    })
                }
        }   , 1000);
    } else {
        $("#suggest_error").empty().hide();
        $("#city").attr({
            "style" : "border-color: initial", 
            "data-info" : ""
        }).removeClass("loader");
        $("#suggest_error").empty().hide();
    }
}

function set_city(){
    $( "#city" ).attr({
        "data-info" : $(this).attr('data-info'),
        "style" : "border-color:green"
    }).val($(this).text());
    //$("#suggest").empty().hide();
    //alert($(window).width());
    document.documentElement.clientWidth > 587 ? $("#suggest").empty().hide() : null;
}

function save_info(event){
    event.preventDefault();
    let info = $("#city").attr("data-info");
    if(info !== ""){
        $("#suggest").empty().hide();
        let cities = JSON.parse(localStorage.getItem("city_list"));
        console.log(cities);
        let new_city = JSON.parse($("#city").attr('data-info'));
        let found = false;

        if (cities !== null) {
            input = cities;
            for(i=0; i < cities.length; i++){
                if ((cities[i].lat === new_city.lat) && (cities[i].lon === new_city.lon)){
                    found = true;
                    break;
                }
            }
            if(found == false){
                input.push(new_city);
            }
        }else{
            input = [new_city];
        }

        localStorage.setItem("city_list", JSON.stringify(input));
        
        renderPast_buttons();
        compile(JSON.stringify(new_city));
    }else{
        $( "#city" ).css("border-color","red");
        $("#suggest_error").text("No results. Check your spelling, or include the full name of the State/Province.").show();
    }
}

function renderPast_buttons() {
    $( "#city" ).val("").attr({
        'data-info' : '',
        "style" : "border-color: initial",
    });
    $('#past_searches').empty();
    $("#clear").css("display", "none");
    let cities = JSON.parse(localStorage.getItem("city_list"));
    if (cities !== null) {
        for(i=0; i < cities.length; i++){
            let full_name = "";                                
            if (cities[i].name) full_name += cities[i].name;
            if (cities[i].state) full_name += ", "+cities[i].state;
            if (cities[i].country) full_name += ", "+cities[i].country;
            $("<button>").attr({
                "class" : "nav_elements past",
                "type" : "button",
                "data-info" : JSON.stringify(cities[i])
            }).text(full_name).appendTo($('#past_searches'));
        }
        //Make the clear button visible
        $("#clear").css("display", "block");
    }
}


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

renderPast_buttons();
compile(default_city);