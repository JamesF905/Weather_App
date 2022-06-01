let API_key = "52b83ade18965ec1516feaeccd8b85c8";

$( "#submit_city" ).click(function(event) {
event.preventDefault();
let city = $( "#city" ).val();
let state = "ontario"; /*$( "#city" ).val();*/
let country = "CA"; /*$( "#city" ).val();*/
let geo_code_link = "http://api.openweathermap.org/geo/1.0/direct?q="+city+","+state+","+country+"&limit=5&appid="+API_key;
// current api link https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units=metric&appid="+API_key;
//one call api link https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&units=metric&appid="+API_key;


fetch(geo_code_link)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let latitude = data[0].lat;
        let longitude = data[0].lon;
        let API_link = "https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&units=metric&appid="+API_key;

        console.log(data);
        return fetch(API_link);
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        compile_API_data(data);
    })

function compile_API_data(data){
    let time = data.current.dt;
    let conditions = data.current.weather[0].main;
    let icon = data.current.weather[0].icon;
    let temp = data.current.temp;
    let humidity = data.current.humidity;
    let wind_speed = data.current.wind_speed;
    let uvi = data.current.uvi;

    alert("time"+time);
    alert("conditions"+conditions);
    alert("icon"+icon);
    alert("temp"+temp);
    alert("humidity"+humidity);
    alert("wind_speed"+wind_speed);
    alert("uvi"+uvi);
}
//alert("latitude: "+data[0].lat);
//alert("longitude: "+data[0].lon);
//let API_link = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid="+API_key

//parameters to use 
// city name
// date
// icons if available, else use font awesome
// temperature
// humidity
// windspeed
// uv index

// 5 day future forecast 

// dates
// icons if available, else use font awesome
// temperatures
// humidity levels
// windspeeds  
    
    
  });