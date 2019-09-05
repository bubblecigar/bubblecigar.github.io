import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import firebase from './firebaseConfig'
firebase.auth.onAuthStateChanged(user => {
  store.commit('SET_CURRENT_USER', user)
})

const store = new Vuex.Store({
  state: {
    currentUser: null
  },
  mutations: {
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SIGN_OUT(state) {
      state.currentUser = firebase.auth.currentUser;
    }
  },
  actions: {
    createUserWithEmailAndPassword(context, {
      email,
      password
    }) {
      firebase.auth.createUserWithEmailAndPassword(email, password)
        .then(() => {}).catch(err => {
          console.log(err);
        })
    },
    signInWithEmailAndPassword(context, {
      email,
      password
    }) {
      firebase.auth.signInWithEmailAndPassword(email, password).then(() => {
        const user = firebase.auth.currentUser;
        context.commit('SET_CURRENT_USER', user)
      }).catch(err => {
        console.log(err);
      })
    },
    signOut(context) {
      firebase.auth.signOut().then(res => {
        context.commit('SIGN_OUT')
      }).catch(err => {
        console.log(err);
      })
    },
    addData(context, {
      collection,
      document
    }) {
      firebase.db.collection(collection).add(document)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.error('err adding document:', err);
        })
    },
    getData(context, collection) {
      firebase.db.collection(collection).get().then(res => {
        res.docs.forEach(el => {
          console.log(`${el.id}`);
          console.log(el.data());
        })

      })
    },
    setLocation(context, {
      location,
      data
    }) {
      const doc = firebase.db.doc(location)
      doc.set(data)
    },
    testStorage(context, {
      file
    }) {
      if (file) {
        const ref = firebase.storage.ref(`smapleFolder/${file.name}`);
        console.log(ref.fullPath);
        console.log(ref.name);
        console.log(ref.bucket);

        const print = x => {
          console.log(x);
        }
        const nextCallBack = print;
        const errCallBack = print;
        const completeCallBack = print;
        ref.put(file).on('state_changed', nextCallBack, errCallBack, completeCallBack);
      }
    }
  }
});

export default store