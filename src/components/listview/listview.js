import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RestaurantCard from './restaurantCard';
import { useSelector } from 'react-redux';

export const ListView = () => {
    const totalRestaurants = useSelector((state) => state.totalRestaurants);
    const [visibleRes, setVisibleRes] = useState(totalRestaurants.slice(0,20));
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(totalRestaurants.length>0){
            setLoading(false);
        }
    }, [totalRestaurants]);

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