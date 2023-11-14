import React, { useEffect, useState } from 'react';
import initRestaurants from '../../data/restaurants.json';
import InfiniteScroll from 'react-infinite-scroll-component';
import RestaurantCard from './restaurantCard';
import axios from 'axios';
import Papa from 'papaparse';

// function patchData(reports, restaurants) {
//     restaurants.forEach(restaurant => {
//       restaurant.reports = reports.filter(report => report.trackingNumber === restaurant.trackingNumber);
//     });
//     return restaurants;
// }

function patchData(reports, restaurants) {
    let reportHashMap= new Map();
    reports.forEach(report => {
        if(!reportHashMap.has(report.TRACKINGNUMBER)){
            reportHashMap.set(report.TRACKINGNUMBER, [report]);
        } else {
            reportHashMap.get(report.TRACKINGNUMBER).push(report);
        }
    });
    restaurants.forEach((restaurant) => {
        if(reportHashMap.has(restaurant.properties.TRACKINGNUMBER)){
            restaurant.properties.reports = reportHashMap.get(restaurant.properties.TRACKINGNUMBER);
        }
    });
    return restaurants;
}

export const ListView = () => {
    // eslint-disable-next-line
    const [totalRestaurants, setTotalRestaurants] = useState(initRestaurants.features);
    const [visibleRes, setVisibleRes] = useState(totalRestaurants.slice(0,20));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true)

    const [reports, setReports] = useState([])

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
        if(reports.length>0){
            const patchedData = patchData(reports, totalRestaurants);
            setTotalRestaurants(patchedData);
            setLoading(false);
        }
    }, [reports, totalRestaurants]);

    const fetchMoreData = () => {
        const nextRestaurants = fetchNextRestaurants();
        if (nextRestaurants.length === 0) {
            setHasMore(false);
            return;
        }
        setVisibleRes(restaurants =>
            [...restaurants, ...nextRestaurants]);
    };

    const fetchNextRestaurants = () => {
        const nextRestaurants = totalRestaurants.slice(
            visibleRes.length,
            visibleRes.length + 20
        );
        return nextRestaurants;
    };

    function setHazardRating (reports) {
        let HAZARDRATING = '';

        if(reports)
            HAZARDRATING=  Object.entries(reports)[0][1].HAZARDRATING;
        else
            HAZARDRATING="none"

        return HAZARDRATING
    }

    return(
        <>
            {loading?(
                <p>Loading data ... </p>
            ):(
                <InfiniteScroll
                    className='p-4'
                    dataLength={visibleRes.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    endMessage={<p>End of List</p>}
                >   
                    <div className="flex flex-wrap justify-center">
                        {visibleRes.map((restaurant) => {
                            // eslint-disable-next-line
                            const { TRACKINGNUMBER, NAME, PHYSICALADDRESS, LATITUDE, LONGITUDE, reports }
                                = restaurant.properties;
                            
                            let HAZARDRATING = setHazardRating(reports)
                            const distanceDefault = '175m';
                            return (
                                <div className="w-full sm:w-1/2 md:w-1/3 p-2">
                                    <RestaurantCard
                                    name={NAME}  
                                    trackingNumber={TRACKINGNUMBER}
                                    address={PHYSICALADDRESS}
                                    hazardLevel={HAZARDRATING}
                                    distance={distanceDefault}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </InfiniteScroll>
            )}
        </>
    )
}

export default ListView