// While this example uses ES6, make sure to distribute your code
// in ES5 to support older browsers
(function() {

  const MARKER = encodeURI(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg width="100%" height="100%" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
  <path d="M4.784,13.635c0,0 -0.106,-2.924 0.006,-4.379c0.115,-1.502 0.318,-3.151 0.686,-4.632c0.163,-0.654 0.45,-1.623 0.755,-2.44c0.202,-0.54 0.407,-1.021 0.554,-1.352c0.038,-0.085 0.122,-0.139 0.215,-0.139c0.092,0 0.176,0.054 0.214,0.139c0.151,0.342 0.361,0.835 0.555,1.352c0.305,0.817 0.592,1.786 0.755,2.44c0.368,1.481 0.571,3.13 0.686,4.632c0.112,1.455 0.006,4.379 0.006,4.379l-4.432,0Z" style="fill:#002efc;"/><path d="M5.481,12.731c0,0 -0.073,-3.048 0.003,-4.22c0.06,-0.909 0.886,-3.522 1.293,-4.764c0.03,-0.098 0.121,-0.165 0.223,-0.165c0.103,0 0.193,0.067 0.224,0.164c0.406,1.243 1.232,3.856 1.292,4.765c0.076,1.172 0.003,4.22 0.003,4.22l-3.038,0Z" style="fill:#fff;fill-opacity:0.846008;"/>
  </svg>`);

  const MARKER_ICON_URL = `data:image/svg+xml;utf8,${MARKER}`;

  const BoatIcon = L.icon({
    iconUrl: MARKER_ICON_URL,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, 0],
  });

  const BoatIcon2 = L.DivIcon({
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, 0],
  });

  const markers = [];

  const updateIconStyle = () => {
    for (const marker of markers) {
      if (marker._icon) {
        const heading = marker._icon.getAttribute('data-heading');
        if (marker._icon.style.transform.indexOf('rotateZ') === -1) {
          marker._icon.style.transform = `${marker._icon.style.transform} rotateZ(${(heading || 0)}deg)`;
        }
      }
    }
  };

  fetch('https://api.windy.com/api/boats')
    .then(response => response.json())
    .then(result => result.result)
    .then(result => {
      try {
        let hue = 0;
        for (const boatName of Object.keys(result)) {
          hue = (hue + 60) % 360;

          const boat = result[boatName];

          const layer = L.polyline(boat.track, {
            color: `hsl(${hue}, 100%, 45%)`,
            weight: 2,
          }).addTo(W.maps);

          layer.on('mouseover', function (e) {
            layer.setStyle({
              weight: 4,
            });
          });

          layer.on('mouseout', function (e) {
            layer.setStyle({
              weight: 2,
            });
          });

          const marker = L.marker(boat.track[boat.track.length - 1], {
            icon: BoatIcon,
          }).addTo(W.maps);
          console.log(W);

          W.maps.on('zoom', updateIconStyle);
          W.maps.on('zoomend', updateIconStyle);
          W.maps.on('viewreset', updateIconStyle);
        
          W.maps.setView([20.981956742832327, -14.65576171875], 5);
        
        
          var overlay = W.store.get('overlay')
          // 'wind' ... actually used overlay
        
        var allowedOverlays = W.store.getAllowed('overlay')
          // ['wind', 'rain', ... ] ... list of allowed values
        
        W.store.set('overlay','waves')
        W.store.set('favOverlays',['wind', 'waves'])        


         
          markers.push(marker);
          marker._icon.setAttribute('data-heading', boat.heading);
          marker.bindPopup(boatName);

          updateIconStyle();
          
        }
      } catch (error) {
        console.error(`Error querying boats: ${error.message}`);
      }
    })
    .catch(error => {
      console.error(`Error querying boats: ${error.message}`);
    });

  // Handle some events. We need to update the rotation of icons ideally each time
  // leaflet re-renders. them.
  
  
})();
