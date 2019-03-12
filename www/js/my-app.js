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
    checkRates(); // onload of the page when amount entered is empty, still exchange rate is displayed at the bottom, so call this checkRates() function onload of page
    geoFindMe();
  //  tryingFile(); //has writeFile call in it -Replaced by button at the bottom of the page as per intruction
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

/*PM*/

function geoFindMe() {
    
  var output = document.getElementById("out");
/* check condition to make sure navigator works, to call geolocation function*/
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
    
      output.innerHTML = "<p>Locating…</p>";

  /* calling getcurrentposition fucntion*/
    navigator.geolocation.getCurrentPosition(success, error);
    
 }


  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
   /*passing latitude and longitude coordinaes to opencage*/ 
    opencageapi(latitude, longitude);
     
    var output = document.getElementById("out");
    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    /* Map commented out and now not displayed as per discussed*/
   // var img = new Image();
   // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false&key=AIzaSyApFPNQ2WxbEueUXMJBPHjLenlPnFo68ls";
      
   
   // output.appendChild(img);
      
    /* calling initMap to display map*/
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
    /*calling opencage function by passing position coordinates*/
    opencageapi(lat, lng);
    /*calling getweatherlocation function by passing position coordinates*/
    getWeatherLocation(lat, lng);    


}



  function error() {
    output.innerHTML = "Im in function notInUse error";
  }

// ----------- OPENCAGE API  gives local information
/* opencage function takes position coordinates and gets country, currency, city data */
function opencageapi(lat, lng) {

    var http = new XMLHttpRequest();
    const opencage = 'https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + lng + '&key=22e5695431c543d682e4d4b52ec743ab';
    http.open("GET", opencage);
    http.send();

    http.onreadystatechange = (e) => {
        var response = http.responseText
        var responseJSON = JSON.parse(response);    
       console.log(responseJSON);
       //Here 
        var country = document.getElementById("country"); 
     //   console.log(country);
        country.innerHTML = '<p>Welcome to ' + responseJSON.results[0].components.country; + '</p>';
        
        var city = document.getElementById("city");   
     //   console.log(city);
        city.innerHTML = '<p> and a Big Welcome to ' + responseJSON.results[0].components.city; + '</p>';

        var currency = document.getElementById("currency");   
    //    console.log(currency);
        currency.innerHTML = '<p>Currency is ' + responseJSON.results[0].annotations.currency.iso_code; + '</p>';
    };

}

//---weather
/* getWeatherLocation function takes position coordinates and gets temp,current weather and wind speed data */
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
function pics()
{
    alert(navigator.camera); 
    
    navigator.camera.getPicture(cameraCallback,onerror);
}


function cameraCallback(imageData){
    var image = document.getElementById('myImage');
    image.src = imageData;
}


// ----------- SAVING FILES (READING AND WRITING)
/*tryfile function creates a file and calls writefile function */
function tryingFile(){
  
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs){
        
        // Displaying result in the console
        console.log('file system open: ' + fs.name);

        // Displaying in front end
        var toFronEnd = 'file system open: ' + fs.name;
        // ASK ABOUT THE BELOW
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
            
            // Now decide what to do
            // Write to the file
           writeFile(fileEntry, document.getElementById('file'));
            // writeFile(fileEntry, 777);
            //writeFile(fileEntry, null);
            // pass all data into above

              }, function (error) {
                    console.log(error);

                });

    }, function (error) {
                    console.log(error);

                });

   
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
    
    //alert("write");
    // Or read the file
            readFile(fileEntry);

  
}

// Let's read some files
function readFile(fileEntry) {
//alert("read");
    // Get the file from the file entry
    fileEntry.file(function (file) {
     //   alert("reading");
        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = function() {

            console.log("Successful file read: " + this.result);
            console.log("file path: " + fileEntry.fullPath);

        };

        reader.readAsText(file);

    }, function (error) {
                    console.log(error);

                });
}

//Exchnage code below

