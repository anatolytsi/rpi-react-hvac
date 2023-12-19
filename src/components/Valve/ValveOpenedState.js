import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form} from 'react-bootstrap';

const ValveOpenedState = ({number, states, updateValveState, openValve, closeValve, mode}) => {
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
    let name = `Вентиль ${number} ${swValue ?'открыт' : 'закрыт'}`;
    return (
        <Form>
            <Form.Switch
                onChange={updateState}
                onClick={onSwitchAction}
                id='custom-switch'
                label={name}
                checked={swValue}
                disabled={mode !== 'manual'}
            />
        </Form>
    )
}

export default ValveOpenedState;