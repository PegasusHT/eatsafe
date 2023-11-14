import initRestaurants from '../../data/restaurants.json';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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
  lat: 49.189444,
  lng: -122.848306
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

  return (
    <>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          {/* Child components, such as markers, info windows, etc. */}
            {
              totalRestaurants.map(restaurant => {
                if (restaurant.properties.LATITUDE) {
                  return (
                    <Marker
                      key={restaurant.properties.TRACKINGNUMBER}
                      position={{
                        lat: parseFloat(restaurant.properties.LATITUDE),
                        lng: parseFloat(restaurant.properties.LONGITUDE)
                      }}
                    />
                  );
                }
                return null;
              })
            }
        </GoogleMap>
      </LoadScript>
    </>
  )
}

export default MapView;