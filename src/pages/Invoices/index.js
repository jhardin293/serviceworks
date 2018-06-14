import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import threeDots from '../../images/three-dots.png'
import plus from '../../images/plus.svg'

export class Invoices extends Component {
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