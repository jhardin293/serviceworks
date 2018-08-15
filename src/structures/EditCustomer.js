import React, { Component } from 'react'
import { CustomerDetails } from '../components/CustomerDetails'
import { editCustomer, deleteCustomer} from '../actions'

export class EditCustomer extends Component {
  customer =   this.props.location.state.customer
  state = {
    customer: {
      name: this.customer.name || '',
      company: this.customer.company || '',
      email: this.customer.email || '',
      phone: this.customer.phone || '',
      address: this.customer.address || '',
      latLng: this.customer.latLng || {lat:37,lng:-122},
      id: this.customer.id
    },
    exit: false,
    tabIdx: this.props.location.state.tabIdx || 0
  }

  onDelete = (id) => {
    deleteCustomer(id);
    this.setState({exit: true});
  }

  onSave = (customer) => {
    const customerClone = {...customer};
    customerClone.last_edit = new Date();
    editCustomer(customerClone);

    this.setState({exit: true});
  }

  render() {
    return (
      <CustomerDetails 
        customer={this.state.customer} 
        tabIdx={this.state.tabIdx}
        onSave={this.onSave} 
        exit={this.state.exit} 
        allowDelete
        onDelete={this.onDelete}
        newCustomer={false}
      />
    )
  }
}