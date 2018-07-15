import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { getUser, updateUser } from '../../actions'
import { Team } from '../../components/Team'

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
    return (
      <div className="new-account-view person-view page-view">
        <div className="page-header">
          <h1>My account</h1>
        </div>
        <div className="page-body">
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Team</Tab>
            </TabList>

            <TabPanel>
              <AccountDetails
                account={this.props.user}
                onSave={this.onAccountSave}
                onDelete={this.onAccountDelete}
                allowDelete

              />
            </TabPanel>
            <TabPanel>
              <Team />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapNoteStateToProps = state => ({
  user: state.user.data
});

export const MyAccount = connect(mapNoteStateToProps, { getUser })(MyAccountComp);
