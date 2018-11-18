var config = {
    apiKey: "AIzaSyAtoXNi11pzQhYSe5zMOQvM5BfPb0xRfYs",
    authDomain: "brewery-crawl-ccd46.firebaseapp.com",
    databaseURL: "https://Brewery-Crawl.firebaseio.com",
    projectId: "brewery-crawl-ccd46",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "322173165333",
  };
firebase.initializeApp(config);

var database = firebase.database();


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

// This is the Twilio portion of our javascript
// Send a SMS when button is clicked!




$(document).ready(function() {

    // function clear() {
    //     $("").val("");
    //     $("").val("");
    // }

    // $("#submit-btn").on("click", function(event) {

    //  let name = $("inputName").val().trim();
    //  let number = $("inputNumber").val().trim();

    //  const userInfo = {
    //      name: name,
    //      number: number,
    //  }

    //  database.ref().push(userInfo)
    //  clear();

    // });

  
    // Make var that will take the name and have the name 
    // hold the value of number and pull from Firebase  



    $("#textBtn").click(function() {
        
        const SID = "ACde7d929d4b9b0f7e32b6f0f553fe9667"
        const Key = "41cdc646ad2521c5e86216b3b17dca1b"

        $.ajax({
            type: 'POST',
            url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
            data: {
                "To" : "+16025494594",
                "From" : "+19562671699",
                "Body" : "I can see you"
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(SID + ':' + Key));
            },
            success: function(data) {
                console.log(data);
            },
            error: function(data) {
                console.log(data);
            }
        });
    });
});





