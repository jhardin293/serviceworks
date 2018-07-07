import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'


import schedule from '../images/schedule.svg'
import notes from '../images/notes.svg'
import customers from '../images/customers.svg'
import invoices from '../images/invoices.svg'
import map from '../images/map.svg'
import gear from '../images/gear.svg'

export class SideNav extends Component {
  render() {
    return (
      <aside className="side-nav">
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
