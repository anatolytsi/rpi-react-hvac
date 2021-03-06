import React from 'react';
import './Input.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Input = ({value, setValue, step}) => {
    return (
        <div className='def-number-input number-input' style={{display: 'inline-block'}}>
            <button onClick={() => setValue(+value - step)} className='minus'></button>
            <input className='quantity' name='quantity' value={value}
                   onChange={(event) => setValue(event.target.value)}
                   type='number'/>
            <button onClick={() => setValue(+value + step)} className='plus'></button>
        </div>
    );
}

export default Input;
