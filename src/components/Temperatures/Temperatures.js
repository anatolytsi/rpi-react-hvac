import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Temperatures = (
    {
        temperatureOutside,
        temperatureInside,
        temperatureHe1,
        temperatureHe2,
        temperatureHe3
    }) => {
    return (
        <div>
            <div>
                <p>
                    Температура на улице: {temperatureOutside} ºC
                </p>
                <p>
                    Температура в зале: {temperatureInside} ºC
                </p>
                <p>
                    Температура теплообменника 1: {temperatureHe1} ºC
                </p>
                <p>
                    Температура теплообменника 2: {temperatureHe2} ºC
                </p>
                <p>
                    Температура теплообменника 3: {temperatureHe3} ºC
                </p>
            </div>
        </div>
    )
}

export default Temperatures;
