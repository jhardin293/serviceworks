import React, { Component } from 'react'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import firebase from 'firebase/app'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-tabs/style/react-tabs.css'
import 'react-select/dist/react-select.css'
import 'react-router-tabs/styles/react-router-tabs.css';
import './App.css'

import { Schedule } from './Schedule'
import { Notes } from './Notes'
import { Customers } from './Customers'
import { Employees } from './Employees'
import { Invoices } from './Invoices'
import { TeamMap } from './TeamMap'
import { MyAccount } from './MyAccount'

import { SideNav } from '../structures/SideNav'
import { NewJob } from '../structures/NewJob'
import { EditJob } from '../structures/EditJob'
import { NewNote } from '../structures/NewNote'
import { EditNote } from '../structures/EditNote'
import { EditCustomer } from '../structures/EditCustomer'
import { EditEmployee } from '../structures/EditEmployee'
import { EditInvoice } from '../structures/EditInvoice'
import { NewCustomer } from '../structures/NewCustomer'
import { NewInvoice } from '../structures/NewInvoice'
import { NewEmployee } from '../structures/NewEmployee'
import { SignIn } from './SignIn';
import { TopNav } from '../structures/TopNav';
import { connect } from 'react-redux'
import { setUser, getUser } from '../actions';

momentDurationFormatSetup(moment);

class AppContainerComp extends Component {
  state = {
    OnSignInPage: false,
    isLoggedin: true,
    lodingUser: true,
    user: false
  }


  componentWillMount() {
    this.props.getUser();
    this.signInCheck(this.props.location.pathname);
    this.unlisten = this.props.history.listen((location, action) => {
      this.signInCheck(location.pathname);
    });

  }

  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (firebase.auth().currentUser === null) {
        this.setState({ isLoggedin: false, lodingUser: false });
      } else {
        setUser(user);
        this.setState({ isLoggedin: true, lodingUser: false });
      }
    })
  }

  signInCheck = (path) => {
    if (path === '/sign-in') {
      this.setState({ OnSignInPage: true });
    } else {
      this.setState({ OnSignInPage: false });
    }
  }

  render() {
    if (this.state.isLoggedin === false && !this.state.OnSignInPage) {
      return <Redirect to="/sign-in" />
    }
    return (
      <div style={{ height: '100%' }}>
        <Route exact path="/sign-in" component={SignIn} />
        {!this.state.OnSignInPage && this.props.user.uid &&
          <div style={{ height: '100%' }}>
            <TopNav />
            <div className="main-content">
              <SideNav />
              <Route exact path="/" render={() => (
                <Redirect to="/schedule" />
              )} />
              <Route path="/schedule" exact component={Schedule} />
              <Route path="/notes" exact component={Notes} />
              <Route path="/customers" exact component={Customers} />
              <Route path="/employees" exact component={Employees} />
              <Route path="/invoices" exact component={Invoices} />
              <Route path="/team-map" component={TeamMap} />
              <Route path="/my-account" component={MyAccount} />
              <Route exact path="/schedule/new-job" component={NewJob} />
              <Route exact path="/schedule/edit-job" component={EditJob} />
              <Route exact path="/notes/new-note" component={NewNote} />
              <Route exact path="/notes/edit-note" component={EditNote} />
              <Route exact path="/customers/new-customer" component={NewCustomer} />
              <Route exact path="/customers/edit-customer" component={EditCustomer} />
              <Route exact path="/invoices/new-invoice" component={NewInvoice} />
              <Route exact path="/invoices/edit-invoice" component={EditInvoice} />
              <Route exact path="/employees/new-employee" component={NewEmployee} />
              <Route exact path="/employees/edit-employee" component={EditEmployee} />

            </div>
          </div>
        }
      </div>
    )
  }
}

const mapNoteStateToProps = state => ({
  user: state.user.data
});
const AppContainer = withRouter(connect(mapNoteStateToProps, { getUser })(AppContainerComp), AppContainerComp)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <AppContainer />
        </Router>
      </Provider>
    );
  }
}

export default App;
