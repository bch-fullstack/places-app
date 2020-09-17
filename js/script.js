(function () { 
    // Define a variable holding SVG mark-up that defines an icon image:
    const SVG_MARKUP = `
        <svg width="24" height="24"
            xmlns="http://www.w3.org/2000/svg"> 
            <rect stroke="white" fill="#1b468d" x="1" y="1" width="22"
                height="22" />
            <text x="12" y="18" font-size="12pt"
                font-family="Arial" font-weight="bold" text-anchor="middle"
                fill="white">H</text>
        </svg>`;

    const API_URL = 'https://api.hel.fi/linkedevents/v1/place/?format=json';

    const ROVANIEMI_COORDINATES = {
        lat: 66.5039,
        lng: 25.7294
    };

    const MAP_CONTAINER = document.getElementById('mapContainer');
    
    var icon = new H.map.Icon(SVG_MARKUP),
        platform = new H.service.Platform({
            'apikey': window.HERE_API_KEY
        });

    // Obtain the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new H.Map(
        MAP_CONTAINER,
        defaultLayers.vector.normal.map,
        {
            zoom: 10,
            center: ROVANIEMI_COORDINATES
        });
    
    fetch(API_URL)
        .then(function(resp) {
            return resp.json()
        })
        .then(handleJSON)
        .catch(function (err) {
            console.log(err)
        })
    
    /**
     * Iterate through the json object for events data
     * for each event, render their coordinates to the HERE map object with addObject method
     * https://developer.here.com/documentation/examples/maps-js/markers/markers-on-the-map
     * 
     * @param {Object} json parsed response from the API called
     */
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

    // if the user browser doesnt support geolocation, suspend everything
    if (!navigator.geolocation) {
        return; 
    }

    // ask for user permission to retrieve their estimated coordinates according to ISP provider
    // if user allows us to fetch their coordinates (lon, lat) then invoke the perform tasks function
    navigator.geolocation.getCurrentPosition(performTasks);

    /**
     * This function will be invoked if user allows fetching their coordinates in the popup
     * extract the user lat, lon from position.coords object
     * create HERE map marker object with H.map.Marker constructor and addObject method
     * https://developer.here.com/documentation/examples/maps-js/markers/markers-on-the-map
     * 
     * @param {Object} position 
     */
    function performTasks(position) {   
        var lat = position.coords.latitude,
            lon = position.coords.longitude;
        
        var coords = { lat: lat, lng: lon },
            userLocationMarker = new H.map.Marker(coords, {icon: icon});
        
        // mark user location on the map
        map.addObject(userLocationMarker);
    }
})()

