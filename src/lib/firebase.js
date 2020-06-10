import * as firebase from 'firebase/app';
import 'firebase/firestore';
// import 'firebase/storage';

// Initialize firebase app
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: 'AIzaSyCpzPj6UtFTYaWsSmejhqMsYdkMxfvmACY',
        authDomain: 'prococo-radio.firebaseapp.com',
        databaseURL: 'https://prococo-radio.firebaseio.com',
        projectId: 'prococo-radio',
        storageBucket: 'prococo-radio.appspot.com',
        messagingSenderId: '1098884122624',
    });
    firebase.firestore();
}

export default firebase;
