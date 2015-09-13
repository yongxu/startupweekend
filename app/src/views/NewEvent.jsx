'use strict';

import React from 'react/addons';
import {
  Navigation, Link
} from 'react-router';
import muiThemeDecorator from '../utils/mui-theme-decorator';
import Colors from 'mui/styles/colors';
import TextField from 'mui/text-field';
import IconButton from 'mui/icon-button';
import FlatButton from 'mui/flat-button';
import FontIcon from 'mui/font-icon';
import Dialog from 'mui/dialog';
import Checkbox from 'mui/checkbox';
import Toggle from 'mui/toggle';

import ChooseLocation from '../components/ChooseLocation';
import DateTimePicker from '../components/DateTimePicker';
import EventImagePicker from '../components/EventImagePicker';

let NewEventSVG = require('svgs/background/newevent.svg');

let NewEvent = muiThemeDecorator(React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {};
  },

  styles: {},

  render: function() {
    let styles = this.styles;

    let titleAndDescription = (
      <div
        className='new-event__container'
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          alignItems: 'flex-end',
          minWidth: '280px',
          flexGrow: 1,
          order: -1,
        }}>
        <TextField
          floatingLabelText='Event Name'
          fullWidth={true}
          hintText='Give it a awesome name'
          ref='eventName'
          valueLink={this.linkState('eventName')}/>
        <div style={{
          fontSize: 16,
          marginBottom: 8,
          marginTop: 4,
          marginLeft: 'auto',
          width: '170px'
        }}>
          <Toggle label='Private Event' labelStyle={{
            color: Colors.blue400
          }} name='privateEvent'/>
        </div>
        <TextField
          floatingLabelText='Event Description'
          fullWidth={true}
          hintText="Be Cool and Clear"
          multiLine={true}
          ref='eventDescription'
          valueLink={this.linkState('eventDescription')}/>
      </div>
    );

    return (
      <div className="view--content new-event">
        <img className="new-event-svg-header" src={NewEventSVG}/>

        <div className='new-event__form'>
          <h6>Keep It Cool and Simple</h6>
          <div style={{
            display: 'flex',
            flexFlow: 'row wrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {titleAndDescription}
            <EventImagePicker
              style={{
                padding: 20,
                width: 200,
                height: 200,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              ref='eventImagePicker' />
          </div>
          <DateTimePicker ref='dateTimePicker'/>

          <ChooseLocation ref='location'/>

        </div>
      </div>
    );
  }
}));

export default NewEvent;
