import React from 'react';
import '../../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Mode from '../Mode/Mode';
import Temperatures from '../Temperatures/Temperatures';
import FeedTemperature from "../FeedTemperature/FeedTemperature";

const PageAdvanced = ({temperatureFeed, temperatureOutside, temperatureInside, setFeedTemperature}) => {
    return (
        <div className='MainPage'>
            <h1>Расширенная панель</h1>
            <header className='MainPage-header'>
                <FeedTemperature temperatureFeed={temperatureFeed}
                                 setFeedTemperature={setFeedTemperature}
                />
                <Temperatures temperatureOutside={temperatureOutside}
                              temperatureInside={temperatureInside}
                />
                <Mode/>
            </header>
        </div>
    );
}

export default PageAdvanced;
