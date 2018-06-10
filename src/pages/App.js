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
import Map  from '../components/Map'
import { LocationSearchInput } from '../components/LocationSearchInput'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-tabs/style/react-tabs.css'
import 'react-select/dist/react-select.css'
import './App.css'




import noteImg1 from './images/note-img-1.jpg'

import threeDots from './images/three-dots.png'

import { Provider } from 'react-redux'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

import {
  newNote,
  editNote,
  deleteNote,
  uploadImage,
  newCustomer,
  editCustomer,
  deleteCustomer
} from '../actions'
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

momentDurationFormatSetup(moment);

class EditNote extends Component {
  note =   this.props.location.state.note
  state = {
    note: {
      title: this.note.title,
      body: this.note.body || '',
      image: this.note.image || '',
      id: this.note.id
    },
    exit: false
  }

  onDelete = (id) => {
    deleteNote(id);
    this.setState({exit: true});
  }

  onSave = (e,note) => {
    const noteClone = {...note};
    noteClone.last_edit = new Date();
    console.log(noteClone,'edit note clone')
    editNote(noteClone);

    this.setState({exit: true});
  }

  render() {
    return (
      <NoteDetails 
        note={this.state.note} 
        exit={this.state.exit} 
        onSave={this.onSave} 
        onDelete={this.onDelete}
        allowDelete={true}/>
    )
  }
}

class NewNote extends Component {
  state = {
    note: {
      title: '',
      body: '',
      image: ''
    },
    exit: false
  }

  onSave = (e,note) => {
    const noteClone = {...note};
    noteClone.last_edit = new Date();
    newNote(noteClone);

    this.setState({exit: true});
  }

  render() {
    return (
      <NoteDetails note={this.state.note} exit={this.state.exit} onSave={this.onSave}/>
    )
  }
}

class NoteDetails extends Component {

  constructor (props) {
    super(props);
    this.state = {
      note: {
        title: props.note.title,
        body: props.note.body,
        image: props.note.image,
        id: props.note.id || ''
      },
      onSave: props.onSave,
      allowDelete: props.allowDelete
    }
  }

  onChange = (e) => {
    this.setState({ note: {...this.state.note,[e.target.name]: e.target.value }});
  }

  onSave = (e,note) => {
    e.preventDefault()
    this.props.onSave(e, note)
  }

  handleUpload = (e) => {
   //Make sure photo is uploaded before your alowed to save note;
   const file = e.target.files[0];
   if (file) {
     uploadImage(file).then((url) => {
       this.setState({note: {...this.state.note, image: url }});
       console.log(url,'url');
     })
   }
  }
  render() {
    const allowDelete = this.state.allowDelete;
    if (this.props.exit === true) {
      return <Redirect to="/notes" />
    }
    return (
      <div className="new-note-view page-view">
        <div className="page-header">
          <h1>{this.state.note.title || 'New note'}</h1>
          <div className="tab-btn-group">
            <Link to="/notes">
              <button className="btn second-btn btn-cancel ">Cancel</button>
            </Link>
            {allowDelete &&
              <button 
                className="btn second-btn btn-delete" 
                onClick={(e)=> this.props.onDelete(this.state.note.id, e)}>
                Delete
              </button>
            }
            <button 
              className="btn second-btn success btn-success" 
              onClick={(e)=> this.onSave(e,this.state.note)}>
              Save
            </button>
          </div>
        </div>
        <div className="page-body">
          <div className="note">
            <form>
              <input type="text" name="title" placeholder="New Note" value={this.state.note.title} onChange={this.onChange}/>
              <textarea name="body" value={this.state.note.body} onChange={this.onChange}/>
              <div className="control-area"> 
                <input type="file" name="Add Photo" onChange={this.handleUpload}/> 
              </div>
            </form>
            <div>
              {this.state.note.image.length > 0 &&
                <img src={this.state.note.image} alt="" />
              }
            </div>
          </div>
        </div>
       </div>
    )
  }
}


