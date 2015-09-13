'use strict';

import React from 'react';
import { Navigation, Link } from 'react-router';
import FSSControl from '../libs/FSSControl';


let Login = React.createClass({
  mixins: [ Navigation ],

  getInitialState() {
    return {
      error: false
    };
  },

	componentDidMount(){
		this.background = new FSSControl(React.findDOMNode(this.refs.background));
	},

	componentWillUnmount(){
		this.background.distory();
	},

  handleSubmit(event) {
    event.preventDefault();

    var email = React.findDOMNode(this.refs.email).value;
    var pass = React.findDOMNode(this.refs.pass).value;

    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true });

      var { location } = this.props;

      if (location.state && location.state.nextPathname) {
        this.replaceWith(location.state.nextPathname);
      } else {
        this.replaceWith('/home');
      }
    });
  },

	render: function() {
		return (
			<div>
				<div ref="background" style={{
					position: 'fixed',
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: -1000
				}}/>
				<div className="view--content cell cell--8-col">
					<form onSubmit={this.handleSubmit}>
					<label><input ref="email" placeholder="email" defaultValue="joe@example.com" /></label>
					<label><input ref="pass" placeholder="password" /></label> (hint: password1)<br />
					<button type="submit">login</button>
					{this.state.error && (
					  <p>Bad login information</p>
					)}
					</form>
				</div>
		</div>
		);
	}

});

export default Login;
