import React, { Component } from 'react'
import logoImg from '../images/AtomFlower.svg'
import firebase from 'firebase/app'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUser } from '../actions'

export class TopNavComp extends Component {
  state = {
    isLoggedin: true
  }
  componentWillMount() {
    this.props.getUser();
  }
  onSignOut = () => {
    firebase.auth().signOut().then(() => {
      console.log('loged out');
      this.setState({isLoggedin: false});
    })
  }
  render() {
    const { user } = this.props;
    if (this.state.isLoggedin === false) {
      return <Redirect to="/sign-in" />
    }
    return (
      <div className="top-nav">
        <div>
          <div className="logo">
            <img src={logoImg} alt="logo" width="25" height="28" />
            <h2>Serviceworks</h2>
          </div>
        </div>
        <div className="user-info">
          {user.photoURL &&
            <img className="profile-img" src={user.photoURL} alt="profile avatar"/>
          }
          <span>{user.displayName}</span>
          <span onClick={this.onSignOut}>sign out</span>
        </div>
      </div>
    )
  }
}

const mapNoteStateToProps = state => ({
  user: state.user.data
});
export const TopNav = connect(mapNoteStateToProps, { getUser })(TopNavComp);
