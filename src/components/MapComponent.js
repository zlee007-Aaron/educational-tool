import React, { useRef, useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./MapComponent.css";

mapboxgl.accessToken = 'pk.eyJ1IjoiemxlZTAzOSIsImEiOiJjbHR5Y2w1YjIwYnQ2MmxtNjd1dXd3OHJjIn0.jJtK07Xl3kblzwIxWKuwaA';

const MapComponent = (props) => {
  const mapContainerRef = useRef(null);
  const firstMarker = useRef(null);
  const secondMarker = useRef(null);

  const OfficeMarker = useRef(null);
  const TravelDistanceMarker = useRef(null);

  const transportList = useRef([]);

  var turn = 0;
  
  const [isLoading, setIsLoading] = useState(false);

  const AddMode = useRef(false);
  const IsInSetOfficeMode = useRef(false);


  useEffect(() => {
    IsInSetOfficeMode.current = props.isInSetOfficeMode;
  }, [props.isInSetOfficeMode])

  useEffect(() => {
    transportList.current = props.TransportList;
  }, [props.TransportList])

  useEffect(() => {
    AddMode.current = props.isInAddMode;
  }, [props.isInAddMode])

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

    OfficeMarker.current = new mapboxgl.Marker({color:'red'}).setLngLat([-0.561513, 51.425703]).addTo(map);
    TravelDistanceMarker.current = new mapboxgl.Marker();

    map.on('click', add_marker);

    function add_marker(event) {
      if(IsInSetOfficeMode.current){
        OfficeMarker.current.setLngLat(event.lngLat).addTo(map);

        if(transportList.current.length > 0){
          //FetchForAll();
          //TODO kinda works
        }

      }

      if(AddMode.current && props.Selecttwolocations){
        if (turn == 0) {
          firstMarker.current.setLngLat(event.lngLat).addTo(map);
        } else {
          secondMarker.current.setLngLat(event.lngLat).addTo(map);
        }
        if(firstMarker.current && secondMarker.current){
          getRoute(firstMarker.current._lngLat, secondMarker.current._lngLat);
        }
       
        turn += 1;
        turn %= 2;
      }

      if(AddMode.current){
        TravelDistanceMarker.current.setLngLat(event.lngLat).addTo(map);
        if(OfficeMarker.current._lngLat && TravelDistanceMarker.current._lngLat){
          getRoute(OfficeMarker.current, TravelDistanceMarker.current).then( (MapRoute) => {
            if(MapRoute){
              props.setMapDirections({Distance: MapRoute.routes[0].distance, Duration: MapRoute.routes[0].duration, MapMarkerOrigin: OfficeMarker.current._lngLat, MapMarkerLocation: TravelDistanceMarker.current._lngLat});
            }
          });
        }
      }
    }

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");


    // async function FetchForAll(){
    //   for (let i = 0; i < transportList.current.length; i++) {
    //     let data = await getRoute(OfficeMarker.current, new mapboxgl.Marker().setLngLat(transportList.current[i].Destination), false);
    //     transportList.current[i].Duration = data.routes[0].duration;
    //     transportList.current[i].Distance = data.routes[0].distance;
    //   }
    //   //console.log(transportList.current);
    //   props.SetTransportList(transportList.current);
    // }

    // create a function to make a directions request
    async function getRoute(Marker1, Marker2, DrawRoute = true) {
      //if (!initialized) return;
      console.log(Marker1);
      console.log(Marker2);
      setIsLoading(true);
      let query;
      let json;
      try{
        query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${Marker1._lngLat.lng},${Marker1._lngLat.lat};${Marker2._lngLat.lng},${Marker2._lngLat.lat}?alternatives=true&geometries=geojson&language=en&overview=full&steps=false&access_token=${mapboxgl.accessToken}`,
          { method: 'GET' }
        );
        json = await query.json();

        //console.log(json);
        if(DrawRoute){
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
        }

      } catch {
        console.log('Too far')
        return;
      };
      

      setIsLoading(false);
      return json;
      // add turn instructions here at the end
    }
  }, []);


  return (
    <div className='map-container' ref={mapContainerRef}>
      <PropagateLoader 
        color={'#2ecc71'}
        loading={isLoading}
        size={25}
        cssOverride={{top: '50%'}}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default MapComponent;
