import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form} from 'react-bootstrap';

const ValveActivatedState = ({number, states, updateValveActiveState, setValveActivated}) => {
    const [swValue, setSw] = useState(states[number - 1]);
    const updateState = async () => {
        await updateValveActiveState(number);
        setSw(states[number - 1]);
    }
    const onSwitchAction = () => {
        setValveActivated(number, swValue).then(updateState);
    };
    let name = `Вентиль ${number} активирован`;
    return (
        <Form>
            <Form.Switch
                onChange={updateState}
                onClick={onSwitchAction}
                id='custom-switch'
                label={name}
                checked={swValue}
            />
        </Form>
    )
}

export default Valve;