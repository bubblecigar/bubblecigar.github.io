<template>
  <div id="app">
    <span v-if="currentUser">currentUser:{{currentUser.email}}</span>
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
</style>
