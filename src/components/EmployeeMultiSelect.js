import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { getEmployees } from '../actions'
import { connect } from 'react-redux';

class EmployeeMultiSelect extends Component {
  //Todo check for value employee, It switces from a string to an object
  static propTypes = {
    employees: PropTypes.object.isRequired,
    getEmployees: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    // employee: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.props.getEmployees();
  }

  render() {
    const employees = this.props.employees.employees;
    let employeesList = []

    if (employees.length !== 0) {
      employees.forEach((employee) => {
        employeesList.push(
          {
            label: employee.name,
            value: employee.name,
            latLng: employee.latLng,
            address: employee.address
          }
        );
      })
    }
    return (
      <Select
        name="form-field-name"
        multi
        value={this.props.value}
        onChange={this.props.onChange}
        searchable
        className="tags"
        options={employeesList}
      />
    )
  }
}

export default connect(state => ({
  employees: state.employees
}), { getEmployees })(EmployeeMultiSelect);
