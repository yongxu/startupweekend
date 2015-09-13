'use strict';

import React from 'react';
import $ from 'jquery';
import 'cropper';
import 'cropper/dist/cropper.css';

let ImageEditor = React.createClass({

  getDefaultProps() {
    return {
      src: null
    };
  },

  componentDidMount() {
    let {
      src,
      alt,
      style,
      ...options,
    } = this.props;

    this.$img = $(React.findDOMNode(this.refs.img));
    this.$img.cropper(options);
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.src !== this.props.src){
      this.replace(nextProps.src);
    }
    if(nextProps.aspectRatio !== this.props.aspectRatio){
      this.setAspectRatio(nextProps.aspectRatio);
    }
  },

  componentWillUnmount() {
    if(this.$img) {
      this.$img.cropper('destroy');
      delete this.$img;
    }
  },

  render() {
      return (
        <div {...this.props}>
          <img
            ref='img'
            src={this.props.src}
            alt={this.props.alt === undefined ? 'picture' : this.props.alt}
            />
        </div>
      );
  }
});

export default ImageEditor;
