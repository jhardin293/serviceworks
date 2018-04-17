import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

import logoImg from './images/AtomFlower.svg'
import schedule from './images/schedule.svg'
import notes from './images/notes.svg'
import customers from './images/customers.svg'
import invoices from './images/invoices.svg'
import map from './images/map.svg'
import gear from './images/gear.svg'

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
            <li className="active">
              <a>
                <img src={schedule} alt=""/>
                <span>Schedule</span>
              </a>
            </li>
            <li>
              <a>
                <img src={notes} alt=""/>
                <span>Notes</span>
              </a>
            </li>
            <li>
              <a>
                <img src={customers} alt=""/>
                <span>Customers</span>
              </a>
            </li>
            <li>
              <a>
                <img src={invoices} alt=""/>
                <span>Invoices</span>
              </a>
            </li>
            <li>
              <a>
                <img src={map} alt=""/>
                <span>Team map</span>
              </a>
            </li>
            <li>
              <a>
                <img src={gear} width="20" height="20" alt=""/>
                <span>My account</span>
              </a>
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
      <DatePicker inline />
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
    console.log(action);
    this.props.onNavigate(action);
  }
  render () {
    let {messages, label} = this.props;
    return (
      <div>
        <button
          type="button"
          onClick={this.navigate.bind(null, 'PREV')}
        >
          {messages.previous}
        </button>
        <span>{label}</span>
        <button
          type="button"
          onClick={this.navigate.bind(null, 'NEXT')}
        >
          {messages.next}
        </button>
      </div>
    )
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      calendar : {
        'months': 0
      },
      selectedDate: moment()._d
    };
  }
  handleNavigate (date, view, action) {
    console.log("date:", date, "view:", view, "action:" ,action);
  }
  render() {
    let events = [];
    return (
      <div className="main-content">
        <SideNav />
        <div className="schedule-view">
          <div className="calendar-wrapper">
            <BigCalendar 
              className="calendar" 
              events={events} 
              defaultDate={new Date()}
              components={{toolbar: Toolbar}}
              onNavigate={this.handleNavigate}
             />
          </div>
          <SideCalendar />
        </div>
      </div>
    );
  }
}

export default App;
