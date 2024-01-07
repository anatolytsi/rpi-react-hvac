import RangeSlider from 'react-bootstrap-range-slider';
import Input from '../Input/Input';
import React, {useState} from 'react';

const UpdateInterval = ({updateInterval, setUpdateInterval}) => {
    const [value, setValue] = useState(updateInterval);
    const setNewValue = (value) => {
        if (value <= 0 || value > 30) return;
        let newInterval = value;
        setValue(newInterval);
        setUpdateInterval(newInterval);
    }
    return (
        <div>
            <p>
                Частота обновления: {value} с
            </p>
            <RangeSlider
                value={+value}
                onChange={changeEvent => setValue(+changeEvent.target.value)}
                onAfterChange={changeEvent => setNewValue(+changeEvent.target.value)}
                min={0.5}
                max={30}
                step={.5}
                size={'lg'}
                tooltipPlacement={'top'}
            />
            <Input value={value} setValue={setNewValue} step={.5}/>
        </div>
    )
}

export default UpdateInterval;
