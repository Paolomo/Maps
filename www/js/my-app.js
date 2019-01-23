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
  var output = document.getElementById("map");//map see below

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
    else{
        output.innerHTML = "<p>Locating…</p>";
        navigator.geolocation.getCurrentPosition(success, error);
    }


//hello you
    
    // athis another change
  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

   
      initMap(latitude, longitude);
   
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

 
}
/*

You need to install SSL Certificate. There is no quick fix for this solution. Google Chrome and other browsers are blocking this for security reasons.
*/

function initMap(lat, lng) {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
    var marker2 = new google.maps.Marker({
        position: {lat: -23.6993336, lng: 133.8713752},
        map: map
    });
    
}