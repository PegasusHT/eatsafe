import { Typography, Card, CardContent } from '@material-ui/core';
import React from 'react';
import {Tilt} from 'react-tilt';
import { styled } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const hazardColors = {
    Low: '#00e676',
    Medium: '#fbc02d',
    High: '#f44336',
    none: '#b7b8b9'
};
const HazardBar = styled('div')(({ hazardLevel }) => ({
    height: '8px',
    backgroundColor: hazardColors[hazardLevel],
}));

export const RestaurantCard = ({ name, address, hazardLevel, distance }) => {
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
            <Card className=" h-40" style={{ border: "0.5px solid green" }}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {name}
                    </Typography>
                    <Typography color="textSecondary">
                        {address}
                    </Typography>
                    <HazardBar hazardLevel={hazardLevel} />
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                        <Typography variant="body2" color="textSecondary" style={{ marginRight: 8 }}>
                        {distance} km
                        </Typography>
                        <p className='pl-24 pr-1'> Details </p>
                        <ArrowForwardIcon />
                    </div>
                </CardContent>
            </Card>
        </Tilt>
        
    );
};

export default RestaurantCard;