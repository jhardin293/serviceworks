import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getEmployees } from '../../actions'
import plus from '../images/plus.svg'
import PropTypes from 'prop-types'

export class EmployeesComp extends Component {
  static propTypes = {
    employees: PropTypes.object.isRequired,
    getEmployees: PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.getEmployees();
  }
  render() {
    const employees = this.props.employees.employees;
    const employeesList = employees.map((employee) => {
      return (
        <tr key={employee.id}>
          <td>
            <Link 
              to={{
                pathname: "employees/edit-employee",
                state:{
                  redirect: {
                    path: window.location.pathname
                  },
                  employee
                }
              }}>
              {employee.name}
            </Link>
          </td>
          <td>{employee.email}</td>
          <td>{employee.phone}</td>
          <td>{employee.role}</td>
        </tr>
      )
    })
    return (
      <div className="employee-view page-view">
        <div className="page-header">
          <h1>Employees</h1>
          <Link to={{
            pathname: "employees/new-employee",
            state: {
              redirect: {
                path: window.location.pathname,
                tabIdx: 0
              },
            }
          }} >
            <button className="account-btn btn"><img src={plus} alt="" /><span>Add employee</span></button>
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
              </tr>
            </thead>
            <tbody className="panel-body">
              {employeesList}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export const Employees = connect(state => ({ employees: state.employees}), {getEmployees})(EmployeesComp);
