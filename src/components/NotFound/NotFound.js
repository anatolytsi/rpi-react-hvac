import React from 'react';

const NotFound = ({location}) => {
    return (
        <div className='d-flex align-items-center justify-content-center' style={{'height': '30em'}}>
            <h1 className='d-inline-block'>Page '{location.pathname}' not found</h1>
        </div>
    )
}

export default NotFound;
