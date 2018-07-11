import React, { Component } from 'react'
import MultiMarkerMap  from '../../components/MultiMarkerMap'
import { getCustomers } from '../../actions'
import { connect } from 'react-redux';

class TeamMapComp extends Component {
  componentWillMount() {
    this.props.getCustomers();
  }
  render() {
    const customers = this.props.customers;
    return (
      <div className="map-view page-view">
        <div className="map">
          <MultiMarkerMap latLng={{ lat: 37.8145218, lng: -122.2544248 }} items={customers} />
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


const mapNoteStateToProps = state => ({
  customers: state.customers.customers
});
export const TeamMap = connect(mapNoteStateToProps, {getCustomers})(TeamMapComp);

