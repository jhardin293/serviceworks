import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react';

import mapMarker from './images/map-marker.svg'

class MapMarker extends Component {
  render() {
    return(
      <div>
        <img src={mapMarker} alt="" />
      </div>
    )
  }
}

export default class Map extends Component {
  static defaultProps = {
    zoom: 11,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
        <div style={{ height: '100%', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDA4lSVtu-jB1h7VbTCTpSGf_Qv5UEuS6A'}}
            defaultZoom={this.props.zoom}
            center={[this.props.latLng.lat,this.props.latLng.lng]}
          >
            <MapMarker
              lat={this.props.latLng.lat}
              lng={this.props.latLng.lng}
            />

          </GoogleMapReact>
        </div>
    );
  }
}