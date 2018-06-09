import React, { Component } from 'react'
import Map  from '../../components/Map'

export class TeamMap extends Component {
  render() {
    return (
      <div className="map-view page-view">
        <div className="map">
          <Map latLng={{ lat: 37, lng: -122 }} />
        </div>
        <aside className="side-area">
          <div className="side-header">
            <h2>Customers</h2>
            <hr />
          </div>
          <div className="side-body">
            <div className="customer">
              <label><input type="checkbox" /><span>All Customers</span></label>
            </div>
            <div className="customer">
              <label><input type="checkbox" /><span>Jim Jones</span></label>
            </div>
            <div className="customer">
              <label><input type="checkbox" /><span>Lilly Mack</span></label>
            </div>
            <div className="customer">
              <label><input type="checkbox" /><span>Sammy Brown</span></label>
            </div>
            <button className="btn second-btn btn-success">Add Customer</button>
          </div>
        </aside>
      </div>
    )
  }
}
