'use strict';

import React from 'react';
import Paper from 'mui/paper';
import DropZone from '../libs/DropZone';
import Colors from 'mui/styles/colors';
import ImageEditor from './ImageEditor';
import FlatButton from 'mui/flat-button';

let EventImagePicker = React.createClass({

    getInitialState: function () {
      return {
        file: null
      };
    },

    onDrop: function (files) {
      if(files && files.length===1){
        this.setState({
          file: files[0]
        });
      }
    },

    preview: function () {
      let file = this.state.file;

      if (!file) {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `3px dashed ${Colors.deepPurple400}`,
              borderRadius: 15,
              cursor: 'pointer',
            }}>
            <p style={{
                padding: 10,
              }}>
              Drop your event image here, or click to select image to upload.
            </p>
          </div>
        );
      }else{
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexFlow: 'column-reverse nowrap',
              alignItems: 'center',
              boxShadow:
                `0 3px 10px ${Colors.deepPurple200},
                 0 3px 10px ${Colors.deepPurple200}`,
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              overflow: 'hidden',
              backgroundImage: `url(${file.preview})`,
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
              }}>
                <FlatButton
                  key={1}
                  label="Remove"
                  secondary={true}
                  backgroundColor='rgba(0,0,0,0.1)'
                  style={{
                    margin: '4px 4px',
                  }}
                  onTouchTap={(e)=>{
                    e.stopPropagation();
                    this.setState({
                      file: null
                    });
                  }} />
                <FlatButton
                  key={2}
                  label="Edit"
                  primary={true}
                  backgroundColor='rgba(0,0,0,0.1)'
                  style={{
                    margin: '4px 4px',
                  }}
                  onClick={(e)=>{
                    e.stopPropagation();
                  }}
                  onTouchTap={(e)=>{
                    e.stopPropagation();
                    console.log('TODO:should show image editor');
                  }} />
            </div>
          </div>
        );
      }
    },

    render() {
        var style = {
          margin: 0,
          padding: 0,
          transition: 'all 0.5s'
        };
        if (this.props.style){
          style = {
            ...style,
            ...this.props.style
          }
        }
        return (
            <DropZone
              multiple={false}
              onDrop={this.onDrop}
              style={style}>
                {this.preview()}
            </DropZone>
        );
    },
});

export default EventImagePicker;
