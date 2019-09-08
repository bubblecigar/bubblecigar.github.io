// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDI1CyrQ0D7T_aXa6_6XIFb3ZdRTayFkQo",
  authDomain: "f2e-cloudstorage.firebaseapp.com",
  databaseURL: "https://f2e-cloudstorage.firebaseio.com",
  projectId: "f2e-cloudstorage",
  storageBucket: "f2e-cloudstorage.appspot.com",
  messagingSenderId: "258241236649",
  appId: "1:258241236649:web:de658e2fa16b16e79ea3b8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase
