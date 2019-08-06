<template>
  <div class="button-small scheme-color" @click="emit">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    eventName: {
      type: String,
      required: false,
      default: "n"
    }
  },
  methods: {
    emit() {
      this.$emit(this.eventName);
    }
  }
};
</script>

<style scoped>
.button-small {
  width: var(--btn-size-small);
  height: var(--btn-size-small);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin: 0 10px;
  /* border: 3px solid black; */
}
i {
  font-size: calc(var(--btn-size-small));
}
.scheme-color {
  background-color: var(--color-controlPanel);
  color: var(--color-contrast);
  box-shadow: var(--shadow-default) inset;
}
.button-small:hover {
  cursor: pointer;
}
.button-small:active {
}
</style>
