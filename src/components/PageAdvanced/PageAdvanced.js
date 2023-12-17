import React from 'react';
import '../../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Mode from '../Mode/Mode';
import Temperatures from '../Temperatures/Temperatures';
import FeedTemperature from "../FeedTemperature/FeedTemperature";
import ValveOpenedState from "../Valve/ValveOpenedState";
import ValveActivatedState from "../Valve/ValveActivatedState";
import Hysteresis from "../Hysteresis/Hysteresis";

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
        valveActiveStates,
        updateValveState,
        setValveActivated,
        updateValveActiveState,
        openValve,
        closeValve,
        mode,
        hysteresis,
        setHysteresis,
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
                <Hysteresis hysteresis={hysteresis} setHysteresis={setHysteresis}/>
                <ValveOpenedState number={1}
                                  states={valveStates}
                                  updateValveState={updateValveState}
                                  openValve={openValve}
                                  closeValve={closeValve}
                                  mode={mode}
                />
                <ValveOpenedState number={2}
                                  states={valveStates}
                                  updateValveState={updateValveState}
                                  openValve={openValve}
                                  closeValve={closeValve}
                                  mode={mode}
                />
                <ValveOpenedState number={3}
                                  states={valveStates}
                                  updateValveState={updateValveState}
                                  openValve={openValve}
                                  closeValve={closeValve}
                                  mode={mode}
                />
                <ValveOpenedState number={4}
                                  states={valveStates}
                                  updateValveState={updateValveState}
                                  openValve={openValve}
                                  closeValve={closeValve}
                                  mode={mode}
                />
                <ValveActivatedState number={1}
                                     states={valveActiveStates}
                                     updateValveActiveState={updateValveActiveState}
                                     setValveActivated={setValveActivated}
                />
                <ValveActivatedState number={2}
                                     states={valveActiveStates}
                                     updateValveActiveState={updateValveActiveState}
                                     setValveActivated={setValveActivated}
                />
                <ValveActivatedState number={3}
                                     states={valveActiveStates}
                                     updateValveActiveState={updateValveActiveState}
                                     setValveActivated={setValveActivated}
                />
                <ValveActivatedState number={4}
                                     states={valveActiveStates}
                                     updateValveActiveState={updateValveActiveState}
                                     setValveActivated={setValveActivated}
                />
            </header>
        </div>
    );
}

export default PageAdvanced;
