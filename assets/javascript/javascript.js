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
var ref = database.ref('contacts')
var timeRef = database.ref('time')

$("#searchBtn").on("click", function () {
    $("#breweryList").empty()
    var theCity = $("#cityInput").val().toLowerCase()

    var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + theCity

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

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
            
            <script>
                function breweryChoice(name, location) {
                    database.ref().child("brewery/name").set(name)
                    database.ref().child("brewery/location").set(location)
                }
            </script>
        `)

        response.forEach(function (eachBrewery) {
            var breweryName = eachBrewery.name
            var breweryLocation = eachBrewery.street

            $("#theBody").append(`
                <tr onClick="breweryChoice('${breweryName}', '${breweryLocation}')">
                    <td><a href='contact.html'>${breweryName}</a></td>
                    <td><a href='contact.html'>${breweryLocation}</a></td>
                </tr>
            `)

        })

        console.log(response);


    })

})

// This is the Twilio portion of our javascript

function clearPersonalInput() {
    $("#nameInput").val("");
    $("#phoneNumberInput").val("");
}

$(document).ready(function () {

    $("#submitPersonalInfo").on("click", function (event) {
        let name = $("#nameInput").val().trim();
        let number = $("#phoneNumberInput").val().trim();
        let confirmedTime = $('#confirmedTime').val().trim()
            .replace(/[^0-9 am pm]/g, '');
        let correctedNumber = number
            .replace(/[^0-9]/g, '');
        // let frequency = $('#').val().trim();
        // let correctedFrequency = frequency
        //     .replace(/[^0-9]/g, '');

        var userInfo = {
            name: name,
            correctedNumber: correctedNumber,
            // correctedFrequency: correctedFrequency,
        }
        timeRef.set({
            showTime: confirmedTime,
        })

        ref.push(userInfo)
        clearPersonalInput();

    });


    // Appending info from Firebase to the table

    // var indexNum = this.childSnapshot.val().name;
    // console.log(indexNum);

    database.ref('contacts').on("child_added", function (childSnapshot) {
        let name = childSnapshot.val().name
        let dataKey = childSnapshot.val().name.key
        $(`
        <tr>
            <td scope="row">${name}</td>
        `).appendTo('#contactList')
    })

    // Creating the message to be sent

    timeRef.on('value', function (snapshot) {
        let timeChosen = snapshot.val().showTime
        console.log(timeChosen)


        database.ref('brewery').once('value', function (childSnapshot) {
            let breweryChosen = childSnapshot.val().name
            let breweryChosenLocation = childSnapshot.val().location
            console.log(breweryChosen)
            console.log(breweryChosenLocation)
            const message = "Hey, we're going to " + breweryChosen + " which is at: " + breweryChosenLocation + ". We will be meeting there at: " + timeChosen;
            console.log(message)
        })
    })



// This code is for time till event
// let frequency = $('').val().trim();

// Send a SMS when button is clicked!

$("#submitSendSMS").click(function () {

    timeRef.on('value', function (snapshot) {
        let timeChosen = snapshot.val().showTime
        console.log(timeChosen)

        database.ref('brewery').once('value', function (childSnapshot) {
            let breweryChosen = childSnapshot.val().name
            let breweryChosenLocation = childSnapshot.val().location
            console.log(breweryChosen)
            console.log(breweryChosenLocation)
            const message = "Hey, we're going to " + breweryChosen + " which is at: " + breweryChosenLocation + ". We will be meeting there at: " + timeChosen;
            console.log(message)


            const SID = "ACde7d929d4b9b0f7e32b6f0f553fe9667"
            const Key = "41cdc646ad2521c5e86216b3b17dca1b"
            database.ref('contacts').once('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    let name = childSnapshot.val().correctedNumber;
                    console.log(name);
                    console.log(childKey);

                    $.ajax({
                        type: 'POST',
                        url: 'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
                        data: {
                            "To": "+1" + name,
                            "From": "+19562671699",
                            "Body": message,
                        },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Basic " + btoa(SID + ':' + Key));
                        },
                        success: function (data) {
                            console.log(data);
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    })
                })
            })
        });
    });
});
});