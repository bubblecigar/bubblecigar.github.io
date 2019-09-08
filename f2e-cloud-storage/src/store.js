import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// fire base
import firebase from '@/firebaseConfig.js'
firebase.auth().onAuthStateChanged(user => {
  store.commit('SET_CURRENT_USER', user);
})

const store = new Vuex.Store({
  state: {
    currentUser: null,
    loginMsg: null,
    currentFolder: [],
    contentWithinFolder: null,
    selectedNode: null
  },
  getters: {
    currentFolderRef: state => {
      if (!state.currentUser) {
        return null
      }

      const root = `users/${state.currentUser.uid}`;
      const rootFolderRef = firebase.storage().ref(root);
      if (!state.currentFolder.length) {
        return rootFolderRef
      }

      const folderPath = state.currentFolder.join('/');
      const currentFolderRef = rootFolderRef.child(folderPath);
      return currentFolderRef
    }
  },
  mutations: {
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_CONTENT_WITHIN_FOLDER(state, content) {
      state.contentWithinFolder = content;
    },
    CLEAR_CONTENT_WITHIN_FOLDER(state, content) {
      state.contentWithinFolder = null;
    },
    PUSH_FOLDER(state, folder) {
      state.currentFolder.push(folder)
    },
    POP_FOLDER(state, index) {
      state.currentFolder.splice(index + 1)
    },
    SET_LOGIN_MSG(state, {
      msg,
      type
    }) {
      state.loginMsg = {
        msg,
        type
      };
      setTimeout(() => {
        if (state.loginMsg.msg === msg) {
          state.loginMsg = null;
        }
      }, 2000);
    },
    SET_NODE_INFO(state, info) {
      state.selectedNode = info;
    },
    CLEAR_NODE_INFO(state) {
      state.selectedNode = null
    }
  },
  actions: {
    popFolder(context, index) {
      context.commit('POP_FOLDER', index);
    },
    pushFolder(context, prefix) {
      context.commit('PUSH_FOLDER', prefix.name);
    },
    getContentWithinFolder(context) {
      context.getters.currentFolderRef.listAll().then(res => {
          context.commit('SET_CONTENT_WITHIN_FOLDER', res)
          // get download links
          res.items.forEach(item => {
            firebase.storage().ref(item.fullPath).getDownloadURL().then(url => {
              const xhr = new XMLHttpRequest();
              xhr.responseType = 'blob';
              xhr.onload = function (event) {
                const blob = xhr.response;
                const blobURL = window.URL.createObjectURL(blob);
                Vue.set(item, 'downloadLink', blobURL);
              };
              xhr.open('GET', url);
              xhr.send();
            })
          })
        })
        .catch(err => {
          console.log(err);
        }).then(() => {
          context.commit('CLEAR_NODE_INFO');
        })
    },
    createAccount(context, {
      email,
      password
    }) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((res) => {
          context.commit('SET_LOGIN_MSG', {
            msg: 'Account  has been successfully created!',
            type: 'success'
          })
        })
        .catch(err => {
          context.commit('SET_LOGIN_MSG', {
            msg: err.message,
            type: 'error'
          });
        })
    },
    logIn(context, {
      email,
      password
    }) {
      firebase.auth().signInWithEmailAndPassword(email, password).then((res) => {
          context.commit('SET_LOGIN_MSG', {
            msg: 'Successfully sign in!',
            type: 'success'
          });
        })
        .catch(err => {
          context.commit('SET_LOGIN_MSG', {
            msg: err.message,
            type: 'error'
          });
        })
    },
    signOut(context) {
      firebase.auth().signOut().then(res => {
        context.commit('SET_LOGIN_MSG', {
          msg: 'Successfully sign out.',
          type: 'success'
        });
      }).catch(err => {
        context.commit('SET_LOGIN_MSG', {
          msg: err.message,
          type: 'error'
        });
      })
    },
    uploadFile(context, file) {
      const currentFolderRef = context.getters.currentFolderRef;
      const fileRef = currentFolderRef.child(`/${file.name}`)
      const uploadTask = fileRef.put(file);

      uploadTask.on('state_changed', snapshot => {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(percentage);
        switch (snapshot.state) {
          case 'paused':
            console.log('uploiad paused');
            break;
          case 'running':
            console.log('upload is running');
            break;
        }
      }, err => {
        switch (err.code) {
          case 'storage/unauthorized':
            console.log(err.code);
            break;
          case 'storage/canceled':
            console.log(err.code);
            break;
          case 'storage/unknown':
            console.log(err.code);
            break;
        }
      }, () => {
        store.dispatch('getContentWithinFolder');
      })
    },
    deleteItem(context, item) {
      const fileRef = firebase.storage().ref(item.location.path_);
      fileRef.delete().then(() => {
        console.log('file deleted');
        store.dispatch('getContentWithinFolder');
      }).catch(err => {
        console.log(err);
      })
    },
    createFolder(context, newFolderName) {
      const ref = context.getters.currentFolderRef.child(
        `${newFolderName}/folderInitDoc.txt`);
      ref.putString('init new folder').then(snapshot => {
        console.log(snapshot);
        store.dispatch('getContentWithinFolder');
      }).catch(err => {
        console.log(err);
      })
    },
    deleteFolder(context, prefix) {
      prefix.listAll().then(res => {
        res.items.forEach(item => {
          context.dispatch('deleteItem', item);
        })
        res.prefixes.forEach(prefix => {
          context.dispatch('deleteFolder', prefix);
        })
      }).catch(err => {
        console.log(err);
      })
    },
    selectNode(context, {
      node,
      type
    }) {
      if (type === 'file') {
        const nodeRef = firebase.storage().ref(node.fullPath);
        nodeRef.getMetadata().then(metadata => {
          const nodeInfo = {
            node,
            type,
            metadata
          }
          context.commit('SET_NODE_INFO', nodeInfo)
        })
      } else if (type === 'folder') {
        const nodeRef = firebase.storage().ref(node.fullPath);
        nodeRef.listAll().then(res => {
          const nodeInfo = {
            node,
            type,
            subFolders: res.prefixes,
            subFiles: res.items
          }
          context.commit('SET_NODE_INFO', nodeInfo)
        })
      }
    }
  },
});

store.watch(state => {
  return state.currentFolder
}, () => {
  store.commit('CLEAR_CONTENT_WITHIN_FOLDER')
  store.dispatch('getContentWithinFolder');
})

export default store