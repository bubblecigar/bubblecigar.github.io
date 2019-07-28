<template>
  <div class="author-info">
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
  padding: 15px 30px;
  border-radius: 10px;
  position: fixed;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
}
.author-info:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
a {
  text-decoration: none;
  color: inherit;
}
</style>