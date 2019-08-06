<template>
  <div
    class="button-medium scheme-color"
    :style="{ left: left }"
    :class="{ 'border-right': lr, 'border-left': !lr }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    left: {
      type: String,
      required: false,
      default: "0%"
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
.button-medium {
  width: var(--btn-size-medium);
  height: calc(var(--btn-size-medium) / 2);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  padding: 3px;
  top: 0;
  transform: translate3d(-50%, -100%, 0);
  box-shadow: var(--shadow-contrast);
  color: var(--color-contrast);
  z-index: 5;
  border: 3px solid black;
  border-bottom: 0;
}

.border-right {
  border-radius: calc(var(--btn-size-medium) * 0.2)
    calc(var(--btn-size-medium) * 1.2) 0 0;
}
.border-left {
  border-radius: calc(var(--btn-size-medium) * 1.2)
    calc(var(--btn-size-medium) * 0.2) 0 0;
}
i {
  font-size: calc(var(--btn-size-medium) / 4);
}
.scheme-color {
  background-color: var(--color-controlPanel);
}
.button-medium:hover {
  cursor: pointer;
}
.button-medium:active {
  color: var(--color-active);
}
</style>
