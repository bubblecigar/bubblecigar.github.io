<template>
  <div class="game-clock">
    <i class="fas fa-clock"></i>
    <span>{{time.minute}} : {{time.second}}</span>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
i {
  margin-right: 10px;
}
.alert {
  color: darkorange;
}
</style>