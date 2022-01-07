import React from 'react';
import '../../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Mode from '../Mode/Mode';
import Temperatures from '../Temperatures/Temperatures';
import FeedTemperature from "../FeedTemperature/FeedTemperature";
import Valve from "../Valve/Valve";

const PageAdvanced = (
    {
        temperatureFeed,
        temperatureOutside,
        temperatureInside,
        temperatureHe1,
        temperatureHe2,
        temperatureHe3,
        setFeedTemperature,
        valveStates,
        updateValveState,
        openValve,
        closeValve,
        mode,
        hysteresis,
        setMode
    }) => {
    return (
        <div className='MainPage'>
            <h1>Расширенная панель</h1>
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
                <Mode mode={mode} setMode={setMode}/>
                <Valve number={1}
                       states={valveStates}
                       updateValveState={updateValveState}
                       openValve={openValve}
                       closeValve={closeValve}
                />
                <Valve number={2}
                       states={valveStates}
                       updateValveState={updateValveState}
                       openValve={openValve}
                       closeValve={closeValve}
                />
                <Valve number={3}
                       states={valveStates}
                       updateValveState={updateValveState}
                       openValve={openValve}
                       closeValve={closeValve}
                />
                <Valve number={4}
                       states={valveStates}
                       updateValveState={updateValveState}
                       openValve={openValve}
                       closeValve={closeValve}
                />
            </header>
        </div>
    );
}

export default PageAdvanced;
