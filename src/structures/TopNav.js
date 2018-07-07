import React, { Component } from 'react'
import logoImg from '../images/AtomFlower.svg'
import firebase from 'firebase/app'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUser } from '../actions'

export class TopNavComp extends Component {
  state =  {
    isLoggedin: true
  }
  componentDidMount() {
    console.log(this.props, 'props');
    firebase.auth().onAuthStateChanged((user)=> {
      console.log(firebase.auth().currentUser, 'user current');
    })
  }
  onSignOut = () => {
    firebase.auth().signOut().then(()=> {
      this.setState({isLoggedin: false});
      console.log('signd out');
    })
  }
  render() {
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
          <span>Justin Hardin</span>
          <span onClick={this.onSignOut}>sign out</span>
        </div>
      </div>
    )
  }
}

const mapNoteStateToProps = state => ({
  user: state.data
});
export const TopNav = connect(mapNoteStateToProps, {getUser})(TopNavComp);
