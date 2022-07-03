mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    // center: [130.84, -12.46], // starting position [lng, lat]
    center: [camp_coordinates, camp_coordinates1],
    zoom: 10 // starting zoom
});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
    .setLngLat([camp_coordinates, camp_coordinates1])
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${camp_title}</h3><p>${camp_location}</p>`
            )
    )
    .addTo(map)