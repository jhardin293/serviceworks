import React, { Component } from 'react'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-tabs/style/react-tabs.css'
import 'react-select/dist/react-select.css'
import './App.css'

import { Schedule } from './Schedule'
import { Notes } from './Notes'
import { Customers } from './Customers'
import { Invoices } from './Invoices'
import { TeamMap } from './TeamMap'
import { MyAccount } from './MyAccount'

import { SideNav } from '../structures/SideNav'
import { NewJob } from '../structures/NewJob'
import { EditJob } from '../structures/EditJob'
import { NewNote } from '../structures/NewNote'
import { EditNote } from '../structures/EditNote'
import { EditCustomer } from '../structures/EditCustomer'
import { EditInvoice } from '../structures/EditInvoice'
import { NewCustomer } from '../structures/NewCustomer'
import { NewInvoice } from '../structures/NewInvoice'
import { NewEmployee } from '../structures/NewEmployee'
import { SignIn } from './SignIn';

momentDurationFormatSetup(moment);

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
            <Route exact path="/notes/edit-note" component={EditNote} />
            <Route exact path="/customers/new-customer" component={NewCustomer} />
            <Route exact path="/customers/edit-customer" component={EditCustomer} />
            <Route exact path="/invoices/new-invoice" component={NewInvoice} />
            <Route exact path="/invoices/edit-invoice" component={EditInvoice} />
            <Route exact path="/my-account/new-employee" component={NewEmployee} />
            <Route exact path="/sign-in" component={SignIn} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
