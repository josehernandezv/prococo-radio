import { createStore } from 'redux';
import { createFirestoreInstance } from 'redux-firestore'; // <- needed if using firestore
import firebase from '../lib/firebase';
import rootReducer from './reducers';

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
    // enableClaims: true // Get custom claims along with the profile
};

const store = createStore(
    rootReducer,
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
};

export default store;
export { rrfProps };
