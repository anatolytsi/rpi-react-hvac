import {Form} from 'react-bootstrap';
import React from 'react';

const Mode = ({mode, setMode}) => {
    return (
        <Form.Group className='m-0'>
            <Form.Label>Режим работы:</Form.Label>
            <Form.Control
                as='select'
                custom
                value={mode}
                onChange={event => setMode(event.target.value)}
            >
                <option value='autoWinter'>Авто (Лето)</option>
                <option value='autoSummer'>Авто (Зима)</option>
                <option value='manual'>Ручной</option>
            </Form.Control>
        </Form.Group>
    )
}

export default Mode;
