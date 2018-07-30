import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import GoogleMapReact from 'google-map-react'
import capitalize from 'capitalize'

import Popover from 'react-popover'
import employeeMarker from './images/employee-map-marker.svg'
import customerMarker from './images/customer-map-marker.svg'

class MapMarker extends Component {
  static propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number
  }

  nameCompanyRender(item) {
    if (item.company) {
      return item.name + ' : ' + item.company;
    } else {
      return item.name
    }

  }

  markerRender(item) {
    let marker
    if (item.type === 'customer') {
      marker = customerMarker;
    }
    if (item.type === 'employee') {
      marker = employeeMarker;
    }

    return marker;
  }

  capitalizeText (text) {
    if(text) {
      return capitalize(text);
    }else {
      return '';
    }

  }

  editLink(item) {
    let path
    if (item.type === 'customer') {
      path = 'customers/edit-customer';
    }
    if (item.type === 'employee') {
      path = '/my-account/edit-employee';
    }

    return (
      <Link
        to={{
          pathname: path,
          state: { [item.type]: item }
        }} >
        Show details
        </Link>
    )
  }

  render() {
    const item = this.props.item;
    const content =
      <div className="details-popover ">
        <div className="popover-header">
          <span>{this.capitalizeText(item.type)}</span>
        </div>
        <ul>
          <li>{this.nameCompanyRender(item)}</li>
          <li>{item.email}</li>
          <li>{item.phone}</li>
          <li>{this.editLink(item)}</li>
        </ul>
      </div>
    return (
      <div >
        {item.displayOnMap &&
          <Popover isOpen={item.showPopover} body={content} preferPlace='below' onClick={this.handleClick}>
            <img src={this.markerRender(item)} alt="" />
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
          onChildClick={(idx, person) => this.props.onMarkerClick(person.item)}
          onClick={this.props.onOutsideClick}
        >
          {Markers}
        </GoogleMapReact>
      </div>
    );
  }
}