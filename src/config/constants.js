// import * as firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyCd3KzpKOlhsGaPvwJO2BhbQ3dQXy8HyLE",
  authDomain: "serviceworks-77dce.firebaseapp.com",
  databaseURL: "https://serviceworks-77dce.firebaseio.com",
  projectId: "serviceworks-77dce",
  storageBucket: "serviceworks-77dce.appspot.com",
  messagingSenderId: "497523663623"
};

firebase.initializeApp(config);
const firestore = firebase.firestore();
const storage = firebase.storage().ref();
//Need to update date objects in firestore
// const settings = {timestampsInSnapshots: true};
// firestore.settings(settings);

export const ref = firestore;
export const storageRef = storage; 
