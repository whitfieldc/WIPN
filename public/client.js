var when = require('when');

document.addEventListener("DOMContentLoaded", function(event) {

    if (when){
        console.log('hello')
    };

    // var latlng = new google.maps.LatLng(-34.397, 150.644);

    var mapOptions = {
                zoom: 13,
                // center: latlng,
                disableDefaultUI: true
                  };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    getLocation().then(function(response){
        centerMap(response, map);
    }).catch(function(response){
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        centerMap(latlng, map)
    });
    bindPost();
});

var getLocation = function(){
    var deferred = when.defer();
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var latlng = new google.maps.LatLng((position.coords.latitude), (position.coords.longitude))
            deferred.resolve(latlng);
        })
    } else { deferred.reject(new Error('no location available'))}
    return deferred.promise;
};

var centerMap = function(center, map){
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    map.setCenter(center);
    map.setZoom(15);
};

var bindPost = function(){
    var postButton = document.getElementById('post-seat');
    postButton.onclick = function(){
        // document.getElementById('input-popup').style.display="inline";
        toggleInput();
    };
};

var toggleInput = function(){
    var inputBox = document.getElementById('input-popup');
    var display = inputBox.style.display;
    if (inputBox.style.display === "none"){
        inputBox.style.display="inline";
    } else {
        inputBox.style.display === "none"
    };
};
