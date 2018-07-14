import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import GoogleMapReact from 'google-map-react';

import Popover from 'react-popover'
import mapMarker from './images/map-marker.svg'

class MapMarker extends Component {
  static propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number
  }


  render() {
    const item = this.props.item;
    const customer = item; //Temp
    const content =
      <div className="details-popover ">
        <div className="popover-header">
          <span>{'Customer'}</span>
        </div>
        <ul>
          <li>{item.name + ' : ' + item.company}</li>
          <li>{item.email}</li>
          <li>{item.phone}</li>
          <li>
            <Link 
              to={{
                pathname: "customers/edit-customer",
                state: {customer}
              }} >
              Show details
            </Link>
          </li>
        </ul>
      </div>
    return (
      <div >
        {item.displayOnMap &&
          <Popover isOpen={item.showPopover} body={content} preferPlace='below' onClick={this.handleClick}>
            <img src={mapMarker} alt="" />
          </Popover>
        }
      </div>
    )
  }
}

export default class MultMarkerMap extends Component {
  static propTypes = {
    zoom: PropTypes.number,
    items: PropTypes.array.isRequired
  }

  static defaultProps = {
    zoom: 11,
  };


  render() {
    const Markers = this.props.items.map((item, i) => {
      return (
        <MapMarker
          key={i}
          lat={item.latLng.lat}
          lng={item.latLng.lng}
          item={item}
        />
      )

    });
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDA4lSVtu-jB1h7VbTCTpSGf_Qv5UEuS6A' }}
          defaultZoom={this.props.zoom}
          center={[this.props.latLng.lat, this.props.latLng.lng]}
          onChildClick={this.props.onMarkerClick}
          onClick={this.props.onOutsideClick}
        >
          {Markers}
        </GoogleMapReact>
      </div>
    );
  }
}