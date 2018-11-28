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

function reload() {
    location.reload();
};


    
var theBrewery = "SanTan Brewing Co"

var platform = new H.service.Platform({
    app_id: 'NjkFyMmOTiHhn4wGczXu',
    app_code: 'Xv-d8tKUWNWV76K41PAMEQ'
  });
  
  var search = new H.places.Search(platform.getPlacesService()),
    searchResult, error;
  
  var params = {

    'q': theBrewery,
    'at': '38.89206,-77.01991'
  };
  

  function onResult(data) {
    searchResult = data;
    var breweryList = searchResult.results.items

    for(var i = 0; i < breweryList.length; i++) {
        if(breweryList[i].title.split(" ")[0].toLowerCase() === theBrewery.split(" ")[0].toLowerCase()) {
            console.log(breweryList[i].vicinity)
        }
    }
  }
  
  function onError(data) {
    error = data;
  }
  
  search.request(params, {}, onResult, onError);



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

$("#theForm").submit(function() {
    $("#searchBtn").click()
    return false
})


// This is the Twilio portion of our javascript

function clearPersonalInput() {
    $("#nameInput").val("");
    $("#phoneNumberInput").val("");
    $('#confirmedTime').val("");
}

$(document).ready(function () {

    $("#submitPersonalInfo").on("click", function (event) {
        let name = $("#nameInput").val().trim();
        let number = $("#phoneNumberInput").val().trim();
        let confirmedTime = $('#confirmedTime').val().trim()
            .replace(/[^0-9 am pm]/g, '');
        let correctedNumber = number
            .replace(/[^0-9]/g, '');


        var userInfo = {
            name: name,
            correctedNumber: correctedNumber,

        }
        timeRef.set({
            showTime: confirmedTime,
        })

        ref.push(userInfo)
        clearPersonalInput();
        reload();

    });


    // Appending info from Firebase to the table


    database.ref('contacts').on("child_added", function (childSnapshot) {
        let name = childSnapshot.val().name
        let dataKey = childSnapshot.key
        let username = name + dataKey
        $(`
        <tr>
            <td scope="row">${name}</td>
            <td>
                <button type="button" class="btn btn-secondary removeUser" data-key="${dataKey}">
                Remove</button>
            </td>
        `).appendTo('#contactList')

    })

    // Remove button 

    $('#contactList').on('click', '.removeUser', function (event) {
        const key = $(this).attr('data-key')
        ref.child(key).remove()
        reload()
    })

    database.ref('brewery').once('value', function (childSnapshot) {
        let breweryChosen = childSnapshot.val().name
        $(`
        <tr>
            <td scope="row">${breweryChosen}</td>
        `).appendTo('#brewerySelected')
    })


    timeRef.on('value', function (snapshot) {
        let timeChosen = snapshot.val().showTime
        $(`
        <td>${timeChosen}</td>
        `).appendTo('#brewerySelected')
    })



// Send a SMS when button is clicked!


    // Creating the message to be sent

    timeRef.on('value', function (snapshot) {
        let timeChosen = snapshot.val().showTime


        database.ref('brewery').once('value', function (childSnapshot) {
            let breweryChosen = childSnapshot.val().name
            let breweryChosenLocation = childSnapshot.val().location
            const message = "Hey, we're going to " + breweryChosen + " which is at: " + breweryChosenLocation + ". We will be meeting there at: " + timeChosen;

        })
    })


    // Send a SMS when button is clicked!

    $("#submitSendSMS").click(function () {

        timeRef.on('value', function (snapshot) {
            let timeChosen = snapshot.val().showTime

            database.ref('brewery').once('value', function (childSnapshot) {
                let breweryChosen = childSnapshot.val().name
                let breweryChosenLocation = childSnapshot.val().location
                const message = "Hey, we're going to " + breweryChosen + " which is at: " + breweryChosenLocation + ". We will be meeting there at: " + timeChosen;
                console.log(message)


                const SID = "ACde7d929d4b9b0f7e32b6f0f553fe9667"
                const Key = "41cdc646ad2521c5e86216b3b17dca1b"
                database.ref('contacts').once('value', function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();
                        let name = childSnapshot.val().correctedNumber;


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

            console.log(message)


            const SID = "ACde7d929d4b9b0f7e32b6f0f553fe9667"
            const Key = "41cdc646ad2521c5e86216b3b17dca1b"
            database.ref('contacts').once('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    let name = childSnapshot.val().correctedNumber;

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
            });
        });
    });
});