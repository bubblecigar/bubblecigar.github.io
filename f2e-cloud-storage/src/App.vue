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

  --c-error: rgb(226, 120, 120);
  --c-safe: rgb(120, 167, 120);
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
  max-width: 1100px;
  width: calc(100% - var(--g-l) * 2);
  margin: 0 auto 30px auto;
  background: var(--c-main);
  border-top: 0;
  border-radius: 0 0 var(--g-l) var(--g-l);
  box-shadow: 0 -3px 3px gray inset;
  a,
  .userStatus {
    margin: var(--g-m);
    padding: var(--g-m);
    text-decoration: none;
    color: white;
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
  .router-link-exact-active {
    text-decoration: underline;
  }
}
.currentUser {
  margin-left: auto;
}
</style>
