import React, { Component } from 'react'
import { EmployeeDetails } from '../components/EmployeeDetails'
import { newEmployee } from '../actions';
export class NewEmployee extends Component {
  state = {
    employee: {
      name: '',
      email: '',
      phone: '',
      address: '',
      latLng: {lat:37,lng:-122}
    },
    exit: false
  }

  onSave = (employee) => {
    const employeeClone = {...employee};
    employeeClone.last_edit = new Date();
    newEmployee(employeeClone);

    this.setState({exit: true});
    console.log(employee, 'to save');
  }
  render() {
    return (
      <EmployeeDetails
        employee={this.state.employee}
        onSave={this.onSave}
        exit={this.state.exit}
       />
    )
  }
}