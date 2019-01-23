// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
 });


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
       // myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
 //   myApp.alert('Here comes About page');
})

/*PM*/

function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    opencageapi(latitude, longitude);
      
    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false&key=YOUR_API_KEY";

    output.appendChild(img);
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}

// ----------- OPENCAGE API

function opencageapi(lat, lng) {

    var http = new XMLHttpRequest();
    const opencage = 'https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + lng + '&key=22e5695431c543d682e4d4b52ec743ab';
    http.open("GET", opencage);
    http.send();

    http.onreadystatechange = (e) => {
        var response = http.responseText
        var responseJSON = JSON.parse(response);    
        console.log(responseJSON);
        
        var country = responseJSON.results[0].components.country;  
        console.log(country);

        var city = responseJSON.results[0].components.city;    
        console.log(city);

        var currency = responseJSON.results[0].annotations.currency.iso_code;    
        console.log(currency);
    }

}


