//Set up default keys and buttons clicks, as well as globals 
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

//Auto_fill funtion using a timer on a 1 second call after the user finishes typing
var timer;
function auto_fill() {    
    clearInterval(timer);
    $("#suggest").empty().hide();
    let city = $( "#city" ).val();
    if (city.length > 0){ // if the input has a value run the rest of the function, else reset input and hide errors
        $( "#city" ).addClass("loader");
        var sec = 1 // timer value
        timer = setInterval(function() {
        sec--;
            if (sec == 0) { // if timer runs out, stop the loader, reset the errors, look through input value and split into array via "," 
                clearInterval(timer);
                $("#city").attr({
                    "style" : "border-color: initial", 
                    "data-info" : ""
                }).removeClass("loader");
                $("#suggest_error").empty().hide();               
                city = city.toLowerCase().split(",");
                //trim white space of all array values
                for(i=0; i<city.length; i++){
                    city[i] = $.trim(city[i]);
                }
                // this adds a comma at the end of the future string if the array is over 1, needed for an accurate api call
                let overONE = "";
                //if the array is 2 or over remove all other keys  
                if (city.length >= 2){
                    if(city[1] !== ''){
                        city.length = 2;
                        overONE = ",";
                    }else{
                        city.length = 1;
                    }
                    city = city.toString();                    
                } 
                    let link = "https://api.openweathermap.org/geo/1.0/direct?q="+city+overONE+"&limit=5&appid="+API_key; // set and send the link to the api geo call
                    fetch(link)
                    .then(response => response.json())
                    .then(function (data) {        
                        if(data.length > 0){ //if something comes back from the api call, loop through each key, and the city, state, and country into a string. Otherwise call an error
                            let duplicate_check = []; // starts an array of returned keys
                            for(i=0;i<data.length;i++){ 
                                let full_name = "";                                
                                if (data[i].name) full_name += data[i].name;
                                if (data[i].state) full_name += ","+data[i].state;
                                if (data[i].country) full_name += ","+data[i].country;                            
                                full_name = full_name.toLowerCase();                            
                                
                                
                                if(full_name.startsWith(city)){ // if strings from the api start with the string in the city input, run this  
                                    $("#city").css("border-color","green"); // successful, edit border to green
                                    $("#suggest").show(); // make the suggestions viewable
                                    if ($.inArray(full_name, duplicate_check) == -1){ // if this key is the same as one already returned exclude it
                                        let city_info = {
                                            lat : data[i].lat,
                                            lon : data[i].lon,
                                            name : data[i].name,
                                            state : data[i].state,
                                            country : data[i].country
                                        }

                                        city_info = JSON.stringify(city_info);

                                        if (duplicate_check.length == 0){ // if this key is the first successfull return edit the input element
                                            $( "#city" ).attr("data-info", city_info);
                                        }
                                        if (full_name !== $( "#city" ).val().toLowerCase()){ //add this key the #suggest ul element as a list item and att the data-attr field
                                            $( "<li>" ).text(full_name.replace(/,/g,', ')).attr("data-info", city_info).appendTo($("#suggest"));
                                        }
                                        duplicate_check.push(full_name);
                                    }                               
                                }
                            }
                            if(duplicate_check.length == 0){ // if none of the data that returned matched the startswith function on line 68, throw an error message 
                                $( "#city" ).css("border-color","red");
                                $("#suggest_error").text("No results. Check your spelling, or include the full name of the State/Province.").show();
                            }
                        } else { // if nothng came back from the api throw an error 
                            $( "#city" ).css("border-color","red");
                            $("#suggest_error").text("No results. Check your spelling, or include the full name of the State/Province.").show();
                        }                    
                    })
                }
        }   , 1000);
    } else { //if there is no value in the text input stop everything and reset 
        $("#suggest_error").empty().hide();
        $("#city").attr({
            "style" : "border-color: initial", 
            "data-info" : ""
        }).removeClass("loader");
        $("#suggest_error").empty().hide();
    }
}

// this function takes the data-info value from each suggestion and adds it to the input element #city.
//It changes that element's data-info attribute to match it's own, as well as the value of the input
function set_city(){
    $( "#city" ).attr({
        "data-info" : $(this).attr('data-info'),
        "style" : "border-color:green"
    }).val($(this).text());
    $("#suggest").empty().hide();
    //mobile script that runs if the screen is smaller than 
    if ($(window).width() < 587){
        $("#suggest").css("height", "initial"); // for small screens, collapses the drop down navigation after a suggestion is clicked 
        save_info(event); // for small screens, submits the form after a suggestion is slected
    }
}

