import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link,
  Redirect
} from 'react-router-dom'
import Popover from 'react-popover'
import onClickOutside from "react-onclickoutside";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

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

import chevron from './images/chevron.svg'

import plus from './images/plus.svg'

import noteImg1 from './images/note-img-1.jpg'

import threeDots from './images/three-dots.png'

import location from './images/location.png'
import employee from './images/employee.png'
import date from './images/date.png'
import customer from './images/customer.png'

import {ref} from '../config/constants';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const googleMapUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places';

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

class SideCalendar extends Component {
  render() {
    return (
      <aside className="side-calendar side-area">
        <div className="side-header">
          <Link to="/schedule/new-job">
            <button className="job-btn btn"><img src={plus} alt="" /><span>New job</span></button>
          </Link>
        </div>
        <DatePicker calendarClassName="in-line" inline />
      </aside>
    )
  }
}

//TODO build a Calander component that enacpsulates the custom toolbar and calendar
class Toolbar extends Component {
  static propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.node.isRequired,
    messages: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
  }
  navigate = action => {
    this.props.onNavigate(action);
  }
  view = view => {
    this.props.onViewChange(view);
  }
  render() {
    let { label, view, date } = this.props,
      month = label.split(" ")[0].substring(0, 3),
      dateToday = new Date(),
      dateSelected = new Date(date),
      isToday = true,
      pre, body;

    dateToday.setHours(0, 0, 0, 0);
    dateSelected.setHours(0, 0, 0, 0);
    if (dateToday.getTime() === dateSelected.getTime()) {
      isToday = true;
    } else {
      isToday = false;
    }

    switch (view) {
      case 'day':
        let day = label.split(" ")[0].substring(0, 3);
        let monthDay = label.split(" ").slice(1).join("");
        pre = day;
        body = monthDay;
        break;
      case 'week':
        let week = label.split(" ").slice(1).join("");
        pre = month;
        body = week;
        break;
      case 'month':
        let year = label.split(" ")[1];
        pre = month;
        body = year;
        break;
      default:
        pre = 'not';
        body = 'found';
    }


    return (
      <div className="calendar-toolbar">
        <div className="month-area">
          <button
            type="button"
            onClick={this.navigate.bind(null, 'PREV')}
          >
            <img src={chevron} alt="prev" />
          </button>
          <span className="month-label"><strong>{pre}</strong> {body}</span>
          <button
            type="button"
            onClick={this.navigate.bind(null, 'NEXT')}
          >
            <img src={chevron} alt="next" />
          </button>
        </div>
        <div className="view-area">
          <div className="view-switcher">
            <button
              type="button"
              onClick={this.view.bind(null, 'day')}
              className={cn({ 'rbc-active': view === 'day' })}
            >
              Day
            </button>
            <button
              type="button"
              onClick={this.view.bind(null, 'week')}
              className={cn({ 'rbc-active': view === 'week' })}
            >
              Week
            </button>
            <button
              type="button"
              onClick={this.view.bind(null, 'month')}
              className={cn({ 'rbc-active': view === 'month' })}
            >
              Month
            </button>
          </div>
          <button
            type="button"
            onClick={this.navigate.bind(null, 'TODAY')}
            className={"reset-day " + cn({ 'rbc-active': isToday })}
          >
            Today
          </button>

        </div>

      </div>
    )
  }
}

