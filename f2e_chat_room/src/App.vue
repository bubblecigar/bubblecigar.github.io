<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">About</router-link>
      <router-link to="/documentation">Documentation</router-link>
      <router-link to="/features">Features</router-link>
      <router-link to="/settings">Settings</router-link>
    </div>
    <main>
      <router-view />
    </main>
    <ChatBox id="chatbox1"></ChatBox>
    <ChatBox id="chatbox2"></ChatBox>
  </div>
</template>

<script>
import ChatBox from "@/components/ChatBox.vue";
export default {
  components: { ChatBox },
  methods: {}
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700&display=swap");
html,
body {
  min-height: 100vh;
}
main {
  --g-s: 5px;

  width: 100%;
  min-height: 100vh;
  padding: 100px 30px 120px 30px;
  line-height: 1.5em;
  text-align: left;
  article {
    max-width: 850px;
    margin: 0 auto;
    padding: var(--g-s);
  }
  section {
    padding: var(--g-s);
    margin: var(--g-s);
  }
  h1 {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    padding: var(--g-s);
    margin: var(--g-s);
    i {
      padding: var(--g-s);
      margin: var(--g-s);
    }
  }
  h2 {
    font-size: 24px;
    font-weight: bold;
    padding: var(--g-s);
    margin: var(--g-s);
    i {
      padding: var(--g-s);
      margin: var(--g-s);
    }
  }
  p {
    font-size: 18px;
    text-indent: 2em;
    padding: var(--g-s);
    margin: var(--g-s);
    i,
    a {
      text-indent: initial;
      margin: 0;
      text-decoration: underline;
      // font-weight: bold;
    }
    a {
      color: #1670ac;
    }
  }
  table {
    margin-left: 0.22em;
    th,
    td {
      padding: var(--g-s);
      margin: var(--g-s);
    }
    th {
      background-color: lightgray;
      border-right: 5px solid white;
      border-bottom: 5px solid white;
    }
    td {
      border-right: 5px solid white;
      border-bottom: 5px solid white;
    }
    td:first-child {
      background-color: rgba(0, 0, 0, 0.08);
    }
    td:nth-child(2) {
      background-color: rgba(0, 0, 0, 0.04);
    }
    td:nth-child(3) {
      background-color: rgba(0, 0, 0, 0.01);
    }

    span {
      margin: 0;
      padding: 3px;
      font-size: 15px;
    }
  }
  .alert-text {
    color: tomato;
    font-weight: bold;
  }
  .code-block {
    display: flex;
    flex-flow: column;
    text-indent: 1em;
    background-color: rgba(0, 0, 0, 0.05);
    margin: 8px 5px;

    .indent {
      padding-left: 1em;
    }
    span {
      font-family: "Courier New", Courier, monospace;
      font-size: 18px;
      margin: 0;
      padding: 0;
    }
    sub {
      color: gray;
    }
  }
  .dependency {
    &p {
      margin-top: 20px;
    }
    b {
      color: #42b983;
      font-weight: bold;
    }
    span {
      white-space: nowrap;
      overflow-x: scroll;
      padding: 5px;
    }
  }
  .external-link {
    font-weight: bold;
  }
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-family: "Source Sans Pro", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}
#nav {
  width: 100%;
  padding: 30px 0;
  position: absolute;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background-color: #2773a74d;
  a {
    font-weight: bold;
    text-decoration: none;
    opacity: 0.4;
    margin: 0 20px;
    color: #2c3e50;
    &.router-link-exact-active {
      text-decoration: underline;
      opacity: 1;
    }
  }
}

#chatbox1 {
  position: fixed;
  width: calc(50% - 15px);
  right: 10px;
  top: 100%;
  transform: translateY(-100%);
}
#chatbox2 {
  position: fixed;
  width: calc(50% - 15px);
  left: 10px;
  top: 100%;
  transform: translateY(-100%);
}
</style>