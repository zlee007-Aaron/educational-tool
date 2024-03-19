import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./MapComponent.css";

mapboxgl.accessToken = 'pk.eyJ1IjoiemxlZTAzOSIsImEiOiJjbHR5Y2w1YjIwYnQ2MmxtNjd1dXd3OHJjIn0.jJtK07Xl3kblzwIxWKuwaA';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const firstMarker = useRef(null);
  const secondMarker = useRef(null);

  var turn = 0;
  var initialized = false;

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-0.561513, 51.425703],
      zoom: 14
    });

    firstMarker.current = new mapboxgl.Marker();
    secondMarker.current = new mapboxgl.Marker();
    map.on('click', add_marker);

    function add_marker(event) {
      if (turn == 0) {
        firstMarker.current.setLngLat(event.lngLat).addTo(map);
      } else {
        secondMarker.current.setLngLat(event.lngLat).addTo(map);
        initialized = true;
      }

      getRoute();
     
      turn += 1;
      turn %= 2;
    }

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // create a function to make a directions request
    async function getRoute() {
      if (!initialized) return;
      console.log(firstMarker.current);
      console.log(secondMarker.current);
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${firstMarker.current._lngLat.lng},${firstMarker.current._lngLat.lat};${secondMarker.current._lngLat.lng},${secondMarker.current._lngLat.lat}?alternatives=true&geometries=geojson&language=en&overview=full&steps=false&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      console.log(json);
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
      // add turn instructions here at the end
    }
  }, []);

  return (
    <div className='map-container' ref={mapContainerRef} />
  );
};

export default MapComponent;
