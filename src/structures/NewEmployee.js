import React, { Component } from 'react'
import { EmployeeDetails } from '../components/EmployeeDetails'
import { newEmployee } from '../actions';
import isEqual from 'lodash.isequal'

export class NewEmployee extends Component {
  state = {
    employee: {
      name: '',
      email: '',
      phone: '',
      address: '',
      role: '',
      latLng: {lat:37,lng:-122},
      id: ''
    },
    exit: false,
    redirect: this.props.location.state.redirect,
    openExitModal: false,
  }

  onCancel = (currentState) => {
    if(isEqual(this.state.employee, currentState)) {
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

  onSave = (employee) => {
    const employeeClone = {...employee};
    employeeClone.last_edit = new Date();
    newEmployee(employeeClone);

    this.setState({exit: true});
  }
  render() {
    return (
      <EmployeeDetails
        employee={this.state.employee}
        onSave={this.onSave}
        exit={this.state.exit}
        newEmployee={true}
        leavePage={this.leavePage}
        redirect={this.state.redirect}
        onCancel={this.onCancel}
        openExitModal={this.state.openExitModal}
        handleCloseModal={this.handleCloseModal}
       />
    )
  }
}