function checkRates()
{         
// Get all the conversion rates
//$$.getJSON("www.apilayer.net/api/live?access_key=b52635490dfe1c58117c8fafaf61236a&date=2005-02-01", function (data){ 
/*
{"success":true,"terms":"https:\/\/currencylayer.com\/terms","privacy":"https:\/\/currencylayer.com\/privacy","timestamp":1547548146,"source":"USD","quotes":{"USDAED":3.6733,"USDAFN":75.735499,"USDALL":109.130241,"USDAMD":486.219865,"USDANG":1.773983,"USDAOA":310.251988,"USDARS":36.975063,"USDAUD":1.387955,"USDAWG":1.8,"USDAZN":1.704991,"USDBAM":1.70415,"USDBBD":1.99045,"USDBDT":83.984015,"USDBGN":1.710402,"USDBHD":0.37705,"USDBIF":1793,"USDBMD":0.99995,"USDBND":1.576065,"USDBOB":6.91915,"USDBRL":3.699101,"USDBSD":1.00125,"USDBTC":0.000273,"USDBTN":71.02122,"USDBWP":10.52196,"USDBYN":2.15255,"USDBYR":19600,"USDBZD":2.014596,"USDCAD":1.326545,"USDCDF":1625.000021,"USDCHF":0.985535,"USDCLF":0.025048,"USDCLP":673.709966,"USDCNY":6.754296,"USDCOP":3139.6,"USDCRC":604.65982,"USDCUC":1,"USDCUP":26.5,"USDCVE":96.402499,"USDCZK":22.350504,"USDDJF":177.720169,"USDDKK":6.52691,"USDDOP":50.454989,"USDDZD":118.189437,"USDEGP":17.949756,"USDERN":15.000632,"USDETB":28.354046,"USDEUR":0.874475,"USDFJD":2.110202,"USDFKP":0.780025,"USDGBP":0.777925,"USDGEL":2.664983,"USDGGP":0.777608,"USDGHS":4.899902,"USDGIP":0.779975,"USDGMD":49.505013,"USDGNF":9114.797998,"USDGTQ":7.72305,"USDGYD":208.999843,"USDHKD":7.84365,"USDHNL":24.380496,"USDHRK":6.4962,"USDHTG":77.624498,"USDHUF":281.411994,"USDIDR":14100,"USDILS":3.66556,"USDIMP":0.777608,"USDINR":71.016502,"USDIQD":1192.55,"USDIRR":42104.999792,"USDISK":121.139937,"USDJEP":0.777608,"USDJMD":129.88016,"USDJOD":0.709703,"USDJPY":108.58025,"USDKES":101.659842,"USDKGS":69.850107,"USDKHR":4013.701297,"USDKMF":429.30639,"USDKPW":900.057689,"USDKRW":1121.930034,"USDKWD":0.302901,"USDKYD":0.832815,"USDKZT":379.239662,"USDLAK":8554.701471,"USDLBP":1510.150183,"USDLKR":182.250158,"USDLRD":158.950222,"USDLSL":13.879873,"USDLTL":2.95274,"USDLVL":0.60489,"USDLYD":1.38285,"USDMAD":9.51905,"USDMDL":17.115502,"USDMGA":3588.050261,"USDMKD":53.779929,"USDMMK":1519.14947,"USDMNT":2664.252216,"USDMOP":8.07425,"USDMRO":357.000199,"USDMUR":34.180496,"USDMVR":15.454966,"USDMWK":728.550547,"USDMXN":18.99903,"USDMYR":4.1014,"USDMZN":61.674974,"USDNAD":13.87982,"USDNGN":363.539734,"USDNIO":32.6215,"USDNOK":8.55065,"USDNPR":113.420169,"USDNZD":1.465135,"USDOMR":0.38499,"USDPAB":1.00135,"USDPEN":3.343103,"USDPGK":3.25215,"USDPHP":52.060985,"USDPKR":139.889903,"USDPLN":3.75206,"USDPYG":6016.049836,"USDQAR":3.640979,"USDRON":4.084946,"USDRSD":103.589971,"USDRUB":67.110011,"USDRWF":893.89,"USDSAR":3.75125,"USDSBD":8.023901,"USDSCR":13.645501,"USDSDG":47.591503,"USDSEK":8.95931,"USDSGD":1.353297,"USDSHP":1.320897,"USDSLL":8649.999871,"USDSOS":584.494317,"USDSRD":7.457973,"USDSTD":21050.59961,"USDSVC":8.744499,"USDSYP":514.999765,"USDSZL":13.884497,"USDTHB":31.879869,"USDTJS":9.42415,"USDTMT":3.5,"USDTND":2.953973,"USDTOP":2.255097,"USDTRY":5.427901,"USDTTD":6.78545,"USDTWD":30.814499,"USDTZS":2300.249994,"USDUAH":28.031962,"USDUGX":3697.849767,"USDUSD":1,"USDUYU":32.770064,"USDUZS":8339.499053,"USDVEF":9.9875,"USDVND":23204,"USDVUV":113.340742,"USDWST":2.599224,"USDXAF":571.559997,"USDXAG":0.064253,"USDXAU":0.000776,"USDXCD":2.70255,"USDXDR":0.716735,"USDXOF":571.550385,"USDXPF":103.909719,"USDYER":250.349927,"USDZAR":13.795901,"USDZMK":9001.196182,"USDZMW":11.98202,"USDZWL":322.355011}}
*/

// Get real time exchange rate for EUR from currency converter API 
// using JQuery .getJSON() function to get JSON from URL in Javascript 
$$.getJSON('http://apilayer.net/api/live?access_key=f545129233f98efae9647785369e1d54&currencies=EUR',function(data){

//JSON data from the currency converter API
//{"success":true,"terms":"https:\/\/currencylayer.com\/terms","privacy":"https:\/\/currencylayer.com\/privacy","timestamp":1547564647,"source":"USD","quotes":{"USDEUR":0.87312}}

	var quotesForView="";
    var quotes =data.quotes; //from the JSON data object returned from API, quotes object contains currency exchange rate, extract only quotes object into variable quotes from data object
    var keys = Object.keys(quotes);//returns an array of keys from quotes object, in above json data USDEUR is the key 
  // iteration through keys
    keys.forEach((element)=>{
	//element here = USDEUR, quotes[element] = 0.87312
        quotesforView=+quotes[element] + "  " + element; // returns 0.87312 USDEUR
});

//alert(quotesforView); // 0.87312 USDEUR

    var from = document.getElementById("amountfrom").innerHTML; // swaping the inner html between USD and EUR
    var to = document.getElementById("amountto").innerHTML;		// swaping the inner html between USD and EUR
    
    document.getElementById("fromrate").innerHTML = from;	// swaping the inner html between USD and EUR
    document.getElementById("torate").innerHTML = to;	   // swaping the inner html between USD and EUR
    
    checkConversion(quotesforView,from);	// calling checkConversion function and passing arguments quotesForView(0.87312 USDEUR) and from(USD/EUR)
    
});
   
}
function checkConversion(quotesforView,from){
    
    var amount = document.getElementById("amount").value; // get entered amount for conversion into amount variable
    
    if(amount!="")	//check condition if amount is not empty, to do conversion amount cannot be empty
    {
        if(from==="USD") // do following if converting from USD to EUR
        {
			//parseFloat(quotesForView) = parseFloat(0.87312 USDEUR) = 0.87312
			// .toFixed(2) rounds to two decimal points
            var result = (parseFloat(amount)*parseFloat(quotesforView)).toFixed(2);
            document.getElementById("result").value = result; // display result in result textbox
            document.getElementById("exchange").innerHTML = parseFloat(quotesforView); // show conversion rate at the bottom, so assign conversion rate to inner html of id = exchange
        }
        else // do following if converting from EUR to USD
        {
             var result = (parseFloat(amount)/parseFloat(quotesforView)).toFixed(2);
             document.getElementById("result").value = result;
             document.getElementById("exchange").innerHTML = (parseFloat(1)/parseFloat(quotesforView));
        }
     }
        
   else // result is empty when entered amount is empty, but display exchange rate even when amount is empty
    {
        document.getElementById("result").value = "";
        document.getElementById("exchange").innerHTML = parseFloat(quotesforView);
    }
    
}

function swap(){
//swap function to swap the USD and EUR titles next to amounts/rates
//swap inner htmls of the ids(amountto,amountfrom)

    var x = document.getElementById("amountto");
    var y = document.getElementById("amountfrom");
    if(x.innerHTML === "USD"){ // if swap button is clicked, if current title is USD swap to EUR
        x.innerHTML = "EUR";
        y.innerHTML = "USD";
    }
    else{ // if swap button is clicked, if current title is EUR swap to USD
        x.innerHTML = "USD";
        y.innerHTML = "EUR";
    }
    checkRates(); // Update exchange rate display at the bottom when swap button is clicked
}
