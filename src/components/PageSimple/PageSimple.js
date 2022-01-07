import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css'

import Temperatures from '../Temperatures/Temperatures';
import FeedTemperature from '../FeedTemperature/FeedTemperature';

const PageSimple = (
    {
        temperatureFeed,
        temperatureOutside,
        temperatureInside,
        setFeedTemperature,
        temperatureHe1,
        temperatureHe2,
        temperatureHe3
    }) => {
    return (
        <div className='MainPage'>
            <h1>Простая панель</h1>
            <header className='MainPage-header'>
                <FeedTemperature temperatureFeed={temperatureFeed}
                                 setFeedTemperature={setFeedTemperature}
                />
                <Temperatures temperatureOutside={temperatureOutside}
                              temperatureInside={temperatureInside}
                              temperatureHe1={temperatureHe1}
                              temperatureHe2={temperatureHe2}
                              temperatureHe3={temperatureHe3}
                />
            </header>
        </div>
    );
}

export default PageSimple;
