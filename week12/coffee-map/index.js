/*
    RIT coffee map
*/

function initMap() {
    const {MapTypeId, Map, Marker, InfoWindow, Polygon} = google.maps;

    const MapEvent = google.maps.event;

    let mapInstance;
    let infoWindow;
    let markers = [];
    let polygons = [];

    let baseUrl = 'http://localhost:8000';

    const coffeeUrl = '/coffee.json';
    const buildingUrl = '/building.json';

    start();

    function start() {
        // MapTypeId.SATELLITE
        // MapTypeId.ROADMAP
        const mapOptions = {
            center: {
                lat: 43.083848,
                lng: -77.6799
            },
            zoom: 16,
            mapTypeId: MapTypeId.SATELLITE
        };

        mapInstance = new Map(document.getElementById('map'), mapOptions);

        hookupUI(mapInstance);

        lateInit(mapInstance);
    };

    async function lateInit(map) {
        // getCoffeeData(map);
    };

    async function getCoffeeData(map) {
        clearMarkers();
        try {
            const coffee = await fetch(`${baseUrl}${coffeeUrl}`);

            const {coffeeShops} = await coffee.json();

            markers = coffeeShops.map((cs) => createMarker(cs, map));

        } catch (e) {
            console.error(e);
        }
    }

    async function getBuildingData(map) {
        clearMarkers();
        clearPolygons();
        try {
            const buildingData = await fetch(`${baseUrl}${buildingUrl}`);

            const {buildings} = await buildingData.json();

            polygons = buildings.map((building) => {
                markers.push(createMarker(building, map));

                return new Polygon({paths:building.path, strokeColor:'#00FFFF', map});
            })
        } catch (e) {} finally {}
    }

    function hookupUI(map) {
        document.querySelector('#worldZoomButton').onclick = () => map.setZoom(1);

        document.querySelector('#defaultZoomButton').onclick = () => map.setZoom(16);

        document.querySelector('#buildingZoomButton').onclick = () => map.setZoom(20);

        document.querySelector('#isometricZoomButton').onclick = () => map.setZoom(18);

        document.querySelector('#updateCoffee').onclick = () => getCoffeeData(mapInstance);

        document.querySelector('#updateBuildings').onclick = () => getBuildingData(mapInstance);
    }

    function createInfoWindow(map, position, msg) {
        if (infoWindow) {
            infoWindow.close();
        }

        infoWindow = new InfoWindow({map, position, content: `<b>${msg}</b>`});
    }

    function createMarker({
        latitude,
        longitude,
        title
    }, map) {

        const position = {
            lat: latitude,
            lng: longitude
        };

        const marker = new Marker({position, map});

        marker.setTitle(title);

        MapEvent.addListener(marker, 'click', () => createInfoWindow(map, position, title));

        return marker;
    }

    function clearPolygons() {
        polygons.forEach((p) => p.setMap(null));
        polygons = [];
    }

    function clearMarkers() {
        markers.forEach((marker) => marker.setMap(null));
        markers = [];
    }

};
