var when = require('when');

document.addEventListener("DOMContentLoaded", function(event) {

    // var latlng = new google.maps.LatLng(-34.397, 150.644);
    // var socket = io();
    var mapOptions = {
                zoom: 19,
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
    bindSeatSubmit();
    socket.on('seat', function(seatObj){
        createSeatMarker(seatObj, map);
    })
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
    map.setZoom(19);
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
    if (inputBox.style.display === "none"){
        inputBox.style.display="inline";
    } else {
        inputBox.style.display = "none"
    };
};

var recordSeat = function(seatNote){
    getLocation()
    .then(function(response){
        seatObj = {
            note: seatNote,
            lat: response.lat(),
            lon: response.lng()
        };
        socket.emit('seat', seatObj);
    });
};

var bindSeatSubmit = function(){
    var submitButton = document.getElementById('seatSubmit');
    submitButton.onclick = function(event){
        event.preventDefault();
        var note = document.getElementById('seatNote').value;
        // console.log(note);
        document.getElementById('seatNote').value = "";
        toggleInput()
        recordSeat(note);
    };
};

var createSeatMarker = function(seatObj, targetMap){
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(seatObj.lat,seatObj.lon),
        map: targetMap,
        animation: google.maps.Animation.DROP,
    });
    var info = new google.maps.InfoWindow({
        content: '<h3>' + seatObj.note + '</h3>'
    });
    marker.addListener('click', function(){
        info.open(targetMap, marker);
    });
}
