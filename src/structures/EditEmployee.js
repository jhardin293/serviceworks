import React, { Component } from 'react'
import { EmployeeDetails } from '../components/EmployeeDetails'
import { editEmployee, deleteEmployee } from '../actions';
import isEqual from 'lodash.isequal'

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
    allowDelete: true,
    redirect: this.props.location.state.redirect,
    openExitModal: false,
    openDeletModal: false,
    tabIdx: this.props.location.state.tabIdx || 0
  }

  onCancel = (currentState) => {
    if(isEqual(this.state.employee, currentState)) {
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
        onCancel={this.onCancel}
        onSave={this.onSave}
        onDelete={this.onDelete}
        redirect={this.state.redirect}
        tabIdx={this.state.tabIdx}
        exit={this.state.exit}
        allowDelete={this.state.allowDelete}
        openExitModal={this.state.openExitModal}
        handleCloseModal={this.handleCloseModal}
        handleDeleteConfirmation={this.handleDeleteConfirmation}
        openDeleteModal={this.state.openDeleteModal}
        newEmployee={false}
       />
    )
  }
}