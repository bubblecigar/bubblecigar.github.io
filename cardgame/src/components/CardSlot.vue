<template>
  <div class="card-slot unselectable" @mouseup="slotPicked">
    <div class="hint" v-html="hint"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    indexs: {
      type: Object,
      required: true
    }
  },
  methods: {
    slotPicked() {
      this.$emit("slotPicked", this.indexs);
    }
  },
  computed: {
    hint() {
      switch (this.indexs.gi) {
        case 0:
          return `<i class="fas fa-boxes"></i>`;
        case 1:
          return `<i class="fas fa-dolly"></i>`;
        case 2:
          return `<i class="fas fa-dolly-flatbed"></i>`;
      }
    }
  }
};
</script>

<style scoped>
.card-slot {
  width: 100px;
  height: 150px;
  margin: 10px;
  font-size: 25px;
  position: relative;
  background-color: lightgray;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 15px black inset;
}
.card-slot:hover {
  box-shadow: 3px 3px 20px black inset;
}
</style>