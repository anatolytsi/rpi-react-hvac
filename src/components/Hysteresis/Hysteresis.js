import Input from '../Input/Input';
import React, {useState} from 'react';

const Hysteresis = ({hysteresis, setHysteresis}) => {
    const [value, setValue] = useState(hysteresis);
    const setNewValue = (value) => {
        if (value < 0 || value > 10) return;
        setValue(value);
        setHysteresis(value);
    }
    return (
        <div>
            <p>
                Гистерезис: {value} ºC
            </p>
            <Input value={value} setValue={setNewValue} step={0.5}/>
        </div>
    )
}

export default Hysteresis;
