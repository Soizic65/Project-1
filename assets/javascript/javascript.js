var config = {
    apiKey: "AIzaSyAtoXNi11pzQhYSe5zMOQvM5BfPb0xRfYs",
    authDomain: "brewery-crawl-ccd46.firebaseapp.com",
    databaseURL: "https://brewery-crawl-ccd46.firebaseio.com",
    projectId: "brewery-crawl-ccd46",
    storageBucket: "brewery-crawl-ccd46.appspot.com",
    messagingSenderId: "322173165333"
};
firebase.initializeApp(config);

var database = firebase.database();



$("#searchBtn").on("click", function () {
    $("#breweryList").empty()
    var theCity = $("#cityInput").val().toLowerCase()

    var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + theCity

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {


        console.log(response)

        response.forEach(function (theBreweries) {
            if (theBreweries.street === "") {
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

        response.forEach(function (eachBrewery) {
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


// const message = "Hey " + name + "We are meeting at " + selectedBrewery + " ";



function clearPersonalInput() {
    $("#nameInput").val("");
    $("#phoneNumberInput").val("");
}

$(document).ready(function () {

    let name = $("#nameInput").val().trim();

    $("#submitPersonalInfo").on("click", function (event) {

        let name = $("#nameInput").val().trim();
        let number = $("#phoneNumberInput").val().trim();

        var userInfo = {
            name: name,
            number: number,
        }


        database.ref().push(userInfo)
        clearPersonalInput();

    });

    // Appending info from Firebase to the table

    database.ref().on("child_added", function(childSnapshot) {
        let name = childSnapshot.val().name
        $(`
        <tr>
            <td scope="row">${name}</td>
        `).appendTo('#contactList')
    })


    // Make var that will take the name and have the name 
    // hold the value of number and pull from Firebase  
    const message = "Hey meet us at "
 

    $("#submitSendSMS").click(function () {

        const SID = "ACde7d929d4b9b0f7e32b6f0f553fe9667"
        const Key = "41cdc646ad2521c5e86216b3b17dca1b"
        
        database.ref.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                // ...
            });
        });


        // $.ajax({
        //     type: 'POST',
        //     url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
        //     data: {
        //         "To": name,
        //         "From": "+19562671699",
        //         "Body": message,
        //     },
        //     beforeSend: function (xhr) {
        //         xhr.setRequestHeader("Authorization", "Basic " + btoa(SID + ':' + Key));
        //     },
        //     success: function (data) {
        //         console.log(data);
        //     },
        //     error: function (data) {
        //         console.log(data);
        //     }
        // });
    });
});