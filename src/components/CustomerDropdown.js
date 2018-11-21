import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { getCustomers } from '../actions'
import { connect } from 'react-redux';

class CustomerDropdown extends Component {
  //Todo check for value customer, It switces from a string to an object
  static propTypes = {
    customers: PropTypes.object.isRequired,
    getCustomers: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    // customer: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.props.getCustomers();
  }

  renderLink () {
		return <a style={{ marginLeft: 5 }} href="/upgrade" target="_blank">Upgrade here!</a>;
	}
  
  render() {
    const customers = this.props.customers.customers;
    let customersList = [
      {
        label: 'add new customer',
        link : '/link',
        value: 'prop',
        // disabled: true
      }
    ]

    if (customers.length !== 0) {
     customers.forEach((customer) => {
      customersList.push(
        {
          label: customer.name,
          latLng: customer.latLng,
          id: customer.id,
          phone: customer.phone,
          email: customer.email,
          address: customer.address
        }
      );
     }) 
    }
    return (
      <Select
        name="form-field-name"
        value={this.props.value}
        onChange={this.props.onChange}
        searchable
        options={customersList}
      />
    )
  } 
}

export default connect(state => ({
  customers: state.customers
}), {getCustomers})(CustomerDropdown);
