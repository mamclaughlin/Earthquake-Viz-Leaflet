// Define arrays to hold created city and state markers
var earthquakesArray = [];
var fautlLinesArray = [];

// URL for earthquakes
var link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
	// // Creating a GeoJSON layer with the retrieved data
	createFeatures(data.features);
});

function createFeatures(earthquakeData){
	var earthquakes = L.geoJSON(earthquakeData, {
	    pointToLayer: function (feature, latlng) {
	        return L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
				  fillOpacity: 0.75,
				  color: "purple",
				  fillColor: "red",
				  radius: feature.properties.mag * 5 
	        });
	    }
	});

	createMap(earthquakes);
}

function createMap(earthquakes){
	// Define variables for our base layers
	var streetmap = L.tileLayer(
	  "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
	    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
	    "T6YbdDixkOBWH_k9GbS8JQ"
	);
	var darkmap = L.tileLayer(
	  "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
	    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
	    "T6YbdDixkOBWH_k9GbS8JQ"
	);

	// Create a baseMaps object
	var baseMaps = {
	  "Street Map": streetmap,
	  "Dark Map": darkmap
	};

	// Create an overlay object
	var overlayMaps = {
	  // "State Population": faults,
	  "Earthquakes": earthquakes
	};

	// Define a map object
	var myMap = L.map("map", {
	  center: [37.09, -95.71],
	  zoom: 5,
	  layers: [streetmap, earthquakes]
	});

	// Pass our map layers into our layer control
	// Add the layer control to the map
	L.control.layers(baseMaps, overlayMaps, {
	  collapsed: false
	}).addTo(myMap);

}

