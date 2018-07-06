import React, { Component } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'


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
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
  };

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ isSignedIn: !!user })
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
      console.log(firebase.auth().currentUser, 'auth ob');
      return (
        <div>
          <h1>My App</h1>
          <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
          <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        </div>
      );
    }

  }
}