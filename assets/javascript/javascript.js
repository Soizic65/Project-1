var config = {
    apiKey: "AIzaSyB9EFbkkslQZKdh_Nm8lGB9KfwZCCHGDWI",
    authDomain: "brewery-crawl.firebaseapp.com",
    databaseURL: "https://brewery-crawl.firebaseio.com",
    projectId: "brewery-crawl",
    storageBucket: "brewery-crawl.appspot.com",
    messagingSenderId: "958356463401"
};
firebase.initializeApp(config);



$("#searchBtn").on("click", function () {

    var theCity = $("#cityInput").val().toLowerCase()

    var queryURL = "https://api.openbrewerydb.org/breweries?by_city=" + theCity

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        $("#cityForm").append("<h1>hello</h1><h1>there</h2>")

    })

})
