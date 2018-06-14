import React, { Component } from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import { Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import cn from 'classnames'
import { arrayToSentence } from '../../libs/array-to-sentence'
import Popover from 'react-popover'
import onClickOutside from "react-onclickoutside";
import BigCalendar from 'react-big-calendar'
import Map from '../../components/Map'

import { getJobs } from '../../actions'

import plus from '../../images/plus.svg'
import chevron from '../../images/chevron.svg'
import employee from '../../images/employee.png'
import date from '../../images/date.png'
import customer from '../../images/customer.png'
import location from '../../images/location.png'


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class SideCalendar extends Component {
  static propTypes = {
    jobs: PropTypes.array.isRequired,
    handleSelect: PropTypes.func.isRequired 
  }

  render() {
    const highlightDates = this.props.jobs.map((job) => {
      return moment(job.start)
    })

    return (
      <aside className="side-calendar side-area">
        <div className="side-header">
          <Link to="/schedule/new-job">
            <button className="job-btn btn"><img src={plus} alt="" /><span>New job</span></button>
          </Link>
        </div>
        <DatePicker 
          calendarClassName="in-line" 
          inline 
          highlightDates={highlightDates}
          onSelect={this.props.handleSelect}
        />
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
  static propTypes = {
    event: PropTypes.object.isRequired,
  }

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
    const employees = arrayToSentence(job.employees.map((employee, idx) => employee.label));
    const content = 
    <div className="details-popover ignore-react-onclickoutside"> 
      <div className="popover-header">
        <span>{job.title}</span>
        {/* <img src={closeDetails} alt="" onClick={this.handleClickOutside}/> */}
      </div>
      <ul>
        <li><img src={employee} alt=""/>{employees}</li>
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
    view: 'month',
    selectedDay: new Date()
  }

  componentWillMount() {
    this.props.getJobs();
  }

  handleSelect = (date) => {
    this.setState({view: 'day', selectedDay: date.toDate()});
  }

  onView = (view) => {
    console.log(view);
    this.setState({view})
  }

  onNavigate = (nav) => {
    console.log(nav);
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
            date={this.state.selectedDay}
            onNavigate={this.onNavigate}
            views={['day', 'week', 'month']}
            view={this.state.view}
            onView={this.onView}
          />
        </div>
        <SideCalendar jobs={jobs} handleSelect={this.handleSelect}/>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  jobs: state.jobs
});
export const Schedule = connect(mapStateToProps, {getJobs})(ScheduleComp);

