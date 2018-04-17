import React, { Component } from 'react';
import './App.css';

import logoImg from './images/AtomFlower.svg';
import schedule from './images/schedule.svg';
import notes from './images/notes.svg';
import customers from './images/customers.svg';
import invoices from './images/invoices.svg';
import map from './images/map.svg';
import gear from './images/gear.svg';


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


class App extends Component {
  render() {
    return (
      <div>
        <SideNav />
      </div>
    );
  }
}

export default App;
