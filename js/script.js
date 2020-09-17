(function () { 
    // Define a variable holding SVG mark-up that defines an icon image:
    var svgMarkup = '<svg width="24" height="24" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
        'height="22" /><text x="12" y="18" font-size="12pt" ' +
        'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
        'fill="white">H</text></svg>';

    var apiUrl = 'https://api.hel.fi/linkedevents/v1/place/?format=json';

    var icon = new H.map.Icon(svgMarkup),
        platform = new H.service.Platform({
            'apikey': window.HERE_API_KEY
        });

    // Obtain the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
            zoom: 10,
            center: {
                lat: lat,
                lng: lon
            }
        });
    
    fetch(apiUrl)
        .then(function (resp) {
            return resp.json()
        })
        .then(handleJSON)
        .catch(function (err) {
            console.log(err)
        })

    function handleJSON(json) {
        json.data.forEach(function(event){
            var _coordinates =  {
                lat: event.position.coordinates[1], 
                lng: event.position.coordinates[0]
            };

            var _marker = new H.map.Marker(_coordinates, {icon: icon});
            map.addObject(_marker);
        })
    }

    if (!navigator.geolocation) {
        return; 
    }

    // ask for user permission to retrieve their estimated coordinates according to ISP provider
    // if user allows us to fetch their coordinates (lon, lat) then invoke the perform tasks function
    navigator.geolocation.getCurrentPosition(performTasks);

    function performTasks(position) {   
        var lat = position.coords.latitude,
            lon = position.coords.longitude;
        
        var coords = { lat: lat, lng: lon },
            userLocationMarker = new H.map.Marker(coords, {icon: icon});
        
        // mark user location on the map
        map.addObject(userLocationMarker);
    }
})()

