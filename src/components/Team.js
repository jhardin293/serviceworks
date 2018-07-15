import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getEmployees } from '../actions'
import plus from '../images/plus.svg'
import PropTypes from 'prop-types'

export class TeamComp extends Component {
  static propTypes = {
    employees: PropTypes.array.isRequired,
    getEmployees: PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.getEmployees();
  }
  render() {
    console.log(this.props);
    const employees = this.props.employees;
    const employeesList = employees.map((employee) => {
      return (
        <tr key={employee.id}>
          <td>
            <Link 
              to={{
                pathname: "/my-account/edit-employee",
                state:{employee}
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
      <div>
        <div className="action-header">
          <div>
            <h2>BensWorth Cleaning Company</h2>
          </div>
          <Link to="/my-account/new-employee">
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
                <th></th>
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

export const Team = connect(state => ({ employees: state.employees.data}), {getEmployees})(TeamComp);
