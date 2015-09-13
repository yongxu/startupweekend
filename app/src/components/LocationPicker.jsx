'use strict';

import React from 'react';

let LocationPicker = React.createClass({

    getDefaultProps(){
        return {
            coords:{
                //UMN mall area
                lat: 44.974524,
                lng: -93.234656,
            },
            mapOnClick:()=>{},
            addressButtonClick:()=>{},
            locationUpdated: () => {},
        };
    },

    getInitialState(){
        return {
            currentLocations: null,
        };
    },

    componentDidMount(){
        this._createMap();
        this._initializeMap();
    },

    // shouldComponentUpdate(nextProps,nextState){
    //     console.log(nextState);
    //     return true;
    // },

    render() {
        let className = this.props.className ? this.props.className : null;
        return (
            <div className={className}>
                <div className='map' ref='map' />
            </div>
        );
    },

    bindWithSearchInput(searchInput){
        this.searchAutocomplete = new google.maps.places.Autocomplete(searchInput);

        google.maps.event.addListener(this.searchAutocomplete, 'place_changed', ()=>{

            let place = this.searchAutocomplete.getPlace();
            this.map.setZoom(16);
            this.setCenter(place.geometry.location);
            this.addMarker({draggable:true,coords:place.geometry.location});

            this.updateCurrentLocation([place], place.geometry.location, google.maps.GeocoderStatus.OK);
        });

        this.searchInput=searchInput;
    },

    addSearchBar(){

        let searchBoxInput = document.createElement('input');
        searchBoxInput.className = 'map__input';
        searchBoxInput.type = 'text';
        searchBoxInput.placeholder = 'Search Box';

        this.bindWithSearchInput(searchBoxInput);

        let searchBoxButton = document.createElement('button');
        searchBoxButton.className = 'map__search-button';
        searchBoxButton.innerHTML='USE THIS ADDRESS';
        searchBoxButton.addEventListener('click',()=>{
            this.props.addressButtonClick(searchBoxInput.value);
        });

        let searchBox = document.createElement('div');
        searchBox.className = 'map__search-box';
        searchBox.appendChild(searchBoxInput);
        searchBox.appendChild(searchBoxButton);

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBox);

    },

    searchBarUpdated(bestResult,results){
        this.searchInput.value = bestResult.formatted_address;
    },

    decodeGeolocation(address,callback){
        this.geocoder.geocode({'address': address}, callback);
    },

    updateCurrentLocation(results, coords, status){
        this.setState({currentLocations:Object.assign({},results)});
        this.searchBarUpdated(results[0],results);

        this.props.locationUpdated(results[0],results);
    },

    getLocation(){
        return this.state.currentLocations[0];
    },

    getLocations(){
        return this.state.currentLocations;
    },

    _createMap(){

        this.mapDiv=this.refs.map.getDOMNode();
        let mapOptions = {
            minZoom: 10,
            zoom: 14,
            draggableCursor: 'default',
            draggingCursor: 'default',
            //mapTypeControl: false,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            panControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
        }
        this.mapDiv.style.display = 'none';
        this.map = new google.maps.Map(this.mapDiv ,mapOptions);

        this.addSearchBar();

        this.geocoder = new google.maps.Geocoder();
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

        google.maps.event.trigger(this.map,'resize');

        google.maps.event.addListener(this.map, 'click', (e) => {
            if(!this.props.mapOnClick(e,this)){
                if(this.map.getZoom()<15){
                    this.map.setZoom(16);
                    this.setCenter(e.latLng);
                }
                this.geocoder.geocode({'location': e.latLng}, (results, status)=>{

                    if (status != google.maps.GeocoderStatus.OK)
                        return;
                    else{
                        this.updateCurrentLocation(results,e.latLng, status);
                    }
                });
                this.addMarker({draggable:true,coords:e.latLng});
            }
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

    addMarker(options={}){
        if(this.marker){
            this.marker.setMap(null);
        }

        this.marker = new google.maps.Marker({
            map:this.map,
            draggable: !!options.draggable,
            animation: google.maps.Animation.DROP,
            position: options.coords ? options.coords : this.coords
        });

        google.maps.event.addListener(this.marker,'position_changed',()=>{
            this.markerPositionChangedEvent();
        });
    },

    addMarkerListener(eventName,callback){
        google.maps.event.addListener(this.marker,eventName,callback);
    },

    markerPositionChangedEvent(){
        this.geocoder.geocode({'location': this.marker.getPosition()}, (results, status)=>{

            if (status != google.maps.GeocoderStatus.OK)
                return;
            else{
                this.updateCurrentLocation(results, this.marker.getPosition(), status);
            }
        });
    }
});

export default LocationPicker;
