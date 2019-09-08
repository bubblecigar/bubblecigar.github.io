<template>
  <div id="app">
    <nav class="nav">
      <router-link to="/">User</router-link>
      <router-link to="/storage">Storage</router-link>
      <div class="userStatus" v-if="currentUser">{{ currentUser.email }}</div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
html {
  --g-s: 5px;
  --g-m: 10px;
  --g-l: 15px;

  --fs-xs: 12px;
  --fs-s: 16px;
  --fs-m: 20px;
  --fs-l: 24px;
  --fs-xl: 28px;

  --c-main: rgb(160, 185, 233);
  --c-minor: rgb(255, 250, 187);

  --c-hover: rgb(225, 232, 243);
  --c-active: gray;
  --c-selected: rgb(160, 185, 233);
  --c-label: rgb(180, 180, 180);

  --c-error: red;
  --c-safe: green;
}
button {
  outline: 0;
  border-radius: var(--g-s);
  &:hover {
    cursor: pointer;
  }
}
#app {
  min-height: 100vh;
  line-height: 1.1em;
  font-size: var(--fs-m);
}
.nav {
  display: flex;
  flex: row wrap;
  align-items: center;
  a,
  .userStatus {
    margin: var(--g-m);
    padding: var(--g-m);
    text-decoration: none;
    color: initial;
  }
  a {
    padding: var(--g-m);
    display: row;
    align-items: center;
    border-radius: var(--g-s);
    &:hover {
      cursor: pointer;
    }
  }
  .userStatus {
    margin-left: auto;
  }
}
.currentUser {
  margin-left: auto;
}
</style>
