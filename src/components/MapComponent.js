import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./MapComponent.css";

mapboxgl.accessToken = 'pk.eyJ1IjoiemxlZTAzOSIsImEiOiJjbHR5Y2w1YjIwYnQ2MmxtNjd1dXd3OHJjIn0.jJtK07Xl3kblzwIxWKuwaA';

const MapComponent = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-0.561513, 51.425703],
      zoom: 14
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default MapComponent;
