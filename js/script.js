(function(){
    var lat = null,
        lon = null;

    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        lat = position.coords.latitude;
        lon = position.coords.longitude;

        // user coordinates 
    })   

    fetch(`https://api.hel.fi/linkedevents/v1/place/?format=json`)
        .then(function(resp){
            return resp.json()
        })
        .then(function(json){
            console.log(json)
            // places with coordinates
        })
        .catch(function(err){
            console.log(err)
        })

    
})()

