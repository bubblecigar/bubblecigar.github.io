<template>
  <button class="customized-button" @click="emitEvent">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    eventName: {
      type: String,
      required: true
    },
    eventParams: {
      type: Number,
      required: false,
      default: 0
    }
  },
  methods: {
    emitEvent() {
      this.$emit(this.eventName, this.eventParams);
    }
  }
};
</script>

<style scoped>
.customized-button {
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 25px;
  text-shadow: inherit;
  font-weight: bold;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 5px 15px;
  transition: transform 0.3s;
}
.customized-button:hover {
  cursor: pointer;
  transform: translateY(-5px);
  text-decoration: underline;
}
.customized-button:active {
  cursor: pointer;
  color: azure;
}
.[disabled]:active {
  cursor: initial;
  color: initial;
}
[disabled]:hover {
  cursor: initial;
  transform: none;
  text-decoration: none;
}
</style>