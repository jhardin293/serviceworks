import React, { Component } from 'react'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link,
  Redirect
} from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Map  from '../components/Map'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-tabs/style/react-tabs.css'
import 'react-select/dist/react-select.css'
import './App.css'

import logoImg from './images/AtomFlower.svg'
import schedule from './images/schedule.svg'
import notes from './images/notes.svg'
import customers from './images/customers.svg'
import invoices from './images/invoices.svg'
import map from './images/map.svg'
import gear from './images/gear.svg'


import plus from './images/plus.svg'

import noteImg1 from './images/note-img-1.jpg'

import threeDots from './images/three-dots.png'

import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

import {
  newJob,
  editJob,
  deleteJob,
  getNotes,
  newNote,
  editNote,
  deleteNote,
  uploadImage,
  getCustomers,
  newCustomer,
  editCustomer,
  deleteCustomer
} from '../actions'
import { store } from '../store'

import { Schedule } from './Schedule'

momentDurationFormatSetup(moment);

class SideNav extends Component {
  render() {
    return (
      <aside className="side-nav">
        <div className="logo">
          <img src={logoImg} alt="logo" width="25" height="28" />
          <h2>Serviceworks</h2>
        </div>
        <div className="nav-items">
          <ul>
            <li>
              <NavLink to="/schedule">
                <img src={schedule} alt="" />
                <span>Schedule</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/notes">
                <img src={notes} alt="" />
                <span>Notes</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/customers">
                <img src={customers} alt="" />
                <span>Customers</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/invoices">
                <img src={invoices} alt="" />
                <span>Invoices</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/team-map">
                <img src={map} alt="" />
                <span>Map</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-account">
                <img src={gear} width="20" height="20" alt="" />
                <span>My account</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    )
  }
}

