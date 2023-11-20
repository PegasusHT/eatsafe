import initRestaurants from '../../data/restaurants.json';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer } from '@react-google-maps/api';

function patchData(reports, restaurants) {
  let reportHashMap = new Map();
  reports.forEach(report => {
    if (!reportHashMap.has(report.TRACKINGNUMBER)) {
      reportHashMap.set(report.TRACKINGNUMBER, [report]);
    } else {
      reportHashMap.get(report.TRACKINGNUMBER).push(report);
    }
  });
  restaurants.forEach((restaurant) => {
    if (reportHashMap.has(restaurant.properties.TRACKINGNUMBER)) {
      restaurant.properties.reports = reportHashMap.get(restaurant.properties.TRACKINGNUMBER);
    }
  });
  return restaurants;
}

const center = {
  lat: 49.10635000,
  lng: -122.82509000
};

const containerStyle = {
  margin: '2vh',
  width: '90vw',
  height: '60vh'
};

export const MapView = () => {
  // eslint-disable-next-line
  const [totalRestaurants, setTotalRestaurants] = useState([]);
  const [reports, setReports] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  useEffect(() => {
    axios.get(process.env.PUBLIC_URL + '/data/fraser_health_restaurant_inspection_reports.csv')
      .then(response => {
        const parsedData = Papa.parse(response.data, { header: true });
        const reports = parsedData.data.map(row => ({
          TRACKINGNUMBER: row.TRACKINGNUMBER,
          INSPECTIONDATE: row.INSPECTIONDATE,
          INSPTYPE: row.INSPTYPE,
          NUMCRITICAL: row.NUMCRITICAL,
          NUMNONCRITICAL: row.NUMNONCRITICAL,
          VIOLLUMP: row.VIOLLUMP,
          HAZARDRATING: row.HAZARDRATING,
        }));

        setReports(reports);
      });
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      const patchedData = patchData(reports, initRestaurants.features);
      setTotalRestaurants(patchedData);
    }
  }, [reports]);

    const hazardColors = {
        Low: '#28AE89',
        Medium: '#fbc02d',
        High: '#f44336',
        none: '#b7b8b9'
    };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={11}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
        {clusterer => 
          totalRestaurants.map(restaurant => {
            return(
              <Marker
                key={restaurant.properties.TRACKINGNUMBER}
                position={{
                  lat: parseFloat(restaurant.properties.LATITUDE),
                  lng: parseFloat(restaurant.properties.LONGITUDE)
                }}
                clusterer={clusterer}
              />
            )
          })
        }
      </MarkerClusterer>
    </GoogleMap>
  ) : <></>
}

export default MapView;