class CustomEvent extends Component {
  state = {
    isOpen: false,
  }
  handleSelect = (e) => {
    this.setState({isOpen: true});
  }
  handleClickOutside = (e) => {
    this.setState({isOpen: false});
  }
  render() {
    const job = this.props.event;
    const content = 
      <div className="details-popover ignore-react-onclickoutside"> 
        <div className="popover-header">
          <span>{job.title}</span>
          {/* <img src={closeDetails} alt="" onClick={this.handleClickOutside}/> */}
        </div>
        <ul>
          <li><img src={employee} alt=""/><span>{job.employees}</span></li>
          <li><img src={customer} alt=""/><span>{job.customer}</span></li>
          <li><img src={date} alt=""/><div className="stack"><span>Saturday, Apr 21, 2018</span><span>1:00 am - 2:00 am</span></div></li>
          <li><img src={location} alt=""/><div className="stack"><span>42 W 89th</span><span>New York, NY 10024</span></div></li>
        </ul>
        <div className="map">
          <MyMapComponent
            isMarkerShown
            googleMapURL={googleMapUrl}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
        <div className="details"><span><Link to="/schedule/new-job">show job details</Link></span></div>
            
      </div>;

    return (
      <div className="PopOver" onClick={this.handleSelect}>
          <Popover  isOpen={this.state.isOpen} body={content} preferPlace='below'>
            <div>{this.props.event.title}</div>
          </Popover>
      </div>
    );
  }
}
const DetailsPopover = onClickOutside(CustomEvent);  
//Refactor to remove plugin popover has an event for outside events

let jobId = 0;
let events = [];

class Schedule extends Component {
  state = {
    openNewJob: false,
  }

  componentWillMount() {
    ref.collection('jobs').get().then((snap) => {
      snap.forEach((doc) => {
        events.push(doc.data());
      })
    })   
    // console.log(ref, 'ref');
  }

  render() {
    if (this.state.openNewJob) {
      return <Redirect push to="/schedule/new-job" />
    }
    return (
      <div className="schedule-view page-view">
        <div className="calendar-wrapper">
          <BigCalendar
            className="calendar"
            events={events}
            defaultDate={new Date()}
            components={{ toolbar: Toolbar, event: DetailsPopover }}
            views={['day', 'week', 'month']}
            selectable
          />
        </div>
        <SideCalendar />
      </div>
    );
  }
}

class NewJob extends Component {
  state = {
    startDate: moment(),
    endDate: moment(),
    employeesSelected: [''],
    selectedCustomer: '',
    title: '',
    newJobCreated: false,
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCustomer = (selectedCustomer) => {
    this.setState({ selectedCustomer });
  }

  handleChange = ({ startDate, endDate }) => {
    startDate = startDate || this.state.startDate
    endDate = endDate || this.state.endDate

    if (startDate.isAfter(endDate)) {
      endDate = startDate
    }

    this.setState({ startDate, endDate })
  }
  handleChangeStart = (startDate) => this.handleChange({ startDate })

  handleChangeEnd = (endDate) => this.handleChange({ endDate })

  handleSelectChange = (value) => {
    this.setState({ employeesSelected: value });
  }
  onSubmit = () => {
    let newJob = {
      start:new Date(this.state.startDate),
      end: new Date(this.state.endDate),
      title: this.state.title,
      id: jobId++,
      customer: this.state.selectedCustomer.value ,
      employees: [this.state.employeesSelected[0].value],
      location: ''
    }

    events.push(newJob);
    this.setState({newJobCreated: true});

    ref.collection('jobs').add(newJob);
  }
  render() {
    const { selectedCustomer, employeesSelected } = this.state;
    if (this.state.newJobCreated === true) {
      return <Redirect to="/" />
    }
    return (
      <div className="new-job-view page-view">
        <div className="page-header">
          <h1>{this.state.title || 'New Job'}</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <Link to="/">
              <button className="btn second-btn ">Cancel</button>
            </Link>
            <button className="btn second-btn btn-success" onClick={this.onSubmit}>Save</button>
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
                    value={this.state.title}
                  />
                </div>
                <div className="input-group date-picker-group">
                  <div className="pickers">
                    <div>
                      <label>Starts</label>
                      <DatePicker
                        selected={this.state.startDate}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
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
                        selected={this.state.endDate}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
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
                    3 Hours
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
                          value={selectedCustomer}
                          onChange={this.handleCustomer}
                          searchable
                          options={[
                            { value: 'Billy Joel', label: 'Billy Joel' },
                            { value: 'Sarah Ann', label: 'Sarah Ann' },
                          ]}
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
                          value={employeesSelected}
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
                  <MyMapComponent
                    isMarkerShown
                    googleMapURL={googleMapUrl}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
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

class Notes extends Component {
  render() {
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
        </div>
      </div>
    )
  }
}

class NewNote extends Component {
  state = {
    title: '',
  }
  handleTitle = (e) => {
    this.setState({title: e.target.value});
  }
  render() {
    return (
      <div className="new-note-view page-view">
        <div className="page-header">
          <h1>{this.state.title || 'New note'}</h1>
          <Link to="/notes">
            <button className="btn second-btn">Cancel</button>
          </Link>
        </div>
        <div className="page-body">
          <div className="note">
            <form>
              <input type="text" placeholder="New Note" value={this.state.title} onChange={this.handleTitle}/>
              <textarea />
              <div className="control-area"> 
                <button className="btn second-btn">Add Photo</button>
                <button className="btn second-btn success">Save</button>
              </div>
            </form>
          </div>
        </div>
       </div>
    )
  }
}

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: 37.9678761, lng: -121.7594383 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: 37.9678761, lng: -121.7594383 }} />}
  </GoogleMap>
))

