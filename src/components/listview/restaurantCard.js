import { Typography, Card, CardContent } from '@material-ui/core';
import React from 'react';
import {Tilt} from 'react-tilt';
import { styled } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const hazardColors = {
    Low: '#28AE89',
    Medium: '#fbc02d',
    High: '#f44336',
    none: '#b7b8b9'
};
const HazardBar = styled('div')(({ hazardLevel }) => ({
    height: '8px',
    backgroundColor: hazardColors[hazardLevel],
}));

const hazardText = (hazardLevel) => {
    switch (hazardLevel){
        case "Low":
            return 'Clean :)';
        case "Medium":
            return 'Safe :]';
        case "High":
            return 'Dangerous :(';
        default:
            return 'No report !';
    }
    
}

export const RestaurantCard = ({ name, address, hazardLevel, distance, trackingNumber }) => {  
    const navigate = useNavigate();
    const hazardAlert= hazardText(hazardLevel);
    return (
        <Tilt
            options={{
            reverse: false,
            max: 8,
            perspective: 1000,
            scale: 1,
            speed: 300,
            transition: true,
            axis: null,
            reset: true,
            easing: 'cubic-bezier(.03,.98,.52,.99)',
            }}
        >
            <Card className=" h-45" 
             style={{ border: "0.5px solid green" }}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {name}
                    </Typography>
                    <Typography color="textSecondary">
                        {address}
                    </Typography>
                    <HazardBar hazardLevel={hazardLevel} />
                    
                    <p className='font-bold text-left' style={{ color: hazardColors[hazardLevel] }}> 
                        {hazardAlert}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                        <Typography variant="body2" color="textSecondary" style={{ marginRight: 8 }}>
                        {distance} km
                        </Typography>
                        <p className='pl-24 pr-1'> Details </p>
                        <ArrowForwardIcon  onClick={() => navigate(`/details/${trackingNumber}`)}/>
                    </div>
                </CardContent>
            </Card>
        </Tilt>
        
    );
};

export default RestaurantCard;