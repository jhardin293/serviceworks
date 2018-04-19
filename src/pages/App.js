import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
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
          <button className="job-btn"><img src={plus} alt="" /><span>New job</span></button>
        </div>
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
    );
  }
}

class Notes extends Component {
  render() {
    return (
      <div>
        <h1>Notes</h1>
      </div>
    )
  }
}

class Customers extends Component {
  render() {
    return (
      <div>
        <h1>Customers</h1>
      </div>
    )
  }
}


class Invoices extends Component {
  render() {
    return (
      <div>
        <h1>Invoices</h1>
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
