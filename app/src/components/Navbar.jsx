'use strict';

import React from 'react';
import {
  History, State, Link
} from 'react-router';
import {
  SideNav, SideNavItem, SideNavHeader, SideNavDivider, SideNavSubheader
} from 'mui/side-nav';

import RaisedButton from 'mui/raised-button';
import Headroom from '../libs/headroom';

let Navbar = React.createClass({

  mixins: [
    History, State
  ],

  render() {

    let hideNavbar = this.props.hidden || this.history.isActive("/login");
    let hideNewEventBtn = this.history.isActive('/newevent');

    return (
      <div hidden={hideNavbar}>
        <Headroom >
          <div className="layout__header">
            <div className="layout__header-row">
              <div className="layout__drawer-button" onClick={this.menuToggle}>
                <i className="material-icons">menu</i>
              </div>
              <span className="navbar-mobile-title layout-title">REACTOR</span>
              {hideNewEventBtn
                ? null
                :(<RaisedButton label="New Event" onTouchTap={() => this.history.pushState(null,"/newevent")} primary={true}/>)}
              <div className="layout-spacer"></div>

              <div className='navbar-link_container'>
                <Link className='navbar-link' to='/home'>Home</Link>
                <Link className='navbar-link' to='/events'>Events</Link>
                <Link className='navbar-link' to='/map'>Event Map</Link>
              </div>

              <div className="navbar-search-box">
                <i className="material-icons">search</i>
              </div>
            </div>
          </div>
        </Headroom>

        <SideNav openType='overlay' ref="sideNav">
          <SideNavHeader >
            <div className="navbar-menu__header">
              Reactor
            </div>
          </SideNavHeader>
          <SideNavItem active={this.history.isActive('/home')} onTouchTap={() => this.history.pushState(null,"/")} primaryText="Home"/>
          <SideNavItem active={this.history.isActive('/events')} onTouchTap={() => this.history.pushState(null,"/events")} primaryText="Events"/>
          <SideNavItem active={this.history.isActive('/map')} onTouchTap={() => this.history.pushState(null,"/map")} primaryText="Map"/>
          <SideNavDivider/>
          <SideNavSubheader>
            Resources
          </SideNavSubheader>
          <SideNavItem primaryText="GitHub"/>
          <SideNavItem href="http://facebook.github.io/react" primaryText="React"/>
          <SideNavItem href="https://www.google.com/design/spec/material-design/introduction.html" primaryText="Material Design"/>
        </SideNav>
      </div>
    );
  },

  menuToggle(e) {
    this.refs.sideNav.toggle();
  }
});

export default Navbar;
