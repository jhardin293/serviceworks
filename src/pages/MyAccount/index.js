import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getUser, updateUser} from '../../actions'


import { AccountDetails } from '../../components/AccountDetails';

class MyAccountComp extends Component {
  componentWillMount() {
    this.props.getUser();
  }
  onAccountSave = (user) => {
    const mergedUser = {...this.props.user, ...user}
    updateUser(mergedUser)
  }
  render() {
    console.log(this.props.user, 'in account');
    return (
      <AccountDetails account={this.props.user} onSave={this.onAccountSave}/>
    )
  }
}

const mapNoteStateToProps = state => ({
  user: state.user.data
});

export const MyAccount = connect(mapNoteStateToProps, { getUser })(MyAccountComp);
