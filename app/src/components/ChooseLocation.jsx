'use strict';

import React from 'react';
import muiThemeDecorator from '../utils/mui-theme-decorator';
import Colors from 'mui/styles/colors';
import TextField from 'mui/text-field';
import FlatButton from 'mui/flat-button';
import SearchField from 'mui/search-field';

import LocationPicker from './LocationPicker';


let ChooseLocation = React.createClass({

    getDefaultProps() {
        return {
            locationType: 'none',
        }
    },

    getInitialState() {
        return {
            locationState: this.props.locationType,
        }
    },

    locationOptions:[
      'This is an Online Event',
      'Pick a Great Location using Map',
      'Fill Address Form',
      'umm... undecided yet',
    ],

    render() {
        let styles = {
        };
        let underlineTextColor = null;
        let underlineText = null;
        let hintText = 'Input your location here';
        let locationSettings = ()=>{
            switch(this.state.locationState){
                case 'picked':
                    return;
                case 'pickedOnMap':
                    underlineTextColor = Colors.green400;
                    underlineText = 'Valid Address'
                    return;
                case 'picking':
                    return (
                        <LocationPicker
                            className='picker' 
                            addressButtonClick={(address)=>{
                                this.refs.address.setValue(address);
                                this.setState({locationState:'pickedOnMap'});
                            }}/>
                        );
                case 'online':
                    underlineTextColor = Colors.deepPurple400;
                    underlineText = 'Your event will be hosted online'
                    hintText = 'Online(type here to reselect your option)'
                    return;
                case 'address_form':
                    return;
                case 'undecided':
                    return;
                case 'none':
                    return;
            }
        }();


        return (
            <div className='new-event__locationpicker'>
                <h6>
                    Location
                </h6>

                <SearchField ref='address'
                            fullWidth={true}
                            hintText={hintText}
                            errorStyle = {{color:underlineTextColor}}
                            errorText = {underlineText}
                            onUpdateRequests={(req)=>{
                                return this.locationOptions;
                            }}
                            onNewRequest={(req)=>{
                                switch(req){
                                    case this.locationOptions[0]:
                                        this.refs.address.setValue('');
                                        this.setState({locationState:'online'});
                                        break;
                                    case this.locationOptions[1]:
                                        this.setState({locationState:'picking'});
                                        break;
                                    case this.locationOptions[2]:
                                        this.setState({locationState:'address_form'});
                                        break;
                                    case this.locationOptions[3]:
                                        this.setState({locationState:'undecided'});
                                        break;
                                    default:
                                        if(!req){
                                            this.setState({locationState:'none'});
                                        }else{
                                            this.setState({
                                                locationState:'picked',
                                                address: req,
                                            });
                                        }
                                }
                            }}/>
                {locationSettings}
            </div>
        );
    }
});

export default ChooseLocation;
