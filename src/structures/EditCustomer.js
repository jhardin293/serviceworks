import React, { Component } from 'react'
import { CustomerDetails } from '../components/CustomerDetails'
import { editCustomer, deleteCustomer} from '../actions'
import isEqual from 'lodash.isequal'

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
    redirect: this.props.location.state.redirect,
    openExitModal: false,
    openDeleteModal: false,
    tabIdx: this.props.location.state.tabIdx || 0
  }

  onDelete = (id) => {
    deleteCustomer(id);
    this.setState({exit: true});
  }

  leavePage = () => {
    this.setState({exit: true});
  }

  onCancel = (currentState) => {
    if(isEqual(this.state.customer, currentState)) {
      this.setState({exit: true});
    }else {
      this.setState({openExitModal: true});
    }
  }

  handleDeleteConfirmation = () => {
    this.setState({openDeleteModal: true});
  }
  
  handleCloseModal = () => {
    this.setState({openExitModal: false, openDeleteModal: false});
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
        onCancel={this.onCancel}
        redirect={this.state.redirect}
        tabIdx={this.state.tabIdx}
        onSave={this.onSave} 
        exit={this.state.exit} 
        allowDelete
        onDelete={this.onDelete}
        leavePage={this.leavePage}
        newCustomer={false}
        openExitModal={this.state.openExitModal}
        handleCloseModal={this.handleCloseModal}
        handleDeleteConfirmation={this.handleDeleteConfirmation}
        openDeleteModal={this.state.openDeleteModal}
      />
    )
  }
}