import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
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

import chevron from './images/chevron.svg'

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
    this.props.onNavigate(action);
  }
  view = view => {
    this.props.onViewChange(view);
  }
  render () {
    let {messages, label} = this.props,
      month = label.split(" ")[0].substring(0,3),
      year = label.split(" ")[1],
      view = this.props.view

    return (
      <div className="calendar-toolbar">
        <div className="month-area">
          <button
            type="button"
            onClick={this.navigate.bind(null, 'PREV')}
          >
            <img src={chevron} alt="prev"  />
          </button>
          <span className="month-label"><strong>{month}</strong> {year}</span>
          <button
            type="button"
            onClick={this.navigate.bind(null, 'NEXT')}
          >
            <img src={chevron} alt="next"/>
          </button>
        </div>
        <div className="view-area">
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
          <button
            type="button"
            onClick={this.navigate.bind(null, 'TODAY')}
          >
            {messages.today}
          </button>

        </div>
       
      </div>
    )
  }
}
class App extends Component {
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
              views={['day', 'week', 'month']}
             />
          </div>
          <SideCalendar />
        </div>
      </div>
    );
  }
}

export default App;
