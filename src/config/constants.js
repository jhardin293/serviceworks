import * as firebase from 'firebase';
import '@firebase/firestore'

const config = {
    apiKey: "AIzaSyAgDMwPF8pd1sEkylXyOYavylEHeb_OAjI",
    authDomain: "trip-keep.firebaseapp.com",
    databaseURL: "https://trip-keep.firebaseio.com",
    projectId: "trip-keep",
    storageBucket: "trip-keep.appspot.com",
    messagingSenderId: "615283482660"
  };
firebase.initializeApp(config);
const firestore = firebase.firestore();
const storage = firebase.storage().ref();

export const ref = firestore;
export const storageRef = storage; 
