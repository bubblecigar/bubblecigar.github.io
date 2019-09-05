// firebase
import * as firebase from 'firebase/app';
import "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyArYm7cPRBqWRyRHNIP3XFNo7YJjB6_ass",
    authDomain: "vuegram-d916d.firebaseapp.com",
    databaseURL: "https://vuegram-d916d.firebaseio.com",
    projectId: "vuegram-d916d",
    storageBucket: "vuegram-d916d.appspot.com",
    messagingSenderId: "834117251374",
    appId: "1:834117251374:web:c02ceaab92d44fe0"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;
const storage = firebase.storage();

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')


export default {
    db,
    auth,
    currentUser,
    storage,
    usersCollection,
    postsCollection,
    commentsCollection,
    likesCollection
}