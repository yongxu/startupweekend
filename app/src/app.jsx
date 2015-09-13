'use strict';

import './utils/init';
import './utils/globalInjection';

import 'styles/main.scss';
import React from 'react';

let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
//app.jsx
import {
  Router, Route, Redirect, Link
} from 'react-router';

/*material-ui*/
import muiTheme from './utils/theme';

import Navbar from './components/Navbar';

import Home from './views/Home';
import Login from './views/Login';
import Events from './views/Events';
import EventView from './views/EventView';
import MapView from './views/MapView';
import NewEvent from './views/NewEvent';
import Profile from './views/Profile';
import Page404 from './views/Page404';

class App extends React.Component {

  getChildContext() {
    return {
      muiTheme: muiTheme,
    }
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  render() {
    return (
      <div className="layout">
        <Navbar ref="navbar"/>
        <main className="app">
          {this.props.children}
        </main>
      </div>
    );
  }
}
function requireAuth(nextState, redirectTo) {
  if (!Parse.User.current())
    redirectTo('/login', null, {
      nextPathname: nextState.location.pathname
    });
}

let router = (
  <Router>
    <Route component={App}>
      <Route component={Home} name="home" path="/home"/>
      <Route component={Events} name="events" path="/events"/>
      <Route component={MapView} name="map" path="/map"/>
      <Route component={NewEvent} name="new_event" onEnter={requireAuth} path="/newevent"/>
      <Route component={EventView} name="event" path="/event/:eventId"/>
      <Route component={Profile} name="profile" path="/user/:username"/>
      <Route component={Page404} name="404" path="/404"/>

      <Route component={Login} name="login" path="/login"/>

      <Redirect from="/" to="/home"/>
      <Redirect from="*" to="/404"/>

    </Route>
  </Router>
);

React.render(router, document.body);
