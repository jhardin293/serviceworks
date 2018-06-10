import React, { Component } from 'react'
import Map  from './Map'
import { LocationSearchInput } from './LocationSearchInput'

export class MapSearch extends Component {
  render() {
    return (
      <div className="map-search">
        <LocationSearchInput 
          getLocation={this.props.getLocation} 
          onLocationChange={this.props.onLocationChange} 
          address={this.props.address}
        />
        <Map latLng={this.props.latLng} />
      </div>
    )
  }
}
 
