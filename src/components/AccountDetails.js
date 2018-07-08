import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Link } from 'react-router-dom'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { LocationSearchInput } from '../components/LocationSearchInput'
import Map from '../components/Map'

import threeDots from '../images/three-dots.png'
import plus from '../images/plus.svg'

export class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: {
        displayName: props.account.displayName || '',
        company: props.account.company || '',
        email: props.account.email || '',
        phoneNumber: props.account.phoneNumber || '',
        address: props.account.address || '',
        latLng: props.account.latLng || { lat: 37, lng: -122 },
        uid: props.account.uid || ''
      }
    }
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onSave: PropTypes.func.isRequired
  }

  onChange = (e) => {
    this.setState({ account: { ...this.state.account, [e.target.name]: e.target.value } });
  }

  getLocation = (address) => {
    console.log(address, 'address')
    this.setState({ account: { ...this.state.account, address } })
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({ account: { ...this.state.account, latLng } })
      })
      .catch(error => console.error('Error', error))
  }

  onLocationChange = (address) => {
    this.setState({ account: { ...this.state.account, address } })
  }

  onSave = () => {
    this.props.onSave(this.state.account);
  }
  headerDisplay = () => {
    const account = this.state.account,
      company = account.company,
      name = account.displayName;
    if (name && company) {
      return name + " : " + company;
    } else if (company) {
      return company;
    } else {
      return name;
    }
  }

  render() {
    const account = this.state.account,
      allowDelete = this.props.allowDelete;
    return (
      <div className="new-account-view person-view page-view">
        <div className="page-header">
          <h1>{this.headerDisplay() || 'New account'}</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            {allowDelete &&
              <button
                className="btn second-btn btn-delete"
                onClick={(e) => this.props.onDelete(account.uid, e)}>
                Delete
                </button>
            }
            <Link to="/accounts">
              <button className="btn second-btn btn-success" onClick={this.onSave}>Save account</button>
            </Link>
          </div>
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Team</Tab>
            </TabList>

            <TabPanel>
              <form className="person-form">
                <div className="input-group">
                  <div className="col-2">
                    <div>
                      <div>
                        <label>
                          Name
                        </label>
                        <input type="text" value={account.displayName} name="displayName" onChange={this.onChange} />
                      </div>
                      <div>
                        <label>
                          Company
                        </label>
                        <input type="text" value={account.company} name="company" onChange={this.onChange} />
                      </div>
                      <div>
                        <label>
                          Email
                        </label>
                        <input type="text" value={account.email} name="email" onChange={this.onChange} />
                      </div>
                      <div>
                        <label>
                          Phone
                        </label>
                        <input type="text" value={account.phoneNumber} name="phone" onChange={this.onChange} />
                      </div>
                      <div>
                        <label>
                          Address
                        </label>
                        <LocationSearchInput
                          getLocation={this.getLocation}
                          onLocationChange={this.onLocationChange}
                          address={this.state.account.address}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="map">
                        <Map latLng={this.state.account.latLng} />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </TabPanel>

            <TabPanel>
              <div className="tab-header">
                <h2>BensWorth Cleaning Company</h2>
                <Link to="/my-account/new-employee">
                  <button className="invoice-btn btn"><img src={plus} alt="" /><span>New employee</span></button>
                </Link>
              </div>
              <div className="employee-list-wrapper">
                <table className="panel">
                  <thead>
                    <tr className="header">
                      <th><h2>Name</h2></th>
                      <th><h2>Email</h2></th>
                      <th><h2>Phone</h2></th>
                      <th><h2>Role</h2></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    <tr>
                      <td><Link to="/my-account/new-employee">Benny Himsworth</Link></td>
                      <td>bhimsworth@gmail.com</td>
                      <td>343-234-9292</td>
                      <td>Owner</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    )
  }
}