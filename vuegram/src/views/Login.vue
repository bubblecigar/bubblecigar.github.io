<template>
  <div>
    <form action>
      <label for>email</label>
      <input type="email" v-model="email" />
      <br />
      <label for>password</label>
      <input type="password" v-model="password" />
    </form>
    <button @click="createAccount">create account</button>
    <button @click="loginAccount">login account</button>
    <button @click="signOut">sign out</button>
    <br />
    <div>
      <label for>collection:</label>
      <input type="text" v-model="collection" />
    </div>
    <div>
      <label for>document:</label>
      <input
        v-for="(value, key) in document"
        type="text"
        v-model="document[key]"
        :placeholder="key"
      />
    </div>
    <button @click="addData">add data</button>
    <button @click="getData">get data</button>
    <div>
      <label for>location string:</label>
      <input type="text" v-model="location" />
      <button @click="setLocation">set location</button>
    </div>
    <input type="file" @change="bindFile" />
    <button @click="testStorage">test storage</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      location: "",
      email: "",
      password: "",
      collection: "test",
      document: {
        a: "",
        b: ""
      },
      file: null
    };
  },
  computed: {
    ...mapState(["loginState", "currentUser"])
  },
  methods: {
    createAccount() {
      this.$store.dispatch("createUserWithEmailAndPassword", {
        email: this.email,
        password: this.password
      });
    },
    loginAccount() {
      this.$store.dispatch("signInWithEmailAndPassword", {
        email: this.email,
        password: this.password
      });
    },
    signOut() {
      this.$store.dispatch("signOut");
    },
    addData() {
      this.$store.dispatch("addData", {
        collection: this.collection,
        document: this.document
      });
    },
    getData() {
      this.$store.dispatch("getData", this.collection);
    },
    setLocation() {
      this.$store.dispatch("setLocation", {
        location: this.location,
        data: this.document
      });
    },
    testStorage() {
      this.$store.dispatch("testStorage", { file: this.file });
    },
    bindFile(e) {
      this.file = e.target.files[0];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>