class EditCustomer extends Component {
  customer =   this.props.location.state.customer
  state = {
    customer: {
      name: this.customer.name || '',
      company: this.customer.company || '',
      email: this.customer.email || '',
      phone: this.customer.phone || '',
      address: this.customer.address || '',
      latLng: this.customer.latLng || {lat:37,lng:-122},
      id: this.customer.id
    },
    exit: false
  }

  onDelete = (id) => {
    deleteCustomer(id);
    this.setState({exit: true});
  }

  onSave = (customer) => {
    const customerClone = {...customer};
    customerClone.last_edit = new Date();
    console.log(customerClone,'edit on save');
    editCustomer(customerClone);

    this.setState({exit: true});
  }

  render() {
    return (
      <CustomerDetails 
        customer={this.state.customer} 
        onSave={this.onSave} 
        exit={this.state.exit} 
        allowDelete
        onDelete={this.onDelete}
      />
    )
  }
}
class NewCustomer extends Component {
  state = {
    customer: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      latLng: {lat:37,lng:-122}
    },
    exit: false
  }

  onSave = (customer) => {
    const customerClone = {...customer};
    customerClone.last_edit = new Date();
    newCustomer(customerClone);

    this.setState({exit: true});
  }
  render() {
    return (
      <CustomerDetails customer={this.state.customer} onSave={this.onSave} exit={this.state.exit} />
    )
  }
}

class CustomerDetails extends Component {
  constructor (props) {
    super(props);
    this.state = {
      customer: {
        name: props.customer.name,
        company: props.customer.company,
        email: props.customer.email,
        phone: props.customer.phone,
        address: props.customer.address,
        latLng: props.customer.latLng,
        id: props.customer.id || ''
      }
    }
  }

  onChange = (e) => {
    this.setState({ customer: {...this.state.customer,[e.target.name]: e.target.value }});
  }

  getLocation = (address) => {
    this.setState({customer:{...this.state.customer, address}})
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({customer:{...this.state.customer, latLng}})
      })
      .catch(error => console.error('Error', error))
  }

  onLocationChange = (address) => {
    this.setState({customer:{...this.state.customer, address}})
  }

  onSave = () => {
    this.props.onSave(this.state.customer);
  }
  headerDisplay = () => {
    const customer = this.state.customer,
    company = customer.company,
    name = customer.name;
    if (name && company) {
      return name + " : " + company;
    }else if (company) {
      return company;
    }else {
      return name;
    }
  }
  render() {
    const customer = this.state.customer,
      allowDelete = this.props.allowDelete;

    if (this.props.exit === true) {
      return <Redirect to="/customers" />
    }
    return (
      <div className="new-customer-view person-view page-view">
        <div className="page-header">
          <h1>{this.headerDisplay() || 'New Customer'}</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <Link to="/customers">
              <button className="btn second-btn btn-cancel ">Cancel</button>
            </Link>
            {allowDelete &&
              <button 
                className="btn second-btn btn-delete" 
                onClick={(e)=> this.props.onDelete(customer.id, e)}>
                Delete
              </button>
            }
            <Link to="/customers">
              <button className="btn second-btn btn-success" onClick={this.onSave}>Save customer</button>
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
                  <div className="col-2">
                    <div>
                      <div>
                        <label>
                          Name
                        </label>
                        <input type="text" value={customer.name} name="name" onChange={this.onChange} />
                      </div>
                      <div>
                        <label>
                          Company
                        </label>
                        <input type="text" value={customer.company} name="company" onChange={this.onChange}/>
                      </div>
                      <div>
                        <label>
                          Email
                        </label>
                        <input type="text" value={customer.email} name="email"  onChange={this.onChange}/>
                      </div>
                      <div>
                        <label>
                          Phone
                        </label>
                        <input type="text" value={customer.phone} name="phone" onChange={this.onChange}/>
                      </div>
                      <div>
                        <label>
                          Address
                        </label>
                        <LocationSearchInput 
                          getLocation={this.getLocation} 
                          onLocationChange={this.onLocationChange} 
                          address={this.state.customer.address}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="map">
                        <Map  latLng={this.state.customer.latLng}/>
                      </div>
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
