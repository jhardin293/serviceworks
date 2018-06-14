import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCustomers } from '../../actions'

import plus from '../../images/plus.svg'

class CustomersComp extends Component {
  static propTypes = {
    customers: PropTypes.object.isRequired,
    getCustomers: PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.getCustomers();
  }
  render() {

    const customers = this.props.customers.customers.sort((a,b) => {
      const nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }else if (nameA > nameB) {
        return 1;
      }else {
        return 0;
      }
    });
    

    const customersList = customers.map((customer)=> {
      return (
        <tr key={customer.id}>
          <td>
            <Link 
              key={customer.id}
              to={{
                pathname: "customers/edit-customer",
                state: {customer}
              }} >
              {customer.name}
            </Link>
          </td>
          <td>{customer.company || '' }</td>
          <td>{customer.email}</td>
          <td>{customer.phone}</td>
        </tr>
      )
    })

    return (
      <div className="customer-view page-view">
        <div className="page-header">
          <h1>Customers</h1>
          <Link to="customers/new-customer">
            <button className="customer-btn btn"><img src={plus} alt="" /><span>New customer</span></button>
          </Link>
        </div>
        <div className="page-body">
          <div className="customer-list-wrapper">
            <table className="panel">
              <thead>
                <tr className="header">
                  <th><h2>Name</h2></th>
                  <th><h2>Company</h2></th>
                  <th><h2>Email</h2></th>
                  <th><h2>Phone number</h2></th>
                </tr>
              </thead>
              <tbody className="panel-body">
                {customersList}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export const Customers = connect(state => ({ customers: state.customers}), {getCustomers})(CustomersComp);