'use strict';

import React from 'react';

let Map = React.createClass({

    shouldComponentUpdate(nextProps,nextState){
        return false;
    },

    getDefaultProps(){
        return {
            coords:{
                //UMN mall area
                lat: 44.974524,
                lng: -93.234656,
            },
            mapOnClick:()=>{},
        }
    },
    componentDidMount(){
        this._createMap();
        this._initializeMap();
    },

    render() {
        return (
            <div className='map' ref='map' />
        );
    },
    _createMap(){

        this.mapDiv=this.refs.map.getDOMNode();
        let mapOptions = {
            minZoom: 10,
            zoom: 14,
            draggableCursor: 'default',
            draggingCursor: 'default',
            mapTypeControl: false,
            panControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
        }
        this.mapDiv.style.display = 'none';
        this.map = new google.maps.Map(this.mapDiv ,mapOptions);

        var searchBox = document.createElement('input');
        searchBox.className = 'map__input map__search-box';
        searchBox.type = 'text';
        searchBox.placeholder = 'Search Box';
        this.searchBoxInput=searchBox;
        this.searchBox = new google.maps.places.SearchBox(searchBox);

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBox);

        this.marker={};
    },
    async _initializeMap(){
        this.coords = await (new Promise(function(resolve, reject) {
            if(this.props.coords){
                resolve(this.props.coords);
            }
            else{
                if(navigator.geolocation)
                    navigator.geolocation.getCurrentPosition(function(position) {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy : position.coords.accuracy,
                        });
                    });
                else
                    resolve(this.props.coords);
            }
          }.bind(this)));
        this.map.setCenter(this.coords);
        this.mapDiv.style.display = 'block';

        google.maps.event.addListener(this.map, 'click', (e) => {
            console.log(e);
            this.props.mapOnClick.bind(this)(e);
            this.addMarker('address',{draggable:true,coords:e.latLng});
            e.stop();
        });
    },
    setCenter(coords){
        this.coords=coords;
        this.map.setCenter(coords);
    },
    addMapListener(eventName,callback){
        google.maps.event.addListener(this.map,eventName,callback);
    },
    addMarker(id,options={}){
        if(this.marker[id]){
            this.marker[id].setMap(null);
        }

        this.marker[id] = new google.maps.Marker({
            map:this.map,
            draggable: !!options.draggable,
            animation: google.maps.Animation.DROP,
            position: options.coords ? options.coords : this.coords
        });

    },
    addMarkerListener(id,eventName,callback){
        google.maps.event.addListener(this.marker[id],eventName,callback);
    },

    removeMarker(id){
        if(this.marker[id]){
            this.marker[id].setMap(null);
        }
        this.marker[id]=null;
    },

});

export default Map;
