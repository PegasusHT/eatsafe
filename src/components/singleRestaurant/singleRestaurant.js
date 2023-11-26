import React, { useEffect, useState } from 'react';
import initRestaurants from '../../data/restaurants.json';
import axios from 'axios';
import Papa from 'papaparse';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';

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

export const SingleRestaurant = () => {
    const params = useParams();
    const trackingNumber = params.trackingNumber;
   
    // eslint-disable-next-line
    const [totalRestaurants, setTotalRestaurants] = useState(initRestaurants.features);
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


    function setHazardRating (reports) {
        let HAZARDRATING = '';

        if(reports)
            HAZARDRATING=  Object.entries(reports)[0][1].HAZARDRATING;
        else
            HAZARDRATING="none"

        return HAZARDRATING
    }

    const HazardBar = styled('div')(({ hazardLevel }) => ({
        height: '8px',
        width: '40vw',
        backgroundColor: hazardColors[hazardLevel],
    }));

    const hazardColors = {
        Low: '#28AE89',
        Medium: '#fbc02d',
        High: '#f44336',
        none: '#b7b8b9'
    };

    return(
        <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
            {!loading && totalRestaurants.map((restaurant, index) => {
                const currReports = restaurant.properties.reports;
                if(restaurant.properties.TRACKINGNUMBER === trackingNumber) {
                    return (
                        <div key={index}>
                            <div className="font-bold text-xl mb-2">
                                {restaurant.properties.NAME}
                            </div>
                            <p className="text-gray-700 text-base">
                                <strong>Address: </strong> 
                                {restaurant.properties.PHYSICALADDRESS}
                            </p>
                            <HazardBar hazardLevel={Object.entries(currReports)[0][1].HAZARDRATING} />
                            <div className="overflow-auto h-40 mt-5">
                                <h2 className="font-bold text-lg mb-2">Inspection reports: </h2>
                                {restaurant.properties.reports.sort((a, b) => {
                                    return new Date(b.INSPECTIONDATE) - new Date(a.INSPECTIONDATE);
                                }).map((report, i) => (
                                    <div key={i}>
                                        <p><u>Date:</u> {report.INSPECTIONDATE}</p>
                                        <p><u>Critical Issues:</u> {report.NUMCRITICAL}</p>
                                        <p><u>Non-Critical Issues:</u> {report.NUMNONCRITICAL}</p>
                                        <hr/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
                return null;
            })}
        </div>
    )
}

export default SingleRestaurant
