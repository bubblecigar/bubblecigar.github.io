<template>
  <div class="hold-slot" :style="{top:top,left:left}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    mousePosition: {
      type: Object,
      required: false,
      default() {
        return {
          clientX: 0,
          clientY: 0
        };
      }
    },
    layerCoord: {
      type: Object,
      required: false,
      default() {
        return {
          layerX: 0,
          layerY: 0
        };
      }
    }
  },
  computed: {
    top() {
      return `${this.mousePosition.clientY - this.layerCoord.layerY - 5}px`;
    },
    left() {
      return `${this.mousePosition.clientX - this.layerCoord.layerX}px`;
    }
  }
};
</script>

<style  scoped>
.hold-slot {
  position: fixed;
  top: 0;
  left: 0;
  /* transform: translate3d(-50px, -75px, 0); */
  z-index: 3;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.1);
}
.hold-slot:hover {
  cursor: pointer;
}
</style>