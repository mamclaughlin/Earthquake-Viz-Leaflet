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


var layers = {
	earthquakes: new L.LayerGroup,
	faultLines: new L.LayerGroup,
	streetmap: new L.LayerGroup,
	darkmap: new L.LayerGroup
}
// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
  layers: [
  	layers.streetmap,
  	layers.earthquakes,
  	layers.faultLines,
  	layers.darkmap
  ]
});

// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

	// Create an overlay object
	var overlayMaps = {
	  // "State Population": faults,
	  "Earthquakes": layers.earthquakes,
	  "Fault Lines": layers.faultLines
	};

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);



// URL for earthquakes
var link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Grabbing our GeoJSON data for earthquakes..
d3.json(link, function(data) {
	// // Creating a GeoJSON layer with the retrieved data
	createFeatures(data.features, null);
});

//Grabbing data from tectonic plate information
var tectLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
d3.json(tectLink, function(data){
	createFeatures(null, data.features);
	// console.log(data.features[0]);
});

//create features for tectonic plate lines and for earthquakes
function createFeatures(earthquakeData, faultData){
	var earthquakes = L.geoJSON(earthquakeData, {
	    pointToLayer: function (feature, latlng) {
	    	//change the color according to magnitude
	    	function color(){
		    	if(feature.properties.mag <= 3){
		    		return "green";
		    	}else if(feature.properties.mag > 3 && feature.properties.mag <= 5.5){
		    		return "yellow";
		    	}else{
		    		return "red";
		    	};
	    	}
	    	//Return our data as a circle marker which adjusts according to the magnitude
	        return L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
	        {
				  fillOpacity: 0.50,
				  color: color(),
				  fillColor: color(),
				  radius: feature.properties.mag * 3
	        });
	    }
	});

	var faultLines =  L.geoJson(faultData, {
	    // Style each feature 
	    style: function(feature) {
	      return {
	        color: "white",
	        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
	        fillColor: "black",
	        fillOpacity: 0.5,
	        weight: 1.5
	      };
	    },
	    // Called on each feature
	    onEachFeature: function(feature, layer) {
	      // Set mouse events to change map styling
	      layer.on({
	        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
	        mouseover: function(event) {
	          layer = event.target;
	          layer.setStyle({
	            fillOpacity: 0.9
	          });
	        },
	        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
	        mouseout: function(event) {
	          layer = event.target;
	          layer.setStyle({
	            fillOpacity: 0.5
	          });
	        },

	      });

	    }//end on each feature
	});

	createMap(earthquakes,faultLines);

}


function createMap(earthquakes,faultLines){

	// // Define variables for our base layers
	// var streetmap = L.tileLayer(
	//   "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
	//     "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
	//     "T6YbdDixkOBWH_k9GbS8JQ"
	// );
	// var darkmap = L.tileLayer(
	//   "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
	//     "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
	//     "T6YbdDixkOBWH_k9GbS8JQ"
	// );

	// // Create a baseMaps object
	// var baseMaps = {
	//   "Street Map": streetmap,
	//   "Dark Map": darkmap
	// };

	// // Create an overlay object
	// var overlayMaps = {
	//   // "State Population": faults,
	//   "Earthquakes": earthquakes,
	//   "Fault Lines": faultLines
	// };
	

	// var layers = {
	// 	earthquakes: new L.LayerGroup,
	// 	faultLines: new L.LayerGroup,
	// 	streetmap: new L.LayerGroup,
	// 	darkmap: new L.LayerGroup
	// }
	// // Define a map object
	// var myMap = L.map("map", {
	//   center: [37.09, -95.71],
	//   zoom: 4,
	//   layers: [
	//   	layers.streetmap,
	//   	layers.earthquakes,
	//   	layers.faultLines
	//   ]
	// });

	// // Pass our map layers into our layer control
	// // Add the layer control to the map
	// L.control.layers(baseMaps, overlayMaps, {
	//   collapsed: false
	// }).addTo(myMap);

	// Create an overlay object
	overlayMaps = {
	  // "State Population": faults,
	  "Earthquakes": earthquakes,
	  "Fault Lines": faultLines
	};

}



	// // Define a map object
	// var myMap = L.map("map", {
	//   center: [37.09, -95.71],
	//   zoom: 4,
	//   layers: [streetmap, earthquakes, faultLines]
	// });


// function createLines(faultData){
// 	var faultLines = 
// 	  // Creating a geoJSON layer with the retrieved data
// 	  L.geoJson(faultData, {
// 	    // Style each feature 
// 	    style: function(feature) {
// 	      return {
// 	        color: "white",
// 	        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
// 	        fillColor: "black",
// 	        fillOpacity: 0.5,
// 	        weight: 1.5
// 	      };
// 	    },
// 	    // Called on each feature
// 	    onEachFeature: function(feature, layer) {
// 	      // Set mouse events to change map styling
// 	      layer.on({
// 	        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
// 	        mouseover: function(event) {
// 	          layer = event.target;
// 	          layer.setStyle({
// 	            fillOpacity: 0.9
// 	          });
// 	        },
// 	        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
// 	        mouseout: function(event) {
// 	          layer = event.target;
// 	          layer.setStyle({
// 	            fillOpacity: 0.5
// 	          });
// 	        },

// 	      });

// 	    }//end on each feature
// 	  });
// 	  createMap(faultLines);
// }


