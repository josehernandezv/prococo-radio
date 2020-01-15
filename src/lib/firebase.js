import * as firebase from 'firebase/app';
import 'firebase/firestore';
// import { initFirestorter } from 'firestorter';

// Initialize firebase app
firebase.initializeApp({
  "apiKey": "AIzaSyCpzPj6UtFTYaWsSmejhqMsYdkMxfvmACY",
    "authDomain": "prococo-radio.firebaseapp.com",
    "databaseURL": "https://prococo-radio.firebaseio.com",
    "projectId": "prococo-radio",
    "storageBucket": "prococo-radio.appspot.com",
    "messagingSenderId": "1098884122624"
});

export default firebase

// And initialize `firestorter`
// initFirestorter({ firebase: firebase });