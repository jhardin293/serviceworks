import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import deleteIcon from '../images/delete.svg'
import CustomerDropdown from '../components/CustomerDropdown'
import moment from 'moment'
import { arrayToObject } from '../libs/array-to-object'

export class InvoiceDetails extends Component {
  constructor(props) {
    super(props);
    const invoice = props.invoice;
    this.state = {
      invoice: {
        title: invoice.title,
        customer: invoice.customer,
        dueDate: moment(invoice.dueDate),
        total: 0,
        labor: {
          0: {
            item: '',
            rate: '',
            billing: {
              label: 'Hourly',
              value: 'hourly'
            },
            hours: '',
            total: 0
          }
        },
        parts: {
          0: {
            item: '',
            price: '',
            quantity: 1,
            total: 0
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

  setInvoiceTotal = () => {
    const laborList = Object.values(this.state.invoice.labor),
      partsList = Object.values(this.state.invoice.parts),
      allItems = laborList.concat(partsList);

    const invoiceTotal = allItems.reduce((prev, current) => {
      return prev + current.total
    }, 0);

    this.setState({
      invoice: {
        ...this.state.invoice, total: invoiceTotal
      }
    })
  }

  onChange = (e) => {
    this.setState({ invoice: { ...this.state.invoice, [e.target.name]: e.target.value } });
  }

  onLineItemChange = (e, type) => {
    const idx = e.target.dataset.idx,
      name = e.target.name,
      value = e.target.value
    this.setState((prevState, props) => {
      return {
        invoice: {
          ...this.state.invoice, [type]: {
            ...this.state.invoice[type], [idx]: {
              ...this.state.invoice[type][idx], [name]: value
            }
          }
        }
      }
    }, () => {
      const lineItem = this.state.invoice[type][idx];

      const setLineTotal = (total) => {
        this.setState(() => {
          return {
            invoice: {
              ...this.state.invoice, [type]: {
                ...this.state.invoice[type], [idx]: {
                  ...this.state.invoice[type][idx], total
                }
              }
            }
          }
        }, () => {
          // Set Invioce Total;
          this.setInvoiceTotal();
        })
      }

      if (type === 'labor') {
        const rate = +lineItem.rate,
          hours = +lineItem.hours,
          billing = lineItem.billing.value;

        if (billing === 'hourly') {
          const total = rate * hours;
          setLineTotal(total);
        } else {
          const total = rate;
          setLineTotal(total);
        }
      }

      if (type === 'parts') {
        const price = +lineItem.price,
          quantity = +lineItem.quantity,
          total = price * quantity;

        setLineTotal(total);
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
    const setBillingState = (hoursDisabled) => {
      this.setState(
        {
          invoice: {
            ...this.state.invoice, labor: {
              ...this.state.invoice.labor, [idx]: {
                ...this.state.invoice.labor[idx], billing: option,
                hoursDisabled
              }
            }
          }
        }
      )
    }

    if (option && option.value === 'hourly') {
      setBillingState(false);
    } else {
      setBillingState(true);
    }
  }

  newLineItem = (type) => {
    const itemsList = Object.values(this.state.invoice[type]);
    const newIdx = itemsList.length;
    let newLineItem;
    if (type === 'labor') {
      newLineItem = {
        item: '',
        rate: '',
        billing: {
          label: 'Hourly',
          value: 'hourly'
        },
        hours: '',
        total: 0
      }
    }

    if (type === 'parts') {
      newLineItem = {
        item: '',
        price: '',
        quantity: 1,
        total: 0
      }
    }

    this.setState(
      {
        invoice: {
          ...this.state.invoice, [type]: {
            ...this.state.invoice[type], [newIdx]: newLineItem
          }
        }
      }
    )
  }

  removeLineItem = (type, idx) => {
    const itemsList = Object.values(this.state.invoice[type]);
    itemsList.splice(idx, 1);
    const itemObject = arrayToObject(itemsList);
    this.setState(()=> {
      return {
        invoice: {
          ...this.state.invoice, [type]: itemObject
        }
      }
    }, ()=> {
      this.setInvoiceTotal();
    })
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
              onChange={(e) => this.onLineItemChange(e, 'labor')}
              value={this.state.invoice.labor[idx].item}
            />
          </td>
          <td>
            <input
              data-idx={idx}
              type="text"
              name="rate"
              placeholder="0.00"
              onChange={(e) => this.onLineItemChange(e, 'labor')}
              value={this.state.invoice.labor[idx].rate}
            />
          </td>
          <td>
            <Select
              name="form-field-name"
              value={this.state.invoice.labor[idx].billing}
              onChange={(option) => this.handleBilling(option, idx)}
              searchable={false}
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
              onChange={(e) => this.onLineItemChange(e, 'labor')}
              value={this.state.invoice.labor[idx].hours}
              disabled={this.state.invoice.labor[idx].hoursDisabled}
            />
          </td>
          <td>
            <div className="line-total">
              <span className="line-value">{"$" + this.state.invoice.labor[idx].total}</span>
              <img
                src={deleteIcon}
                className="delete-icon"
                alt="item-menu"
                onClick={() => this.removeLineItem('labor', idx)}
              />
            </div>
          </td>
        </tr>
      )
    })

    const parts = Object.values(this.state.invoice.parts);
    let partsLineItems = [];

    partsLineItems = parts.map((lineItem, idx) => {
      return (
        <tr className="line-item" key={idx}>
          <td className="description">
            <input
              data-idx={idx}
              type="text"
              name="item"
              placeholder="Enter part item or description..."
              onChange={(e) => this.onLineItemChange(e, 'parts')}
              value={this.state.invoice.parts[idx].item}
            />
          </td>
          <td>
            <input
              data-idx={idx}
              type="text"
              name="price"
              placeholder="$0.00"
              onChange={(e) => this.onLineItemChange(e, 'parts')}
              value={this.state.invoice.parts[idx].price}
            />
          </td>
          <td>
            <input
              data-idx={idx}
              type="text"
              name="quantity"
              placeholder="0"
              onChange={(e) => this.onLineItemChange(e, 'parts')}
              value={this.state.invoice.parts[idx].quantity}
            />
          </td>
          <td>
            <div className="line-total">
              <span className="line-value">{"$" + this.state.invoice.parts[idx].total}</span>
              <img
                src={deleteIcon}
                className="delete-icon"
                alt="item-menu"
                onClick={() => this.removeLineItem('parts', idx)}
              />
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
              <h2>{"$" + this.state.invoice.total}</h2>
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
                <table className="panel parts-invoice">
                  <thead>
                    <tr className="header">
                      <th><h2>Parts</h2></th>
                      <th><h2>Price</h2></th>
                      <th><h2>Quantity</h2></th>
                      <th><h2>Total</h2></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    {partsLineItems}
                    <tr className="new-line-item">
                      <td colSpan="4" onClick={() => this.newLineItem('parts')}><span>+ New line item</span></td>
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