<template>
  <div class="author-info">
    <span>Resources:</span>
    <a target="_BLANK" href="https://challenge.thef2e.com/user/2826?schedule=3204#works-3204">
      THE F2E
      <sup>2nd</sup>
    </a>
    <!-- <a target="_BLANK" href="https://www.svgbackgrounds.com/">Svg background</a>
    <a target="_BLANK" href="https://www.vuemastery.com/courses/">Vue.js</a>
    <a target="_BLANK" href="https://fontawesome.com/">fontawesome</a>
    <a target="_BLANK" href="https://fonts.google.com/">google font</a>-->
    <a>Svg background</a>
    <a>Vue.js</a>
    <a>fontawesome</a>
    <a>google font</a>
    <br />
    <span>Author:</span>
    <a href="mailto:bubblecigar@gmail.com">
      <i class="far fa-envelope"></i> bubblecigar@gmail.com
    </a>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.author-info {
  font-family: "Kaushan Script", cursive;
  font-weight: bold;
  font-size: 20px;
  color: rgba(255, 247, 176, 0.37);
  line-height: 2em;
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%);
  text-align: left;
}
a:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
a {
  padding: 2px 5px;
  margin: 5px;
  border-radius: 5px;
  text-decoration: none;
  color: inherit;
}
sup {
  font-size: 10px;
  vertical-align: top;
}
</style>