import React, { Component } from 'react'
import Map  from './Map'
import { LocationSearchInput } from './LocationSearchInput'
import PropTypes from 'prop-types'

export class MapSearch extends Component {
  static propTypes = {
    address: PropTypes.string,
    getLocation: PropTypes.func,
    onLocationChange: PropTypes.func,
    latLng: PropTypes.object
  }

  render() {
    return (
      <div className="map-search">
        <Map latLng={this.props.latLng} />
        <LocationSearchInput 
          getLocation={this.props.getLocation} 
          onLocationChange={this.props.onLocationChange} 
          address={this.props.address}
        />
      </div>
    )
  }
}
 
