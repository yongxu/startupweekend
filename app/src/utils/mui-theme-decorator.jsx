import React from 'react';
import muiTheme from './theme';

export default function(ComposedComponent) {
  return class extends React.Component {

    getChildContext() {
      return {
        muiTheme: muiTheme
      }
    }

    static childContextTypes = {
      muiTheme: React.PropTypes.object
    }

    constructor() {
      super();
    }

    render() {
      return <ComposedComponent {...this.props}/>;
    }
  };
}
