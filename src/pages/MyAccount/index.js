import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from "react-router-dom";
import { RoutedTabs, NavTab } from 'react-router-tabs';
import { getUser, updateUser } from '../../actions'

import { AccountDetails } from '../../components/AccountDetails';

class MyAccountComp extends Component {
  componentWillMount() {
    this.props.getUser();
  }
  onAccountSave = (user) => {
    const mergedUser = { ...this.props.user, ...user }
    updateUser(mergedUser)
  }
  onAccountDelete = (user) => {
    console.log(user, 'to be deleted');
  }
  render() {
    const { match } = this.props;
    const location = this.props.location.pathname;
    //This is to account for the "break out pages" not sure if it is a hack but it works
    if (location === '/my-account/new-employee' || location === '/my-account/edit-employee') {
      return (null);
    }
    return (
      <div className="my-account-view person-view page-view">
        <div className="page-header">
          <h1>My account</h1>
        </div>
        <div className="page-body">
          <div className="react-tabs">
            <RoutedTabs
              startPathWith={match.path}
              className="react-tabs__tab-list"
              activeTabClassName="react-tabs__tab--selected"
              tabClassName="react-tabs__tab"
            >
              <NavTab to="/details">Details</NavTab>
            </RoutedTabs>
            <div className="react-tabs__tab-panel react-tabs__tab-panel--selected">
              <Route exact path={`${match.path}`} render={() => <Redirect replace to={`${match.path}/details`} />} />
              <Route path={`${match.path}/details`} render={() => {
                return (
                  <AccountDetails
                    account={this.props.user}
                    onSave={this.onAccountSave}
                    onDelete={this.onAccountDelete}
                    allowDelete

                  />
                )
              }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapNoteStateToProps = state => ({
  user: state.user.data
});

export const MyAccount = connect(mapNoteStateToProps, { getUser })(MyAccountComp);
