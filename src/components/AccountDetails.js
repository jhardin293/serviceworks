import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { LocationSearchInput } from '../components/LocationSearchInput'
import { uploadImage } from '../actions'
import Map from '../components/Map'


export class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: {
        displayName: props.account.displayName || '',
        photoURL: props.account.photoURL || '',
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

  onSave = (e) => {
    this.props.onSave(this.state.account);
  }

  handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage('/users', file).then((url) => {
        this.setState({ account: { ...this.state.account, photoURL: url } });
      })
    }
  }

  render() {
    const account = this.state.account,
      allowDelete = this.props.allowDelete;
    return (
      <div>
        <div className="action-header">
          <div></div>
          <div className="tab-btn-group">
            {allowDelete &&
              <button
                className="btn second-btn btn-delete"
                onClick={(e) => this.props.onDelete(account.uid, e)}>
                Delete
                    </button>
            }
            <button className="btn second-btn btn-success" onClick={this.onSave}>Save account</button>
          </div>
        </div>
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
                  <input type="text" value={account.phoneNumber} name="phoneNumber" onChange={this.onChange} />
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
                <div className="control-area">
                  <label>
                    Profile img
                        </label>
                  <input type="file" name="Add Photo" onChange={this.handleUpload} />
                </div>
                <div>
                  {this.state.account.photoURL.length > 0 &&
                    <img src={this.state.account.photoURL} alt="" />
                  }
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
      </div>
    )
  }
}