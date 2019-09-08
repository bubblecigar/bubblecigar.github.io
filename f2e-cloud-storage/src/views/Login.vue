<template>
  <div>
    <form>
      <label>email</label>
      <input v-model="email" type="email" />
      <label>password</label>
      <input v-model="password" type="password" />
      <div class="btns">
        <button @click="createAccount">Sign up</button>
        <button @click="logIn">Log in</button>
        <button @click="signOut">Sign out</button>
      </div>
      <div v-if="loginMsg" class="loginMsg" :class="loginMsg.type">{{loginMsg.msg}}</div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["currentUser", "loginMsg"])
  },
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    createAccount() {
      this.$store.dispatch("createAccount", {
        email: this.email,
        password: this.password
      });
    },
    logIn() {
      this.$store.dispatch("logIn", {
        email: this.email,
        password: this.password
      });
    },
    signOut() {
      this.$store.dispatch("signOut");
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  width: 66%;
  min-width: 300px;
  max-width: 500px;
  margin: var(--g-m) auto;
  flex-flow: column;

  label,
  input,
  button {
    text-align: center;
    padding: var(--g-m);
    border-radius: var(--g-s);
    outline: none;
    border: none;
    font-size: var(--fs-m);
  }
  input {
    margin-bottom: var(--g-l);
  }
  .btns {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
    align-items: center;
    padding: var(--g-m);
  }

  .loginMsg {
    text-align: center;
    padding: var(--g-m);
  }
  .error {
    color: var(--c-error);
  }
  .success {
    color: var(--c-safe);
  }
}
</style>