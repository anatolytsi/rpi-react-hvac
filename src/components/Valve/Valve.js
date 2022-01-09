import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form} from 'react-bootstrap';

const Valve = ({number, states, updateValveState, openValve, closeValve, mode}) => {
    const [swValue, setSw] = useState(states[number - 1]);
    const updateState = async () => {
        await updateValveState(number);
        setSw(states[number - 1]);
    }
    const onSwitchAction = () => {
        if (swValue) {
            closeValve(number).then(updateState);
        } else {
            openValve(number).then(updateState);
        }
    };
    let name = `Вентиль ${number}`;
    return (
        <Form>
            <Form.Switch
                onClick={onSwitchAction}
                id='custom-switch'
                label={name}
                checked={swValue}
                disabled={mode !== 'manual'}
            />
        </Form>
    )
}

export default Valve;