class JobDetailsComp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      job: {
        start: moment(props.job.start),
        end: moment(props.job.end),
        employees:  props.job.employees,
        customer: props.job.customer,
        title: props.job.title,
        id: props.job.id || '',
        latLng: props.job.latLng, 
        address: props.job.address || '',
      },
      exit: props.exit,
      allowDelete: props.allowDelete,
    }
  }

  onChange = (e) => {
    this.setState({ job: {...this.state.job,[e.target.name]: e.target.value }});
  }

  componentWillMount() {
    this.props.getCustomers();
  }

  getLocation = (address) => {
    this.setState({job:{...this.state.job, address}})
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({job:{...this.state.job, latLng}})
        console.log('Success', latLng);
      })
      .catch(error => console.error('Error', error))
  }

  onLocationChange = (address) => {
    console.log(address, 'chang');
    this.setState({job:{...this.state.job, address}})
  }


  handleCustomer = (customer) => {
    if (customer.address && customer.latLng) {
      this.setState({job: {...this.state.job, customer, latLng: customer.latLng, address: customer.address  }});
    }else {
      this.setState({job: {...this.state.job, customer }});
    }
  }

  handleChange = ({ start, end }) => {
    start = start || this.state.job.start
    end = end || this.state.job.end

    if (start.isAfter(end)) {
      end = start
    }
    this.setState({job: {...this.state.job, start, end }});
  }
  handleChangeStart = (start) => this.handleChange({ start })

  handleChangeEnd = (end) => this.handleChange({ end })

  handleSelectChange = (value) => {
    this.setState({job: {...this.state.job, employees: value }});
  }

  handleMarkerClick = () => {
    console.log(arguments, 'clicked')
  }
  render() {
    const customers = this.props.customers.customers;
    let customersList = []
    const { customer, employees, start, end } = this.state.job;
    const allowDelete = this.state.allowDelete;
    const duration =  moment.duration(end.diff(start)).format("d [days]  h [hours]  m [minutes]");
    if (this.props.exit === true) {
      return <Redirect to="/" />
    }
    if (customers.length !== 0) {
     customers.forEach((customer) => {
      customersList.push(
        {
          label: customer.name,
          latLng: customer.latLng,
          address: customer.address
        }
      );
     }) 
    }
    return (
      <div className="new-job-view page-view">
        <div className="page-header">
          <h1>{this.state.job.title || 'New Job'}</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <Link to="/">
              <button className="btn second-btn btn-cancel ">Cancel</button>
            </Link>
            {allowDelete &&
              <button 
                className="btn second-btn btn-delete" 
                onClick={(e)=> this.props.onDelete(this.state.job.id, e)}>
                Delete
              </button>
            }
            <button 
              className="btn second-btn btn-success" 
              onClick={(e)=> this.props.onSave(this.state.job, e)}>
              Save
            </button>
          </div>
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
            </TabList>

            <TabPanel>
              <form className="person-form">
                <div className="input-group">
                  <input 
                    type="text" 
                    name="title"
                    placeholder="Job title" 
                    onChange={this.onChange} 
                    value={this.state.job.title}
                  />
                </div>
                <div className="input-group date-picker-group">
                  <div className="pickers">
                    <div>
                      <label>Starts</label>
                      <DatePicker
                        selected={this.state.job.start}
                        selectsStart
                        start={this.state.job.start}
                        end={this.state.job.end}
                        onChange={this.handleChangeStart}
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        showTimeSelect
                        dateFormat="LLL"
                        calendarClassName="time-range-picker"
                      />
                    </div>
                    <div>
                      <label>Ends</label>
                      <DatePicker
                        selected={this.state.job.end}
                        selectsEnd
                        start={this.state.job.start}
                        end={this.state.job.end}
                        onChange={this.handleChangeEnd}
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        showTimeSelect
                        dateFormat="LLL"
                        calendarClassName="time-range-picker"
                      />
                    </div>
                  </div>
                  <div className="time-range">
                    <span className="bordered-group"></span>
                    {duration}
                  </div>
                </div>
                <div className="input-group">
                  <div className="col-2">
                    <div className="panel">
                      <div className="header">
                        <h2>Customer</h2>
                      </div>
                      <div className="panel-body">
                        <Select
                          name="form-field-name"
                          value={customer}
                          onChange={this.handleCustomer}
                          searchable
                          options={customersList}
                        />
                      </div>
                    </div>
                    <div className="panel">
                      <div className="header">
                        <h2>Employees</h2>
                      </div>
                      <div className="panel-body">
                        <Select
                          name="form-field-name"
                          multi
                          value={employees}
                          onChange={this.handleSelectChange}
                          searchable
                          className="tags"
                          options={[
                            { value: 'Billy Joel', label: 'Billy Joel' },
                            { value: 'Sarah Ann', label: 'Sarah Ann' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-2">
                  </div>
                </div>
                <div className="map">
                  <MapSearch 
                    getLocation={this.getLocation} 
                    address={this.state.job.address} 
                    latLng={this.state.job.latLng}
                    onLocationChange={this.onLocationChange}
                  />
                </div>
              </form>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    )
  }
}
const JobDetails = connect(state => ({ customers: state.customers}), {getCustomers})(JobDetailsComp);

class NewJob extends Component {
  state = {
    job : {
      start: moment(),
      end: moment(),
      employees:  [''],
      customer: '',
      title:  '',
      latLng: {
        lat: 37.7749295,
        lng: -122.41941550000001 
      },
    },
    exit: false,
  }

  onSave = (job) => {
    const jobClone = {...job};
    jobClone.start = new Date(jobClone.start);
    jobClone.end = new Date(jobClone.end);
    newJob(jobClone);

    this.setState({exit: true});
  }
  render() {
    return (
      <JobDetails job={this.state.job} onSave={this.onSave}  exit={this.state.exit}/>
    )
  }  
}

class EditJob extends Component {
  job =   this.props.location.state.job
  state = {
    job : {
      start: moment(this.job.start),
      end: moment(this.job.end),
      employees: this.job.employees,
      customer: this.job.customer,
      title:  this.job.title,
      id: this.job.id,
      latLng: this.job.latLng,
      address: this.job.address
    },
    exit: false,
  }
  onSave = (job) => {
    const jobClone = {...job};
    jobClone.start = new Date(jobClone.start);
    jobClone.end = new Date(jobClone.end);
    editJob(jobClone);

    this.setState({exit: true});
  }

  onDelete = (id) => {
    deleteJob(id);
    this.setState({exit: true});
  }

  render() {
    return (
      <JobDetails 
        job={this.state.job} 
        onSave={this.onSave} 
        onDelete={this.onDelete}
        exit={this.state.exit} 
        allowDelete="true"
      />
    )
  }  
}

class LocationSearchInput extends Component {
  state = {
    address: this.props.address
  }
 
 
  render() {
    return (
      <PlacesAutocomplete
        value={this.props.address}
        onChange={this.props.onLocationChange}
        onSelect={this.props.getLocation}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input'
              })}
            />
            <div className="autocomplete-dropdown-container">
              {suggestions.map(suggestion => {
                const className = 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div {...getSuggestionItemProps(suggestion, { className, style })}>
                    <span>{suggestion.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}


 

class MapSearch extends Component {
  render() {
    return (
      <div className="map-search">
        <LocationSearchInput 
          getLocation={this.props.getLocation} 
          onLocationChange={this.props.onLocationChange} 
          address={this.props.address}
        />
        <Map latLng={this.props.latLng} />
      </div>
    )
  }
}
 




class NotesComp extends Component {

  componentWillMount() {
    this.props.getNotes();
  }
  render() {
    const notes = this.props.notes.notes.sort((a,b)=> {
      return b.last_edit - a.last_edit; 
    });

    const notesList = notes.map((note)=> {
      return (
        <Link 
          key={note.id}
          className="note"
          to={{
            pathname: "/notes/edit-note",
            state: {note}
        }} >
            <div className="note-left">
              <div className="note-text">
                <div className="note-title">{note.title}</div>
                <div className="note-body">
                  <p>{note.body}</p>
                </div>
              </div>
              <div className="note-img">
                <img src={note.image} alt="note-img" />
              </div>
            </div>
            <div className="note-right">
              <div className="note-created ">
                <span>{moment(note.last_edit).format('L')}</span>
                <span>{moment(note.last_edit).format('LT')}</span>
              </div>
            </div>
        </Link>
      )
    })
    return (
      <div className="notes-view page-view">
        <div className="page-header">
          <h1>Notes</h1>
          <Link to="notes/new-note">
            <button className="notes-btn btn"><img src={plus} alt="" /><span>New note</span></button>
          </Link>
        </div>
        <div className="page-body">
          <div className="notes-list-wrapper">
            <div className="notes-list panel">
              <div className="header">
                <h2>Note text</h2>
                <h2>Updated</h2>
              </div>
              <div className="panel-body">
                <div className="sort-group">
                  {/* <div className="month-group"><span>March 2018</span></div> */}
                  <div className="group-body">
                    {notesList}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapNoteStateToProps = state => ({
  notes: state.notes
});
const Notes = connect(mapNoteStateToProps, {getNotes})(NotesComp);


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

class CustomersComp extends Component {
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
const Customers = connect(state => ({ customers: state.customers}), {getCustomers})(CustomersComp);

class Invoices extends Component {
  render() {
    return (
      <div className="invoice-view page-view">
        <div className="page-header">
          <h1>Invoices</h1>
          <Link to="/invoices/new-invoice">
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

class TeamMap extends Component {
  render() {
    return (
      <div className="map-view page-view">
        <div className="map">
          <Map  latLng={{lat:37,lng:-122}}/>
        </div>
        <aside className="side-area">
          <div className="side-header">
            <h2>Customers</h2>
            <hr />
          </div>
          <div className="side-body">
            <div className="customer">
              <label><input type="checkbox" /><span>All Customers</span></label>
            </div>
            <div className="customer">
              <label><input type="checkbox" /><span>Jim Jones</span></label>
            </div>
            <div className="customer">
              <label><input type="checkbox" /><span>Lilly Mack</span></label>
            </div>
            <div className="customer">
              <label><input type="checkbox" /><span>Sammy Brown</span></label>
            </div>
            <button className="btn second-btn btn-success">Add Customer</button>
          </div>
        </aside>
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

class MyAccount extends Component {
  render() {
    return (
      <div className="account-view page-view">
        <div className="page-header">
          <h1>My account</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <button className="btn second-btn btn-success">Save account</button>
          </div>
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Team</Tab>
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
                      <input type="text" placeholder="Company" />
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
                <h2>BensWorth Cleaning Company</h2>
                <Link to="/my-account/new-employee">
                  <button className="invoice-btn btn"><img src={plus} alt="" /><span>New employee</span></button>
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
                    <tr>
                      <td><Link to="/my-account/new-employee">Benny Himsworth</Link></td>
                      <td>bhimsworth@gmail.com</td>
                      <td>343-234-9292</td>
                      <td>Owner</td>
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
