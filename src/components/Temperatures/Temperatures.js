import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Temperatures = ({temperatureOutside, temperatureInside}) => {
    return (
        <div>
            <div>
                <p>
                    Температура на улице: {temperatureOutside} ºC
                </p>
                <p>
                    Температура в зале: {temperatureInside} ºC
                </p>
            </div>
        </div>
    )
}

export default Temperatures;
