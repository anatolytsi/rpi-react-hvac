import RangeSlider from 'react-bootstrap-range-slider';
import Input from '../Input/Input';
import React, {useState} from 'react';

const FeedTemperature = ({temperatureFeed, setFeedTemperature}) => {
    const [value, setValue] = useState(temperatureFeed);
    const setNewValue = (value) => {
        if (value < 0 || value > 80) return;
        setValue(value);
        setFeedTemperature(value);
    }
    return (
        <div>
            <p>
                Температура подачи: {value} ºC
            </p>
            <RangeSlider
                value={+value}
                onChange={changeEvent => setValue(+changeEvent.target.value)}
                onAfterChange={changeEvent => setNewValue(+changeEvent.target.value)}
                min={0}
                max={80}
                size={'lg'}
                tooltipPlacement={'top'}
            />
            <Input value={value} setValue={setNewValue} step={5}/>
        </div>
    )
}

export default FeedTemperature;
