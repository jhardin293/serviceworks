import React, { Component } from 'react'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-tabs/style/react-tabs.css'
import 'react-select/dist/react-select.css'
import './App.css'




import noteImg1 from './images/note-img-1.jpg'

import threeDots from './images/three-dots.png'

import { Provider } from 'react-redux'

import { store } from '../store'

import { Schedule } from './Schedule'
import { Notes } from './Notes'
import { Customers } from './Customers'
import { Invoices } from './Invoices'
import { TeamMap } from './TeamMap'
import { MyAccount } from './MyAccount'

import { SideNav } from '../structures/SideNav'
import { NewJob } from '../structures/NewJob'
import { EditJob } from '../structures/EditJob'
import { NewNote } from '../structures/NewNote'
import { EditNote } from '../structures/EditNote'
import { EditCustomer } from '../structures/EditCustomer'
import { NewCustomer } from '../structures/NewCustomer'

momentDurationFormatSetup(moment);












class NewInvoice extends Component {
  state = {
    customer: '',
    selectedBilling: '',
  }
  handleCustomer = (customer) => {
    this.setState({ customer });
  }
  handleDate = (date) => {
    this.setState({ start: date });
  }
  handleBilling = (option) => {
    this.setState({ selectedBilling: option });
  }
  render() {
    const { customer, selectedBilling } = this.state;
    return (
      <div className="new-invoice-view page-view">
        <div className="page-header">
          <h1>Running up a check</h1>
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
                  <Select
                    name="form-field-name"
                    value={customer}
                    onChange={this.handleCustomer}
                    searchable
                    options={[
                      { value: 'Billy Joel', label: 'Billy Joel' },
                      { value: 'Sarah Ann', label: 'Sarah Ann' },
                    ]}
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
                      selected={this.state.start}
                      onChange={this.handleDate}
                      placeholderText="Due date"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label>Title</label>
                <input type="text" placeholder="Untitled invoice" />
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


class NewEmployee extends Component {
  render() {
    return (
      <div className="new-employee-view person-view page-view">
        <div className="page-header">
          <h1>New Employee</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <Link to="/my-account">
              <button className="btn second-btn ">Cancel</button>
            </Link>
            <Link to="/my-account">
              <button className="btn second-btn btn-success">Save Employee</button>
            </Link>
          </div>
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Jobs</Tab>
              <Tab>Notes</Tab>
              <Tab>Invoices</Tab>
            </TabList>

            <TabPanel>
              <form className="person-form">
                <div className="input-group">
                  <label>
                    Name and company
                  </label>
                  <div className="col-2">
                    <div>
                      <input type="text" placeholder="First name" />
                    </div>
                    <div>
                      <input type="text" placeholder="Last name" />
                    </div>
                  </div>
                  <div className="col-2">
                    <div>
                      <input type="text" placeholder="Role" />
                    </div>
                    <div>
                      <input type="text" placeholder="Nickname" />
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label>
                    Address
                  </label>
                  <div className="col-2 with-map">
                    <div className="col-1">
                      <input type="text" placeholder="Street address" />
                      <input type="text" placeholder="Apt / suite / floor" />
                      <input type="text" placeholder="City" />
                      <input type="text" placeholder="State" />
                      <div className="row col-80">
                        <div>
                          <select>
                            <option>California</option>
                            <option>New York</option>
                          </select>
                        </div>
                        <div>
                          <input type="text" placeholder="Zip code" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="map">
                      </div>
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label>
                    Contact
                  </label>
                  <div className="col-2">
                    <div>
                      <input type="text" placeholder="Mobile phone" />
                    </div>
                    <div>
                      <input type="text" placeholder="Home phone" />
                    </div>
                  </div>
                  <div className="col-2">
                    <div>
                      <input type="text" placeholder="Email" />
                    </div>
                    <div>
                      <input type="text" placeholder="Office phone" />
                    </div>
                  </div>
                </div>
              </form>
            </TabPanel>
            <TabPanel>
              <div className="tab-header"> 
                <Link to="/schedule/new-job">
                  <span>+</span><h2>New Job</h2>
                </Link>
              </div>
              <div className="tab-body">
                <table className="panel">
                  <thead>
                    <tr className="header">
                      <th><h2>Job name</h2></th>
                      <th><h2>Date</h2></th>
                      <th><h2>Time</h2></th>
                      <th><h2>Location</h2></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    <tr>
                      <td><Link to="/schedule/new-job">Window cleaning</Link></td>
                      <td>April 21, 2018</td>
                      <td>1:00am - 2:00 am</td>
                      <td>42 W 89th St, New York</td>
                    </tr>
                    <tr>
                      <td><Link to="/schedule/new-job">Window cleaning</Link></td>
                      <td>April 21, 2018</td>
                      <td>1:00am - 2:00 am</td>
                      <td>42 W 89th St, New York</td>
                    </tr>
                    <tr>
                      <td><Link to="/schedule/new-job">Window cleaning</Link></td>
                      <td>April 21, 2018</td>
                      <td>1:00am - 2:00 am</td>
                      <td>42 W 89th St, New York</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="tab-header notes"> 
                <Link to="/notes/new-note">
                  <span>+</span><h2>New Note</h2>
                </Link>
              </div>
              <div className="page-body">
                <div className="notes-list panel">
                  <div className="header">
                    <h2>Note text</h2>
                    <h2>Created</h2>
                  </div>
                  <div className="panel-body">
                    <div className="sort-group">
                      <div className="month-group"><span>March 2018</span></div>
                      <div className="group-body">
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sort-group">
                      <div className="month-group"><span>March 2018</span></div>
                      <div className="group-body">
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                        <div className="note">
                          <div className="note-left">
                            <div className="note-text">
                              <div className="note-title">This is the first note</div>
                              <div className="note-body">
                                <p>This is the body text of the note. Im sure a lot better content will be written here</p>
                              </div>
                            </div>
                            <div className="note-img">
                              <img src={noteImg1} alt="note-img" />
                            </div>
                          </div>
                          <div className="note-right">
                            <div className="note-created">3/07/18</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="tab-header invoices"> 
                <Link to="/invoices">
                  <span>+</span><h2>New Invoice</h2>
                </Link>
              </div>
              <div className="tab-body">
                <table className="panel invoices">
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
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-customer">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-customer">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-customer">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                    <tr>
                      <td><Link to="/invoices/new-invoice">0001</Link></td>
                      <td><Link to="customers/new-customer">Sally May</Link></td>
                      <td><Link to="/invoices/new-invoice">Window cleaning</Link></td>
                      <td>4/28/18</td>
                      <td>$240</td>
                      <td>Current</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPanel>
          </Tabs>
        </div>

      </div>
    )
  }
}




class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="main-content">
            <SideNav />
            <Route exact path="/" render={() => (
              <Redirect to="/schedule" />
            )} />
            <Route path="/schedule" exact component={Schedule} />
            <Route path="/notes" exact component={Notes} />
            <Route path="/customers" exact component={Customers} />
            <Route path="/invoices" exact component={Invoices} />
            <Route path="/team-map" component={TeamMap} />
            <Route path="/my-account" exact component={MyAccount} />
            <Route exact path="/schedule/new-job" component={NewJob} />
            <Route exact path="/schedule/edit-job" component={EditJob} />
            <Route exact path="/notes/new-note" component={NewNote} />
            <Route exact path="/notes/edit-note" component={EditNote} />
            <Route exact path="/customers/new-customer" component={NewCustomer} />
            <Route exact path="/customers/edit-customer" component={EditCustomer} />
            <Route exact path="/invoices/new-invoice" component={NewInvoice} />
            <Route exact path="/my-account/new-employee" component={NewEmployee} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
