import React from 'react';
import './Input.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Input = ({value, setValue}) => {
    return (
        <div className='def-number-input number-input' style={{display: 'inline-block'}}>
            <button onClick={() => setValue(+value - 5)} className='minus'></button>
            <input className='quantity' name='quantity' value={value}
                   onChange={(event) => setValue(event.target.value)}
                   type='number'/>
            <button onClick={() => setValue(+value + 5)} className='plus'></button>
        </div>
    );
}

export default Input;
