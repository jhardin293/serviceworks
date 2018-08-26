import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getInvoices, deleteInvoice } from '../../actions'


import plus from '../../images/plus.svg'
import deleteIcon from '../../images/delete.svg'

export class InvoicesComp extends Component {
  static propTypes = {
    getInvoices: PropTypes.func.isRequired,
    invoices: PropTypes.object.isRequired
  }
  componentWillMount() {
    this.props.getInvoices();
  }

  deleteInvoice(id) {
    deleteInvoice(id);
  }

  render() {
    const invoices = this.props.invoices.invoices.sort((a,b) => {
      return b.invoiceNumber - a.invoiceNumber;
    });
    const invoicesList = invoices.map((invoice) => {
      return (
        <tr key={invoice.id}>
          <td>
            <Link
            to={{
              pathname: 'invoices/edit-invoice',
              state: { 
                redirect: {
                  path: window.location.pathname
                },
                invoice 
              }
            }}
          >{invoice.invoiceNumber}</Link>
          </td>
          <td>{invoice.customer.label}</td>
          <td>{invoice.title}</td>
          <td>4/43/3</td>
          <td>{'$'+invoice.total}</td>
          <td>Current</td>
          <td>
            <img
              src={deleteIcon}
              className="delete-icon"
              alt="item-menu"
              onClick={() => this.deleteInvoice(invoice.id)}
            />
          </td>
        </tr>

      )
    })

    return (
      <div className="invoice-view page-view">
        <div className="page-header">
          <h1>Invoices</h1>
          <Link 
            to= {{
            pathname: "/invoices/new-invoice",
            }}
          >
            <button className="invoice-btn btn"><img src={plus} alt="" /><span>New invoices</span></button>
          </Link>
        </div>
        <div className="page-body">
          <div className="invoice-list-wrapper">
            <table className="panel">
              <thead>
                <tr className="header">
                  <th><h2>Number</h2></th>
                  <th><h2>Customer</h2></th>
                  <th><h2>Title</h2></th>
                  <th><h2>Date</h2></th>
                  <th><h2>Amount due</h2></th>
                  <th><h2>Status</h2></th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="panel-body">
                {invoicesList}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  invoices: state.invoices
});

export const Invoices = connect(mapStateToProps,
  { getInvoices })(InvoicesComp);