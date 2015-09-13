'use strict';

import React from 'react';
import { Navigation, Link } from 'react-router';
import muiThemeDecorator from '../utils/mui-theme-decorator';


let Home = muiThemeDecorator(React.createClass({

    render: function() {
        return (
            <div className="view--content cell cell--8-col">
            	Home
            </div>
        );
    }

}));

export default Home;
