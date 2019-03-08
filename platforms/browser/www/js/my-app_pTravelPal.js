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
    tryingFile(); 
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
        myApp.alert('Here comes About page');
        
    }
   
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})

//PM

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
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false&key=AIzaSyApFPNQ2WxbEueUXMJBPHjLenlPnFo68ls";

    output.appendChild(img);
    initMap(latitude,longitude);
      
  }

    // THIS IS THE ORIGINAL MAP
function initMap(lat,lng) {
    var uluru = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
  /*  var marker2 = new google.maps.Marker({
        position: {lat: -23.6993336, lng: 133.8713752},
        map: map
    }); */
    opencageapi(lat, lng);
    getWeatherLocation(lat, lng);
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
     //   console.log(responseJSON);
        
        var country = document.getElementById("country"); 
     //   console.log(country);
        country.innerHTML = '<p>Country is ' + responseJSON.results[0].components.country; + '</p>';
        
        var city = document.getElementById("city");   
     //   console.log(city);
        city.innerHTML = '<p>City is ' + responseJSON.results[0].components.city; + '</p>';

        var currency = document.getElementById("currency");   
    //    console.log(currency);
        currency.innerHTML = '<p>Currency is ' + responseJSON.results[0].annotations.currency.iso_code; + '</p>';
    };

}

//---weather

function getWeatherLocation(lat, lng) {

    var http = new XMLHttpRequest();
    const openWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat +'&lon=' + lng+'&appid=6a3f488ff23fe4f8d164a6c4cad90f32';
    http.open("GET", openWeatherURL);
    http.send();
  
     http.onreadystatechange = (e) => {
        var response = http.responseText
        var responseJSON = JSON.parse(response);   
        console.log(responseJSON);
        
        document.getElementById('temp').innerHTML='<p>Temperature: '+ responseJSON.main.temp  + '</p>';
        document.getElementById('current').innerHTML='<p>Current weather: '+ responseJSON.weather[0].description + '</p>';;
        document.getElementById('wind').innerHTML='<p>Wind Speed: '+ responseJSON.wind.speed + '</p>';
      
    }

}
//-----picture
/*function pics()
{
    alert(navigator.camera); 
    
    navigator.camera.getPicture(cameraCallback,onerror);
}


function cameraCallback(imageData){
    var image = document.getElementById('myImage');
    image.src = imageData;
}


// ----------- SAVING FILES (READING AND WRITING)

function tryingFile(){

    // Displaying on console
    console.log(cordova.file);
    alert(cordova.file);
    // Displaying on front end
    var toDisplay = "";
    toDisplay += "App Dir " + cordova.file.applicationDirectory + "<br>";
    toDisplay += "App Storage Dir " + cordova.file.applicationStorageDirectory + "<br>";
    toDisplay += "Cache Dir " + cordova.file.cacheDirectory + "<br>";
    toDisplay += "Data Dir " + cordova.file.dataDirectory + "<br>";
    toDisplay += "Doc Dir " + cordova.file.documentsDirectory + "<br>";
    toDisplay += "Ext Cache Dir " + cordova.file.externalCacheDirectory + "<br>";
    toDisplay += "Ext Data Dir " + cordova.file.externalDataDirectory + "<br>";
    toDisplay += "Ext Root Dir " + cordova.file.externalRootDirectory + "<br>";
    toDisplay += "Shared Dir " + cordova.file.sharedDirectory + "<br>";
    toDisplay += "Temp Dir " + cordova.file.tempDirectory + "<br>";
    document.getElementById('file').innerHTML = toDisplay;

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs){
        
        // Displaying result in the console
        console.log('file system open: ' + fs.name);

        // Displaying in front end
        var toFronEnd = 'file system open: ' + fs.name;
        document.getElementById('file').innerHTML = toFronEnd;

        // Name of the file I want to create
        var fileToCreate = "newPersistentFile.txt";

        // Opening/creating the file
        fs.root.getFile(fileToCreate, { create: true, exclusive: false }, function (fileEntry){
            
            // Display in the console
            console.log("fileEntry is file?" + fileEntry.isFile.toString());

            // Displaying in front end
            var toFrontEnd = document.getElementById('file').innerHTML;
            toFrontEnd += "fileEntry is file?" + fileEntry.isFile.toString();
            document.getElementById('file').innerHTML = toFrontEnd;
            
            var dataObj = new Blob(['Lets write some text here'], { type: 'text/plain' });
            // Now decide what to do
            // Write to the file
           // writeFile(fileEntry, dataObject);

            // Or read the file
            readFile(fileEntry);

        }, onError);

    }, onError);
   
}

// Let's write some files
function writeFile(fileEntry, dataObj) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['Lets write some text here'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}

// Let's read some files
function readFile(fileEntry) {

    // Get the file from the file entry
    fileEntry.file(function (file) {
        
        // Create the reader
        var reader = new FileReader();


        reader.onloadend = function() {

            console.log("Successful file read: " + this.result);
            console.log("file path: " + fileEntry.fullPath);

        };

        reader.readAsText(file);

    }, onError);
}*/
//PM