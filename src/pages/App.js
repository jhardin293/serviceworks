import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

import logoImg from './images/AtomFlower.svg';
import schedule from './images/schedule.svg';
import notes from './images/notes.svg';
import customers from './images/customers.svg';
import invoices from './images/invoices.svg';
import map from './images/map.svg';
import gear from './images/gear.svg';

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
  navigate = action => {
    console.log(action,'action', this.state.selectedDate);
    let newIdx =  this.state.calendar.months;
    if (action === 'NEXT') {
      newIdx = newIdx + 1;
    }else {
      newIdx = newIdx - 1;
    }

    this.setState({calendar : {'months' : newIdx}});
    this.setState({selectedDate: moment().add({'months': newIdx})._d}); 
  };

  handleNavigate(d) {
    //this is not firening 
    //Not sure why
    console.log(d, 'hi');
  }
  render() {
    let events = [];
    return (
      <div className="main-content">
        <SideNav />
        <div className="schedule-view">
          <div className="calendar-wrapper">
            <button onClick={this.navigate.bind(null, 'PREV')}>Prev</button>
            <button onClick={this.navigate.bind(null, 'NEXT')}>Next</button>
            <BigCalendar 
              className="calendar" 
              events={events} 
              date={this.state.selectedDate}
              onNavigate={this.handleNavigate}
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
