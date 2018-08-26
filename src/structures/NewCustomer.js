import React, { Component } from 'react'
import { CustomerDetails } from '../components/CustomerDetails'
import { newCustomer } from '../actions'

export class NewCustomer extends Component {
  state = {
    customer: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      latLng: {lat:37,lng:-122}
    },
    exit: false
  }

  onSave = (customer) => {
    const customerClone = {...customer};
    customerClone.last_edit = new Date();
    newCustomer(customerClone);

    this.setState({exit: true});
  }
  render() {
    return (
      <CustomerDetails 
        customer={this.state.customer} 
        onSave={this.onSave} 
        exit={this.state.exit} 
        newCustomer={true}
      />
    )
  }
}

