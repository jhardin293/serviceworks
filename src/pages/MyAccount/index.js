import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { getUser, updateUser } from '../../actions'
import { Link } from 'react-router-dom'
import threeDots from '../../images/three-dots.png'
import plus from '../../images/plus.svg'

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
              <div className="tab-header">
                <h2>BensWorth Cleaning Company</h2>
                <Link to="/my-account/new-employee">
                  <button className="invoice-btn btn"><img src={plus} alt="" /><span>New employee</span></button>
                </Link>
              </div>
              <div className="employee-list-wrapper">
                <table className="panel">
                  <thead>
                    <tr className="header">
                      <th><h2>Name</h2></th>
                      <th><h2>Email</h2></th>
                      <th><h2>Phone</h2></th>
                      <th><h2>Role</h2></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="panel-body">
                    <tr>
                      <td><Link to="/my-account/new-employee">Benny Himsworth</Link></td>
                      <td>bhimsworth@gmail.com</td>
                      <td>343-234-9292</td>
                      <td>Owner</td>
                      <td><img src={threeDots} alt="item-menu" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
