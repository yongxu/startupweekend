'use strict';

import React from 'react';
import Map from '../components/Map'

let MapView = React.createClass({

    render() {
        return (
            <div className='view--content'
                 style={{height:10000}}>
                MapView Page
                <Map />
            </div>
        );
    }
});

export default MapView;
