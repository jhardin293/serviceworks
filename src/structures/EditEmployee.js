import React, { Component } from 'react'
import { EmployeeDetails } from '../components/EmployeeDetails'
import { editEmployee, deleteEmployee } from '../actions';
export class EditEmployee extends Component {
  employee = this.props.location.state.employee
  state = {
    employee: {
      name: this.employee.name || '',
      email:this.employee.email ||  '',
      phone:this.employee.phone ||  '',
      address:this.employee.address ||  '',
      role: this.employee.role || '',
      latLng: this.employee.latLng ||  {lat:37,lng:-122},
      id: this.employee.id
    },
    exit: false,
    tabIdx: this.props.location.state.tabIdx || 0
  }
  onDelete = (id) => {
    deleteEmployee(id);
    this.setState({exit: true});
  }

  onSave = (employee) => {
    const employeeClone = {...employee};
    employeeClone.last_edit = new Date();
    editEmployee(employeeClone);

    this.setState({exit: true});
  }
  render() {
    return (
      <EmployeeDetails
        employee={this.state.employee}
        tabIdx={this.state.tabIdx}
        onSave={this.onSave}
        exit={this.state.exit}
        allowDelete
        onDelete={this.onDelete}
        newEmployee={false}
       />
    )
  }
}