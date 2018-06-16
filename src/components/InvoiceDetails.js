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
  constructor(props) {
    super(props);
    const invoice = props.invoice;
    this.state = {
      invoice: {
        title: invoice.title,
        customer: invoice.customer,
        dueDate: moment(invoice.dueDate),
        total: '',
        labor: {
          0: {
            key: 0,
            item: '',
            rate: '',
            billing: {
              label: 'Hourly',
              value: 'hourly'
            },
            hours: '',
            total: ''
          }
        }
      },
      exit: props.exit,
      allowDelete: props.allowDelete
    }
  }
  static propTypes = {
    invoice: PropTypes.object.isRequired,
  }

  onChange = (e) => {
    this.setState({ invoice: { ...this.state.invoice, [e.target.name]: e.target.value } });
  }

  onLineItemChange = (e) => {
    const idx = e.target.dataset.idx,
      name = e.target.name,
      value = e.target.value

    this.setState((prevState, props) => {
      return {
        invoice: {
          ...this.state.invoice, labor: {
            ...this.state.invoice.labor, [idx]: {
              ...this.state.invoice.labor[idx], [name]: value
            }
          }
        }
      }
    }, () => {
      const lineItem = this.state.invoice.labor[idx];
      const rate = +lineItem.rate,
        hours = +lineItem.hours,
        billing = lineItem.billing.value;
      let total = 0

      const setTotal = () => {
        this.setState({
          invoice: {
            ...this.state.invoice, labor: {
              ...this.state.invoice.labor, [idx]: {
                ...this.state.invoice.labor[idx], total
              }
            }
          }
        })
      }

      if (billing === 'hourly') {
        total = rate * hours;
        setTotal();
      }
    })
  }


  handleCustomer = (customer) => {
    this.setState({ invoice: { ...this.state.invoice, customer } });
  }
  handleDate = (dueDate) => {
    this.setState({ invoice: { ...this.state.invoice, dueDate } });
  }
  handleBilling = (option, idx) => {
    this.setState(
      {
        invoice: {
          ...this.state.invoice, labor: {
            ...this.state.invoice.labor, [idx]: {
              ...this.state.invoice.labor[idx], billing: option
            }
          }
        }
      }
    )
  }

  newLineItem = (type) => {
    if (type === 'labor') {
      const laborList = Object.values(this.state.invoice.labor);
      const newIdx = laborList.length;
      const laborObj = {
        key: +newIdx,
        item: '',
        rate: '',
        billing: {
          label: 'Hourly',
          value: 'hourly'
        },
        hours: '',
        total: ''
      }
      this.setState(
        {
          invoice: {
            ...this.state.invoice, labor: {
              ...this.state.invoice.labor, [newIdx]: laborObj
            }
          }
        }
      )
    }
  }



  render() {
    const { customer } = this.state.invoice;
    const labor = Object.values(this.state.invoice.labor);
    let laborLineItems = [];
    laborLineItems = labor.map((lineItem, idx) => {
      return (
        <tr className="line-item" key={idx}>
          <td className="description">
            <input
              data-idx={idx}
              type="text"
              name="item"
              placeholder="Enter line item or description..."
              onChange={this.onLineItemChange}
              value={this.state.invoice.labor[idx].item}
            />
          </td>
          <td>
            <input
              data-idx={idx}
              type="text"
              name="rate"
              placeholder="0.00"
              onChange={this.onLineItemChange}
              value={this.state.invoice.labor[idx].rate}
            />
          </td>
          <td>
            <Select
              name="form-field-name"
              value={this.state.invoice.labor[idx].billing}
              onChange={(option) => this.handleBilling(option, idx)}
              searchable
              placeholder="Hourly"
              options={[
                { value: 'hourly', label: 'Hourly' },
                { value: 'fixed', label: 'Fixed' },
              ]}
            />
          </td>
          <td>
            <input
              data-idx={idx}
              type="text"
              name="hours"
              placeholder="0"
              onChange={this.onLineItemChange}
              value={this.state.invoice.labor[idx].hours}
            />
          </td>
          <td>
            <div className="line-total">
              <span className="line-value">{"$" + this.state.invoice.labor[idx].total}</span>
              <img src={threeDots} alt="item-menu" />
            </div>
          </td>
        </tr>
      )
    })

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
                      <th><h2>Total</h2></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    {laborLineItems}
                    <tr className="new-line-item">
                      <td colSpan="5" onClick={() => this.newLineItem('labor')}><span>+ New line item</span></td>
                    </tr>
                  </tbody>
                </table>
                <table className="panel">
                  <thead>
                    <tr className="header">
                      <th><h2>Parts</h2></th>
                      <th><h2>Price</h2></th>
                      <th><h2>Quantity</h2></th>
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