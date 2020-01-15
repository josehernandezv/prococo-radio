import firebase from '../lib/firebase'
import {initFirestorter, Collection, Document} from 'firestorter';

initFirestorter({ firebase });

const songs = new Collection("songs");

const playlists = new Collection("playlists");

const doc = new Document("songs/AAH1paVX52oP2T8oh2El");

export {
    songs,
    doc,
    playlists
};