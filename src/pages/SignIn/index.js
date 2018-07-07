import React, { Component } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { setUser } from '../../actions'
import { Redirect } from 'react-router-dom'


export class SignIn extends Component {
  state = {
    isSignedIn: false
  }

  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',
    // We will display Google and Facebook as auth providers.
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false

      // signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      //   // var user = authResult.user;
      //   // var credential = authResult.credential;
      //   // var isNewUser = authResult.additionalUserInfo.isNewUser;
      //   // var providerId = authResult.additionalUserInfo.providerId;
      //   // var operationType = authResult.operationType;
      //   console.assert(authResult, 'auth res');
      //   // Do something with the returned AuthResult.
      //   // Return type determines whether we continue the redirect automatically
      //   // or whether we leave that to developer to handle.
      //   return true;
      // },
    },
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
  };

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => {
        console.log(user);
        this.setState({ isSignedIn: !!user })
        if (user !== null) {
          const userObj = {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            isAnonymous: user.isAnonymous,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerData: user.providerData,
            uid: user.uid
          }
          setUser(userObj);
        }
      }
    );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    } else {
      // return (
      //   <h1> Test</h1>
      // )
      return <Redirect to="/schedule" />
    }

  }
}