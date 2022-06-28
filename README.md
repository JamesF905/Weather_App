# Weather App
# by_James_Fidlin

<div id="top"></div>

[![LinkedIn][linkedin-shield]][linkedin-url]



<br />
<div align="center">
  <a href="https://github.com/JamesF905/Weather_App">
    <img src="images/favicon.ico" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Weather App</h3>

  <p align="center">
    <a href="https://jamesf905.github.io/Weather_App"><strong>https://jamesf905.github.io/Weather_App</strong></a>
    <br />
    <br />
    <a href="https://www.linkedin.com/in/james-fidlin-98853a239/">linkedin</a>
    ·
    <a href="www.gmail.com">Contact</a>
  </p>
</div>

## About The Project

[![Weather App][product-screenshot]](https://jamesf905.github.io/Weather_App)

This module's challenge requires me to create an app that displays weather information based on the location given in the search bar. 

When text is entered into the search bar, a timer starts, and after 1 second a call is made to the openweather API which returns an array of objects that have names that start with the given string. If no objects are found then an error is given to the user to be more specific, and to check their spelling. 

When an array is succesfully returned, the top value is used to set the "data-info" attribute in the text input. This data is a json string with all the information for that city, including longitute, latitude, name, state, and country. This value is required for the second API call to run, and will return an error if it is empty. This data value can also be filled via the saved cities buttons generated from previous searches, and stored in localstorage.

Once the data value is filled, and the form submitted, the second api call is made which generates html and shows all the current weather data, as well as a five day forecast. The "data-info" json string that was used to call the second API call is then saved in local storage, and used to generate buttons for past searches.

 

Searched locations will be saved in local storage and populated as click-able buttons in the navigation pannel.

The UVI report will have a green yellow or red color box attached to it vased on danger level.

<p align="right">(<a href="#top">back to top</a>)</p>


### Built With

* [Javascript](https://www.javascript.com/)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Git Hub](https://github.com/)
* [Git Bash](https://git-scm.com/)
* [JQuery](https://git-scm.com/)
* [Momentjs](https://momentjs.com/)
* [Font Awesome](https://fontawesome.com/icons)
* [Openweather API](https://openweathermap.org/api)

<p align="right">(<a href="#top">back to top</a>)</p>


## Contact

James Fidlin - gmail.com

Project Link: [https://github.com/JamesF905/Weather_App](https://github.com/JamesF905/Weather_App)

<p align="right">(<a href="#top">back to top</a>)</p>



[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/james-fidlin-98853a239/
[product-screenshot]: images/Project_Screenshot.png



