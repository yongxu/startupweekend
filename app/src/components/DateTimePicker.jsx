'use strict';

import React from 'react';
import Colors from 'mui/styles/colors';
import TextField from 'mui/text-field';
import IconButton from 'mui/icon-button';
import FlatButton from 'mui/flat-button';
import FontIcon from 'mui/font-icon';
import Dialog from 'mui/dialog';
import Checkbox from 'mui/checkbox';

let DateTimePicker = React.createClass({

    getInitialState() {
        return {
            eventName:'',
            eventDescription:'',
            eventTimes: [
                {
                    type: 'start',
                    text: '',
                    label: 'Event will start at',
                    hint: 'type something like: tonight 5pm',
                    enabled: true,
                },
                {
                    type: 'end',
                    text: '',
                    label: 'Event will end at',
                    hint: 'time helps people to plan ahead',
                    enabled: false,
                },
                {
                    type: 'end_join',
                    text: '',
                    label: 'Joining this event not allowed after this time',
                    hint: 'when to stop letting people join the event',
                    enabled: false,
                },
                {
                    type: 'close',
                    text: '',
                    label: "Don't be late, we close at",
                    hint: 'when to stop letting attendees in',
                    enabled: false,
                },
            ],
        };
    },

    updateEventTime(type,text){
        let index = _.findIndex(this.state.eventTimes, 'type', type);
        this.state.eventTimes[index].text=text;
        this.forceUpdate();
    },

    styles:{
        flatButtonIcon: {
            height: '100%',
            display: 'inline-block',
            verticalAlign: 'middle',
            float: 'right',
            paddingRight: '8px',
            lineHeight: '32px',
            color: Colors.blue400
        },
        labelStyle: {
            padding: '0 4px',
        },
    },

    render: function() {
        let styles = this.styles;

        let eventTimeList = this.state.eventTimes.map((eventTime)=>{
            return (eventTime.enabled ? <TextField
                        key={eventTime.type}
                        floatingLabelText={eventTime.label}
                        fullWidth={true}
                        value={eventTime.text}
                        onChange={(e)=>this.updateEventTime(eventTime.type,e.target.value)}
                        hintText={eventTime.hint} /> : null);
        });

        return (
            <div className='new-event__timepicker' >
                <h6>Schedule Time and Dates</h6>
                {eventTimeList}
                <div className='new-event__timepicker_button'>
                    <div className="layout-spacer"/>
                    <FlatButton secondary={true}
                                labelStyle={styles.labelStyle}
                                onTouchTap={()=>this.refs.timeOptionDialog.show()}
                                label="More Schedule Options">
                        <FontIcon style={styles.flatButtonIcon} className="material-icons">add</FontIcon>
                    </FlatButton>
                    {this._createTimeOptionDialog()}
                </div>
            </div>
        );
    },


    _createTimeOptionDialog(){

        let actions = [
          <FlatButton
            key={1}
            label="Cancel"
            secondary={true}
            onTouchTap={()=>this.refs.timeOptionDialog.dismiss()} />,
          <FlatButton
            key={2}
            label="Save"
            primary={true}
            onTouchTap={saveOptions.bind(this)} />
        ];

        let timeList=this.state.eventTimes;


        return (
            <Dialog
              ref="timeOptionDialog"
              title="Add or Remove Event Time"
              actions={actions}
              modal={false}>
              Choose more time options:

              <Checkbox
                ref='timeStart'
                name="Starting time"
                value="start"
                label="Starting time"
                disabled={true}
                defaultChecked={timeList[0].enabled} />
              <Checkbox
                ref='timeEnd'
                name="end"
                label="End time"
                defaultChecked={timeList[1].enabled} />
              <Checkbox
                ref='timeEndJoin'
                name="end_join"
                label="End join"
                defaultChecked={timeList[2].enabled} />
              <Checkbox
                ref='timeClose'
                name="close"
                label="Close"
                defaultChecked={timeList[3].enabled} />

            </Dialog>
        );

        function saveOptions(){
            this.state.eventTimes[0].enabled=this.refs.timeStart.isChecked();
            this.state.eventTimes[1].enabled=this.refs.timeEnd.isChecked();
            this.state.eventTimes[2].enabled=this.refs.timeEndJoin.isChecked();
            this.state.eventTimes[3].enabled=this.refs.timeClose.isChecked();
            this.refs.timeOptionDialog.dismiss();
            this.forceUpdate();
        }
    },
});

export default DateTimePicker;
