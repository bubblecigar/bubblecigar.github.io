<template>
  <div class="button-cloud scheme-color" :style="{'z-index':z}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    z: {
      type: Number,
      required: false,
      default: 0
    },
    lr: {
      type: Boolean,
      required: false,
      default: true
    }
  }
};
</script>

<style scoped>
.button-cloud {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 5px 20px;
  margin: 10px;
  box-shadow: var(--shadow-contrast);
  color: var(--color-contrast);
  z-index: 20;
  border: 3px solid black;
  border-radius: 10px 10px 20px 20px;
}

i {
  font-size: calc(var(--btn-size-medium) / 4);
}
.scheme-color {
  background-color: var(--color-controlPanel);
}
.button-cloud:hover {
  cursor: pointer;
}
.button-cloud:active {
  color: var(--color-active);
}
</style>
