import initRestaurants from '../../data/restaurants.json';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer, InfoWindowF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import {Box, Flex} from '@chakra-ui/layout';

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
  marginLeft: '3vw',
  width: '90vw',
  height: '60vh'
};

export const MapView = () => {
  // eslint-disable-next-line
  const [totalRestaurants, setTotalRestaurants] = useState([]);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");  

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

  const [activeMarker, setActiveMarker] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredRestaurants = totalRestaurants
  .filter((restaurant) => {
    return restaurant.properties.NAME.toLowerCase().includes(search.toLowerCase());
  })

  const handleRestaurantClick = (restaurant) => {
    map.panTo({
      lat: parseFloat(restaurant.properties.LATITUDE), 
      lng: parseFloat(restaurant.properties.LONGITUDE)
    });
    map.setZoom(18);
    setActiveMarker(restaurant);
    setIsOpen(true);
  }; 

  return isLoaded ? (
    <Flex 
      position='relative'
      flexDirection='column'
      alignItems='center'
    >
      <Box
        mt={'3vh'}
        mr={'40vw'}
        bgColor='white'
        zIndex='1'
      >
        <div className='mx-2 my-2'>
          <input 
            type="search" className="w-full"
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder=" Search for a restaurant"
          />
          <div style={{ maxHeight: '7vh', overflowY: 'scroll'}}
            className="w-96">
            {search !== "" && filteredRestaurants.map((restaurant, index) => (
              <div key={index}>
                  <button onClick={() => handleRestaurantClick(restaurant)}>{restaurant.properties.NAME} </button>
              </div>
            ))}
          </div>
        </div>
      </Box>
     
      <Box position='absolute' left={'2vw'} top={20} h='100%' w='100%'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
          <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
            {clusterer => 
              totalRestaurants.map(restaurant => {
                const {TRACKINGNUMBER, LATITUDE, LONGITUDE, NAME, PHYSICALADDRESS, reports} = restaurant.properties;
                let hazardRating;
                if(reports)
                  hazardRating=  Object.entries(reports)[0][1].HAZARDRATING;
                else
                  hazardRating="none"
                
                return(
                  <Marker
                    key={TRACKINGNUMBER}
                    position={{
                      lat: parseFloat(LATITUDE),
                      lng: parseFloat(LONGITUDE)
                    }}
                    clusterer={clusterer}
                    onClick={() => {
                      setActiveMarker(restaurant);
                      setIsOpen(true);
                    }}
                  >
                    {isOpen && activeMarker === restaurant && (
                      <InfoWindowF 
                        onCloseClick={() => setIsOpen(false)}
                      >
                        <div>
                        <h2 
                          className="cursor-pointer underline font-bold"
                          onClick={() => navigate(`/details/${TRACKINGNUMBER}`)}
                        >
                          {NAME}
                        </h2>
                          <p>Address: {PHYSICALADDRESS}</p>
                          <p className='font-bold text-left'> 
                            Hazard Rating: {hazardRating} </p>
                        </div>
                      </InfoWindowF>
                    )}
                  </Marker>
                )
              })
            }
          </MarkerClusterer>
        </GoogleMap>
      </Box>
     
    </Flex>
    
  ) : <></>
}

export default MapView;