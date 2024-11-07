 // Create the base layers.
let basemap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
  {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5
});

basemap.addTo(myMap);

// // Create a legend layer.
// // Set up the legend.
// let legend = L.control({ position: "bottomright" });
// legend.onAdd = function() {
//   let div = L.DomUtil.create("div", "info legend");
//   let limits = [90, 70, 50, 30, 10, -10];
//   let colors = ["#ea2c2c", "#ea822c", "#ea822c", "#eecc00", "#d4ee00", "#98ee00"];
//   let labels = [];

//   // Add the minimum and maximum.
//   let legendInfo = "<h3>Depth</h3>" +
//     "<div class=\"labels\">" +
//       "<div class=\"min\">" + limits[0] + "</div>" +
//       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     "</div>";

//   div.innerHTML = legendInfo;

//   limits.forEach(function(limit, index) {
//     labels.push("<i style=\"background-color: " + colors[index] + "\"></i>");
//     div.innerHTML += "<i>" + labels.join("") + "</i>";
//   });
//   return div;
//   };

let legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let limits = [-10, 10, 30, 50, 70, 90];
    let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
    let labels = [];

    for (var i = 0; i < limits.length; i++) {
        div.innerHTML +=
            '<div class="legend-item"><i style=background:' + colors[i] + '></i> ' +
            limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+') + '</div>';
    }

    return div;
};


// Store our API endpoint as queryUrl.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL/
d3.json(link).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }


  // Define a function for the size of the marker.
  function markerSize(magnitude) {
    // return Math.sqrt(magnitude.properties.mag) * 50;
    if (magnitude === 0) {
      return 1;
    } 
    return magnitude * 4;
  }

  // Define a function for the color of the marker.
  function markerColor(depth) {
    switch (true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(myMap);
  legend.addTo(myMap);
});