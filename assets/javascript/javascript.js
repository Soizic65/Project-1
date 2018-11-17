
var config = {
    apiKey: "AIzaSyAtoXNi11pzQhYSe5zMOQvM5BfPb0xRfYs",
    authDomain: "brewery-crawl-ccd46.firebaseapp.com",
    databaseURL: "https://Brewery-Crawl.firebaseio.com",
    projectId: "brewery-crawl-ccd46",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "322173165333",
  };
firebase.initializeApp(config);



$("#searchBtn").on("click", function () {

    var theCity = $("#cityInput").val().toLowerCase()

    var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + theCity

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {


        console.log(response)

        response.forEach(function(theBreweries) {
            if(theBreweries.street === "") {
                theBreweries.street = "Unavailable"
            }
        })

        $("#breweryList").append(`
            <table class='table table-dark'>
                <thead>
                    <tr>
                        <th>Brewery Name</td>
                        <th>Location</td>
                    </tr>
                </thead>
                <tbody id='theBody'>

                </tbody>


            </table>
        `)

        response.forEach(function(eachBrewery) {
            var breweryName = eachBrewery.name
            var breweryLocation = eachBrewery.street

            $("#theBody").append(`
                <tr>
                    <td>${breweryName}</td>
                    <td>${breweryLocation}</td>
                </tr>
            `)

        })

        console.log(response);


    })

})