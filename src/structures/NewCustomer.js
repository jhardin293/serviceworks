import React, { Component } from 'react'
import { CustomerDetails } from '../components/CustomerDetails'
import { newCustomer } from '../actions'
import isEqual from 'lodash.isequal'

export class NewCustomer extends Component {
  state = {
    customer: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      latLng: {lat:37,lng:-122},
      id: ''
    },
    exit: false,
    redirect: this.props.location.state.redirect,
    openExitModal: false,
  }

  onCancel = (currentState) => {
    if(isEqual(this.state.customer, currentState)) {
      this.setState({exit: true});
    }else {
      this.setState({openExitModal: true});
    }
  }

  leavePage = () => {
    this.setState({exit: true});
  }

  handleCloseModal = () => {
    this.setState({openExitModal: false});
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
        leavePage={this.leavePage}
        newCustomer={true}
        redirect={this.state.redirect}
        onCancel={this.onCancel}
        openExitModal={this.state.openExitModal}
        handleCloseModal={this.handleCloseModal}
      />
    )
  }
}