class NewCustomer extends Component {
  render() {
    return (
      <div className="new-customer-view person-view page-view">
        <div className="page-header">
          <h1>New Customer</h1>
        </div>
        <div className="page-body">
          <div className="tab-btn-group">
            <Link to="/customers">
              <button className="btn second-btn btn-success">Save customer</button>
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
                        <MyMapComponent
                          isMarkerShown
                          googleMapURL={googleMapUrl}
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: `100%` }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                        />
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

class Customers extends Component {
  render() {
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
                <tr>
                  <td><Link to="customers/new-customer">Sally May</Link></td>
                  <td>Mc Donalds</td>
                  <td>sallyma@gmail.com</td>
                  <td>415-747-2345</td>
                </tr>
                <tr>
                  <td><Link to="customers/new-customer">Sally May</Link></td>
                  <td>Mc Donalds</td>
                  <td>sallyma@gmail.com</td>
                  <td>415-747-2345</td>
                </tr>
                <tr>
                  <td><Link to="customers/new-customer">Sally May</Link></td>
                  <td>Mc Donalds</td>
                  <td>sallyma@gmail.com</td>
                  <td>415-747-2345</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

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
    selectedCustomer: '',
    selectedBilling: '',
  }
  handleCustomer = (selectedCustomer) => {
    this.setState({ selectedCustomer });
  }
  handleDate = (date) => {
    this.setState({ startDate: date });
  }
  handleBilling = (option) => {
    this.setState({ selectedBilling: option });
  }
  render() {
    const { selectedCustomer, selectedBilling } = this.state;
    return (
      <div className="new-invoice-view page-view">
        <div className="page-header">
          <h1>Bathroom tiling</h1>
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
                    value={selectedCustomer}
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
                      selected={this.state.startDate}
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
              <h2>$250.56</h2>
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
                          <span className="line-value">$100</span>
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
                          <span className="line-value">$100</span>
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
                          <span className="line-value">$100</span>
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
          <MyMapComponent
            isMarkerShown
            googleMapURL={googleMapUrl}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
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
                        <MyMapComponent
                          isMarkerShown
                          googleMapURL={googleMapUrl}
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: `100%` }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                        />
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
                        <MyMapComponent
                          isMarkerShown
                          googleMapURL={googleMapUrl}
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: `100%` }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                        />
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
          <Route exact path="/notes/new-note" component={NewNote} />
          <Route exact path="/customers/new-customer" component={NewCustomer} />
          <Route exact path="/invoices/new-invoice" component={NewInvoice} />
          <Route exact path="/my-account/new-employee" component={NewEmployee} />
        </div>
      </Router>
    );
  }
}

export default App;
