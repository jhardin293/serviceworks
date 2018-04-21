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
  NavLink
} from 'react-router-dom'

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

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class SideNav extends Component {
  render() {
    return (
      <aside className="side-nav">
        <div className="logo">
          <img src={logoImg}  alt="logo" width="25" height="28" />
          <h2>Serviceworks</h2>
        </div>
        <div className="nav-items">
          <ul>
            <li>
              <NavLink to="/" exact>
                <img src={schedule} alt=""/>
                <span>Schedule</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/notes">
                <img src={notes} alt=""/>
                <span>Notes</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/customers">
                <img src={customers} alt=""/>
                <span>Customers</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/invoices">
                <img src={invoices} alt=""/>
                <span>Invoices</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/team-map">
                <img src={map} alt=""/>
                <span>Team map</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-account">
                <img src={gear} width="20" height="20" alt=""/>
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
  render () {
    return (
      <aside className="side-calendar">
        <div className="side-header">
          <button className="job-btn btn"><img src={plus} alt="" /><span>New job</span></button>
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
  render () {
    let {label, view, date} = this.props,
    month = label.split(" ")[0].substring(0,3),
    dateToday = new Date(),
    dateSelected = new Date(date),
    isToday = true,
    pre,body;

    dateToday.setHours(0,0,0,0);
    dateSelected.setHours(0,0,0,0);
    if (dateToday.getTime() === dateSelected.getTime()) {
      isToday = true;
    }else {
      isToday = false;
    }

    switch(view) {
      case 'day':
        let day = label.split(" ")[0].substring(0,3);
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
            <img src={chevron} alt="prev"  />
          </button>
          <span className="month-label"><strong>{pre}</strong> {body}</span>
          <button
            type="button"
            onClick={this.navigate.bind(null, 'NEXT')}
          >
            <img src={chevron} alt="next"/>
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
            className={"reset-day " + cn({'rbc-active': isToday })}
          >
            Today
          </button>

        </div>
       
      </div>
    )
  }
}

class Schedule extends Component {
  render() {
    let events = [];
    return (
        <div className="schedule-view page-view">
          <div className="calendar-wrapper">
            <BigCalendar 
              className="calendar" 
              events={events} 
              defaultDate={new Date()}
              components={{toolbar: Toolbar}}
              views={['day', 'week', 'month']}
             />
          </div>
          <SideCalendar />
        </div>
    );
  }
}

class Notes extends Component {
  render() {
    return (
      <div className="notes-view page-view">
        <div className="page-header">
          <h1>Notes</h1>
          <button className="notes-btn btn"><img src={plus} alt="" /><span>New note</span></button>
        </div>
        <div className="page-body">
          <div className="notes-list-wrapper">
            <div className="notes-list">
              <div className="header">
                <h2>Note text</h2>
                <h2>Created</h2>
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
                        <img src={noteImg1} alt="note-img"/>
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
                        <img src={noteImg1} alt="note-img"/>
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
                        <img src={noteImg1} alt="note-img"/>
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
                        <img src={noteImg1} alt="note-img"/>
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
                        <img src={noteImg1} alt="note-img"/>
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
    )
  }
}

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
  </GoogleMap>
))

class Customers extends Component {
  render() {
    return (
      <div className="customers-view page-view">
        <div className="page-header">
          <h1>New Customer</h1>
        </div>
        <div className="page-body">
          <button className="btn second-btn customer-btn btn-success">Save customer</button>
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Jobs</Tab>
              <Tab>Notes</Tab>
              <Tab>Invoices</Tab>
            </TabList>

            <TabPanel>
              <form>
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
                          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
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
              <h2>Any content 2</h2>
            </TabPanel>
            <TabPanel>
              <h2>Any content 1</h2>
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
          </Tabs>
        </div>

      </div>
    )
  }
}


class Invoices extends Component {
  state = {
    selectedCustomer: '',
  }
  handleCustomer = (selectedCustomer) => {
    this.setState({selectedCustomer});
  }
  handleDate = (date) =>  {
    this.setState({startDate: date });
  }
  render() {
    const { selectedCustomer } = this.state; 
    return (
      <div className="invoice-view page-view">
        <div className="page-header">
          <h1>Bathroom tiling</h1>
          <button className="btn second-btn btn-success">Save invoice</button>
        </div>
        <div className="page-body">
          <form className="invoice-header">
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
                  <input type="text" placeholder="Pending" disabled="true"/>
                </div>
                <div>
                  <label>Sent Date</label>
                  <input type="text" placeholder="Not sent" disabled="true"/>
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
                  <input type="text" placeholder="Untitled invoice"/>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

class TeamMap extends Component {
  render() {
    return (
      <div>
        <h1>Team map</h1>
      </div>
    )
  }
}
class MyAccount extends Component {
  render() {
    return (
      <div>
        <h1>My account</h1>
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
        <Route exact path="/" component={Schedule}/>
        <Route path="/notes" component={Notes}/>
        <Route path="/customers" component={Customers}/>
        <Route path="/invoices" component={Invoices}/>
        <Route path="/team-map" component={TeamMap}/>
        <Route path="/my-account" component={MyAccount}/>
      </div>
      </Router>
    );
  }
}

export default App;
