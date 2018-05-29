import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import BigCalendar from 'react-big-calendar'
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
import Popover from 'react-popover'
import onClickOutside from "react-onclickoutside";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'


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

import {ref} from '../config/constants'

import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { combineReducers } from 'redux'
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

momentDurationFormatSetup(moment);
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));


//Actions 
const getJobs = () => {
  return (dispatch) => {
    let jobs = []
    ref.collection('jobs').get().then((snap) => {
      snap.forEach((doc) => {
        jobs.push(doc.data());
      })
      dispatch({
        type: 'GET_JOBS',
        payload: jobs,
        status: 'success'
      })
    })   
  }
}

const newJob = (job) => {
  const jobRef = ref.collection('jobs').doc();
  job.id = jobRef.id;

  jobRef.set(job)
    .then((job) => {
      store.dispatch({
        type: 'GET_JOBS',
        status: 'pending',
        payload: store.getState().jobs.jobs
      })
     store.dispatch(getJobs());
    })
}

const editJob = (job) => {
  const jobRef = ref.collection('jobs').doc(job.id);

  jobRef.update(job)
    .then((job) => {
      store.dispatch({
        type: 'GET_JOBS',
        status: 'pending',
        payload: store.getState().jobs.jobs
      })
     store.dispatch(getJobs());
    })
}

const deleteJob = (id) => {
  const jobRef = ref.collection('jobs').doc(id);
  jobRef.delete()
    .then(() => {
      store.dispatch({
        type: 'GET_JOBS',
        status: 'pending',
        payload: store.getState().jobs.jobs
      })
     store.dispatch(getJobs());
    })
}



//Reducers
//I just want a reducer that controrls the jobs array
const jobsInitState = {
  jobs: [],
  status: 'init'
}
//So can I genericly call a dispatfh funcition with a string and payload and it automagicaly gets handled by the correct reducer.
//How big does an average reducer get?
//If I cant change the route of the view in the reducer do I change in it in a action or do I have to update the strore so that it is reflected in a a HOC?
const jobsReducer = (state = jobsInitState, action) => {
  switch(action.type) {
    case 'GET_JOBS':
      return {
        ...state,
        status: action.status,
        jobs: action.payload
      }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  jobs: jobsReducer
})

//Store
const initialState = {};
const middleware = [thunk];
const store = createStore(
  rootReducer, 
  initialState, 
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

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
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
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

class MapMarker extends Component {
  render() {
    return(
      <div 
      >
          <h1>JUStin</h1>
      </div>
    )
  }
}

 
class Map extends Component {
  static defaultProps = {
    zoom: 11,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
        <div style={{ height: '100%', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDA4lSVtu-jB1h7VbTCTpSGf_Qv5UEuS6A'}}
            defaultZoom={this.props.zoom}
            center={[this.props.latLng.lat,this.props.latLng.lng]}
          >
            <MapMarker
              lat={this.props.latLng.lat}
              lng={this.props.latLng.lng}
            />

          </GoogleMapReact>
        </div>
    );
  }
}

class MapSearch extends Component {


  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <LocationSearchInput  getLocation={this.props.getLocation} onLocationChange={this.props.onLocationChange} address={this.props.address}/>
        <Map latLng={this.props.latLng} />
      </div>
    )
  }
}
 

class SideNav extends Component {
  render() {
    return (
      <aside className="side-nav">
        <div className="logo">
          <img src={logoImg} alt="logo" width="25" height="28" />
          <h2>Despacito</h2>
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
    const job = this.props.event,
          start = moment(job.start),
          end = moment(job.end);
    const duration =  moment.duration(end.diff(start)).format("d [days]  h [hours]  m [minutes]");
    console.log(start,'duration');
    const content = 
    <div className="details-popover ignore-react-onclickoutside"> 
      <div className="popover-header">
        <span>{job.title}</span>
        {/* <img src={closeDetails} alt="" onClick={this.handleClickOutside}/> */}
      </div>
      <ul>
        <li><img src={employee} alt=""/><span>{job.employees[0].label}</span></li>
        <li><img src={customer} alt=""/><span>{job.customer.label}</span></li>
        <li>
          <img src={date} alt=""/>
          <div className="stack">
            <span>{start.format('lll')}</span>
            <span>{end.format('lll')}</span>
            <span>{duration}</span>
          </div>
        </li>
        <li>
          <img src={location} alt=""/>
          <div className="stack"><span>{job.address}</span></div>
        </li>
      </ul>
      <div className="map">
        <Map latLng={job.latLng} />
      </div>
      <div className="details">
        <span>
          <Link 
            to={{
              pathname: "/schedule/edit-job",
              state: {job}
              }} >
            show job details
          </Link>
        </span>
      </div>
          
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


class ScheduleComp extends Component {
  static propTypes = {
    jobs: PropTypes.object.isRequired,
    getJobs: PropTypes.func.isRequired
  }
  state = {
    openNewJob: false,
  }

  componentWillMount() {
    this.props.getJobs();
  }

  render() {
    //Is the double nested structure correct?
    let jobs = this.props.jobs.jobs;
    if (this.state.openNewJob) {
      return <Redirect push to="/schedule/new-job" />
    }
    return (
      <div className="schedule-view page-view">
        <div className="calendar-wrapper">
          <BigCalendar
            className="calendar"
            events={jobs}
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
const mapStateToProps = state => ({
  jobs: state.jobs
});
const Schedule = connect(mapStateToProps, {getJobs})(ScheduleComp);




class JobDetails extends Component {
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
      allowDelete: props.allowDelete
    }
  }

  onChange = (e) => {
    this.setState({ job: {...this.state.job,[e.target.name]: e.target.value }});
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
    this.setState({job: {...this.state.job, customer }});
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
    console.log(this.state.job,'jobinit');
    const { customer, employees, start, end } = this.state.job;
    const allowDelete = this.state.allowDelete;
    console.log(end,'end');
    const duration =  moment.duration(end.diff(start)).format("d [days]  h [hours]  m [minutes]");
    if (this.props.exit === true) {
      return <Redirect to="/" />
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
            <Route exact path="/customers/new-customer" component={NewCustomer} />
            <Route exact path="/invoices/new-invoice" component={NewInvoice} />
            <Route exact path="/my-account/new-employee" component={NewEmployee} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
