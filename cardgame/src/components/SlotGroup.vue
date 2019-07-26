<template>
  <div class="slot-group">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.slot-group {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  max-width: 960px;
  /* outline: 1px solid black; */
}
.foundation-group {
  /* background-color: aquamarine; */
}
.foundation-group > .card-wrapper {
  top: 0;
}
.cell-group {
  /* background-color: saddlebrown; */
}
.cascade-group {
  /* background-color: khaki; */
  align-items: flex-start;
  padding-bottom: 400px;
}
</style>