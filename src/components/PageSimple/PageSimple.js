import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css'

import Temperatures from '../Temperatures/Temperatures';
import FeedTemperature from '../FeedTemperature/FeedTemperature';

const PageSimple = ({temperatureFeed, temperatureOutside, temperatureInside, setFeedTemperature}) => {
    return (
        <div className='MainPage'>
            <h1>Простая панель</h1>
            <header className='MainPage-header'>
                <FeedTemperature temperatureFeed={temperatureFeed}
                                 setFeedTemperature={setFeedTemperature}
                />
                <Temperatures temperatureOutside={temperatureOutside}
                              temperatureInside={temperatureInside}
                />
            </header>
        </div>
    );
}

export default PageSimple;