//this function saves the data-info value from the input into the database if it doesnt already exist. Then the past search buttons are rendered
function save_info(event){
    event.preventDefault();
    let info = $("#city").attr("data-info");
    if(info !== ""){ // runs only if the data-info value is set
        $("#suggest").empty().hide();
        let cities = JSON.parse(localStorage.getItem("city_list"));
        let new_city = JSON.parse($("#city").attr('data-info'));
        let found = false;

        if (cities !== null) { // runs if there is a value in local storage 
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
        }else{ // creates the first localstorage value if it doesnt exist yet
            input = [new_city];
        }

        localStorage.setItem("city_list", JSON.stringify(input)); // sets either the current list, the updated list, or a new list
        
        renderPast_buttons(); // builds the past searches buttons
        compile(JSON.stringify(new_city)); // gets the value from the second api call, gathering weather data
    }else{ // error if no data-info value is set
        $( "#city" ).css("border-color","red"); 
        $("#suggest_error").text("No results. Check your spelling, or include the full name of the State/Province.").show();
    }
}

// This function builds buttons based of values stored in the localstorage
function renderPast_buttons() {
    //reset the input element
    $( "#city" ).val("").attr({
        'data-info' : '',
        "style" : "border-color: initial",
    });
    $('#past_searches').empty(); //reset past searches container
    $("#clear").css("display", "none"); //reset clear button to show hidden
    let cities = JSON.parse(localStorage.getItem("city_list"));
    if (cities !== null) { // runs if there is a value stored locally
        for(i=0; i < cities.length; i++){ // loop through each locally stored object and create the buttons, then append them the the container
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

//This function takes in an object with the city name, and coordinates, then uses those values to search the api for weather data
function compile(source){  
    co_ord =  JSON.parse(source);
    if(co_ord.lat == '' || co_ord.lon == ''){ //exit function of no lat and lon data is given
        return;
    }

    //send second API call to gather weather data from the API using the latitude and longitude stored in #city.attr(data-info) 
    let link = "https://api.openweathermap.org/data/2.5/onecall?lat="+co_ord.lat+"&lon="+co_ord.lon+"&units=metric&appid="+API_key;
    fetch(link)
    .then(response => response.json())
    .then(function (data) {        
        //compile the html for the one call
        oneDay_forecast(data); // send to the function that builds the one day weather report
    })
}

//builds the html for the one_day (current) section
function oneDay_forecast(data){    
    let time = moment.unix(data.current.dt).format("h:mm A");
    let conditions = data.current.weather[0].description;
    let icon = "https://openweathermap.org/img/w/"+data.current.weather[0].icon+".png";
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

    //sets the uv status based on the number returned from the API. Returns an array of the class to be used on the element, as well as the text to be used.
    let uvStatus = (
    uvi < 3 ? ['uv_low','Low']:
    uvi >= 3 && uvi < 6 ? ['uv_mod','Moderate']:
    uvi >= 6 && uvi < 8 ? ['uv_high','High']:
    uvi >= 8 && uvi < 11 ? ['uv_veryHigh','Very High']:
    uvi >= 11 ? ['uv_ext','Extreme']:
    null 
    );
    
    //compiles the html for the uv section
    let uv_content = $("<i>").attr("id","uv_index").text(uvi).addClass(uvStatus[0]);
    uv_content.appendTo($("#uv").text("UV Index:"));
    $("#uv").append(uvStatus[1]);
    fiveDay_forecast(data); // go to the compile 5 day weather report section
}    

//builds the html for the five day forecast section
function fiveDay_forecast(data){
    $("#cards_container").empty();
    for(i=0; i<5; i++){
        let day = moment.unix(data.daily[i].dt).format("ddd");
        let dayofM = moment.unix(data.daily[i].dt).format("MMM Do YYYY");
        let conditions = data.daily[i].weather[0].description;
        let icon = "https://openweathermap.org/img/w/"+data.daily[i].weather[0].icon+".png";
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

renderPast_buttons(); //on page load gets buttons from local storage if they exist
compile(default_city); // on page load sets toronto ontario canada as the default city 