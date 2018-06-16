import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import threeDots from '../images/three-dots.png'
import CustomerDropdown from '../components/CustomerDropdown'
import moment from 'moment'

export class InvoiceDetails extends Component {
  constructor (props) {
    super(props);
    const invoice = props.invoice;
    this.state = {
      invoice: {
        title: invoice.title,
        customer: invoice.customer,
        selectedBilling: invoice.selectedBilling,
        dueDate: moment(invoice.dueDate)
      },
      exit: props.exit,
      allowDelete: props.allowDelete
    }
  }
  static propTypes = {
    invoice: PropTypes.object.isRequired,
  }

  onChange = (e) => {
    this.setState({ invoice: {...this.state.invoice,[e.target.name]: e.target.value }});
  }

  handleCustomer = (customer) => {
    this.setState({ invoice: {...this.state.invoice, customer}});    
  }
  handleDate = (dueDate) => {
    this.setState({ invoice: {...this.state.invoice, dueDate}});    
  }
  handleBilling = (option) => {
    this.setState({ selectedBilling: option });
  }
  render() {
    const { customer, selectedBilling } = this.state.invoice;
    console.log(this.state.invoice, 'state');
    return (
      <div className="new-invoice-view page-view">
        <div className="page-header">
          <h1>{this.state.invoice.title || 'New Invoice'}</h1>
          <Link to="/invoices">
            <button className="btn second-btn btn-success">Save invoice</button>
          </Link>
        </div>
        <div className="page-body">
          <div className="invoice-header">
            <form className="invoice-header-inputs">
              <div className="col-2">
                <div>
                  <label>Customer</label>
                  <CustomerDropdown 
                    onChange={this.handleCustomer} 
                    value={customer}
                  />
                </div>
                <div className="invoice-meta">
                  <div>
                    <label>Invoice #</label>
                    <input type="text" placeholder="Pending" disabled="true" />
                  </div>
                  <div>
                    <label>Sent Date</label>
                    <input type="text" placeholder="Not sent" disabled="true" />
                  </div>
                  <div>
                    <label>Due date</label>
                    <DatePicker
                      selected={this.state.invoice.dueDate}
                      onChange={this.handleDate}
                      placeholderText="Due date"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label>Title</label>
                <input 
                  type="text" 
                  name="title"
                  placeholder="Untitled invoice" 
                  value={this.state.invoice.title} 
                  onChange={this.onChange}
                />
              </div>
            </form>
            <div className="invoice-total">
              <label>Total</label>
              <h2>$1,000,000</h2>
            </div>
          </div>
          <div className="invoice-body">
            <Tabs className="react-tabs alt">
              <TabList>
                <Tab>Line items</Tab>
                <Tab>Footer</Tab>
              </TabList>
              <TabPanel>
                <table className="panel">
                  <thead>
                    <tr className="header">
                      <th><h2>Labor</h2></th>
                      <th><h2>Rate</h2></th>
                      <th><h2>Billing</h2></th>
                      <th><h2>Hours</h2></th>
                      <th><h2>Discount</h2></th>
                      <th><h2>Tax</h2></th>
                      <th><h2>Total</h2></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    <tr className="line-item">
                      <td className="description"><input type="text" placeholder="Enter line item or description..." /></td>
                      <td><input type="text" placeholder="$0.00" /></td>
                      <td>
                        <Select
                          name="form-field-name"
                          value={selectedBilling}
                          onChange={this.handleBilling}
                          searchable
                          placeholder="Hourly"
                          options={[
                            { value: 'hourly', label: 'Hourly' },
                            { value: 'fixed', label: 'Fixed' },
                            { value: 'quantity', label: 'Quantity' },
                          ]}
                        />
                      </td>
                      <td><input type="text" placeholder="0" /></td>
                      <td><input type="text" placeholder="0" /></td>
                      <td><input type="text" placeholder="0" /></td>
                      <td>
                        <div className="line-total">
                          <span className="line-value">$500,000</span>
                          <img src={threeDots} alt="item-menu" />
                        </div>
                      </td>
                    </tr>
                    <tr className="line-item">
                      <td className="description"><input type="text" placeholder="Enter line item or description..." /></td>
                      <td><input type="text" placeholder="$0.00" /></td>
                      <td>
                        <Select
                          name="form-field-name"
                          value={selectedBilling}
                          onChange={this.handleBilling}
                          searchable
                          placeholder="Hourly"
                          options={[
                            { value: 'hourly', label: 'Hourly' },
                            { value: 'fixed', label: 'Fixed' },
                            { value: 'quantity', label: 'Quantity' },
                          ]}
                        />
                      </td>
                      <td><input type="text" placeholder="0" /></td>
                      <td><input type="text" placeholder="0" /></td>
                      <td><input type="text" placeholder="0" /></td>
                      <td>
                        <div className="line-total">
                          <span className="line-value">$500,000</span>
                          <img src={threeDots} alt="item-menu" />
                        </div>
                      </td>
                    </tr>
                    <tr className="new-line-item">
                      <td colSpan="8"><span>+ New line item</span></td>
                    </tr>
                  </tbody>
                </table>
                <table className="panel">
                  <thead>
                    <tr className="header">
                      <th><h2>Parts</h2></th>
                      <th><h2>Price</h2></th>
                      <th><h2>Quantity</h2></th>
                      <th><h2>Discount</h2></th>
                      <th><h2>Tax</h2></th>
                      <th><h2>Total</h2></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    <tr className="line-item">
                      <td className="description"><input type="text" placeholder="Enter line item or description..." /></td>
                      <td><input type="text" placeholder="$0.00" /></td>
                      <td><input type="text" placeholder="0" /></td>
                      <td><input type="text" placeholder="0" /></td>
                      <td><input type="text" placeholder="0" /></td>
                      <td>
                        <div className="line-total">
                          <span className="line-value">$500,000</span>
                          <img src={threeDots} alt="item-menu" />
                        </div>
                      </td>
                    </tr>
                    <tr className="new-line-item">
                      <td colSpan="8"><span>+ New line item</span></td>
                    </tr>
                  </tbody>
                </table>
              </TabPanel>
              <TabPanel>
                <div className="invoice-footer">
                  <h5>Additional notes to show at bottom of invoice</h5>
                  <textarea></textarea>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}