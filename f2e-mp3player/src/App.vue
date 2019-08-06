<template>
  <div id="app">
    <SearchLog></SearchLog>
    <SongCard></SongCard>
    <AudioControls></AudioControls>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {};
</script>

<style>
html {
  /* --color-main: rgb(26, 120, 182); */
  --color-main: rgb(63, 152, 211);
  --color-lighter: rgb(142, 210, 255);
  --color-darker: rgb(13, 63, 128);
  --color-opacity: rgba(13, 63, 128, 0.5);
  --color-contrast: rgb(54, 54, 54);
  /* --color-decoration: rgba(255, 166, 0, 0.726); */
  --color-decoration: darkslategray;
  --color-selectPanel: white;
  --color-controlPanel: white;
  --color-active: var(--color-main);
  --color-text: rgb(51, 247, 100);

  --btn-size-big: 120px;
  --btn-size-medium: 60px;
  --btn-size-small: 20px;

  --bar-size-small: 20px;

  --shadow-default: 1px -10px 0px white;
  --shadow-contrast: 5px -10px 0px white;
}
* {
  box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: space-between;

  min-height: 100vh;
  overflow: hidden;
  background-color: var(--color-main);
  background: radial-gradient(
    circle at bottom,
    black,
    var(--color-darker) 40%,
    var(--color-lighter) 80%
  );
  background-size: cover;
  background-repeat: no-repeat;
  /* background-position: 0 50vh; */
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
