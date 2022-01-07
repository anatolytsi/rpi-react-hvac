import {Form} from 'react-bootstrap';
import React from 'react';

const Mode = () => {
    return (

        <Form.Group className='m-0'>
            <Form.Label>Режим работы:</Form.Label>
            <Form.Control
                as='select'
                custom
                // onChange={this.onChangeColor.bind(this)}
            >
                <option value='auto'>Авто</option>
                <option value='manual'>Ручной</option>
            </Form.Control>
        </Form.Group>
        // <div className='container'>
        //     <div className='row justify-content-center'>
        //         <div className='col-3'>
        //             <p>
        //                 Режим работы:
        //             </p>
        //         </div>
        //         <div className='col-2'>
        //             <Form.Group className='m-0'>
        //                 <Form.Control
        //                     as='select'
        //                     custom
        //                     // onChange={this.onChangeColor.bind(this)}
        //                 >
        //                     <option value='auto'>Авто</option>
        //                     <option value='manual'>Ручной</option>
        //                 </Form.Control>
        //             </Form.Group>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Mode;
