import React, { Component } from 'react';
import './App.css';

import logoImg from './images/AtomFlower.svg';


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
              <a>
                <img src="" alt=""/>
                <span>Schedule</span>
              </a>
            </li>
            <li>
              <a>
                <img src="" alt=""/>
                <span>Notes</span>
              </a>
            </li>
            <li>
              <a>
                <img src="" alt=""/>
                <span>Customers</span>
              </a>
            </li>
            <li>
              <a>
                <img src="" alt=""/>
                <span>Invoices</span>
              </a>
            </li>
            <li>
              <a>
                <img src="" alt=""/>
                <span>Team map</span>
              </a>
            </li>
            <li>
              <a>
                <img src="" alt=""/>
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
