mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style : "mapbox://styles/mapbox/streets-v12", //style url
        center: [ 73.691544, 24.571270], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 8 // starting zoom
    });
// writing value of mapToken in show.ejs since our MAP_TOKEN's access can be in ejs file only not in js so writing there and then accessing here "mapboxgl.accessToken = mapToken;"

console.log(coordinates);
// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color : "black"})
.setLngLat([[ 73.691544, 24.571270]]) //Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`))
.addTo(map);



//  listing.geometry.coordinates