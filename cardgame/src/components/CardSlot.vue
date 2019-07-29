<template>
  <div
    class="card-slot unselectable background-pattern"
    @mouseup="slotPicked"
    @touchstart="slotTouched"
  >
    <div class="hint" v-html="hint"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    touchDevice: {
      type: Boolean,
      required: false,
      default: false
    },
    indexs: {
      type: Object,
      required: true
    }
  },
  methods: {
    slotTouched(e) {
      this.$emit("slotTouched", this.indexs);
    },
    slotPicked() {
      if (this.touchDevice === true) {
        return;
      }
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
      return false;
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

.background-pattern {
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100' height='50' viewBox='0 0 100 50'%3E%3Cdefs%3E%3Crect stroke='%23ffffff' stroke-width='0.1' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='2' height='2' patternUnits='userSpaceOnUse'%3E%3Cg stroke='%23ffffff' stroke-width='0.1'%3E%3Crect fill='%23fafafa' width='1' height='1'/%3E%3Crect fill='%23ffffff' width='1' height='1' x='1' y='1'/%3E%3Crect fill='%23f5f5f5' width='1' height='1' y='1'/%3E%3Crect fill='%23f0f0f0' width='1' height='1' x='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='b' width='5' height='11' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23ebebeb'%3E%3Cuse xlink:href='%23s' x='2' y='0'/%3E%3Cuse xlink:href='%23s' x='4' y='1'/%3E%3Cuse xlink:href='%23s' x='1' y='2'/%3E%3Cuse xlink:href='%23s' x='2' y='4'/%3E%3Cuse xlink:href='%23s' x='4' y='6'/%3E%3Cuse xlink:href='%23s' x='0' y='8'/%3E%3Cuse xlink:href='%23s' x='3' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='7' height='7' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23e5e5e5'%3E%3Cuse xlink:href='%23s' x='1' y='1'/%3E%3Cuse xlink:href='%23s' x='3' y='4'/%3E%3Cuse xlink:href='%23s' x='5' y='6'/%3E%3Cuse xlink:href='%23s' x='0' y='3'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='11' height='5' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23ffffff'%3E%3Cuse xlink:href='%23s' x='1' y='1'/%3E%3Cuse xlink:href='%23s' x='6' y='3'/%3E%3Cuse xlink:href='%23s' x='8' y='2'/%3E%3Cuse xlink:href='%23s' x='3' y='0'/%3E%3Cuse xlink:href='%23s' x='0' y='3'/%3E%3C/g%3E%3Cg fill='%23e0e0e0'%3E%3Cuse xlink:href='%23s' x='8' y='3'/%3E%3Cuse xlink:href='%23s' x='4' y='2'/%3E%3Cuse xlink:href='%23s' x='5' y='4'/%3E%3Cuse xlink:href='%23s' x='10' y='0'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='23' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23BA7'%3E%3Cuse xlink:href='%23s' x='2' y='5'/%3E%3Cuse xlink:href='%23s' x='23' y='13'/%3E%3Cuse xlink:href='%23s' x='4' y='18'/%3E%3Cuse xlink:href='%23s' x='35' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='61' height='31' patternUnits='userSpaceOnUse'%3E%3Cg fill='%23BA7'%3E%3Cuse xlink:href='%23s' x='16' y='0'/%3E%3Cuse xlink:href='%23s' x='13' y='22'/%3E%3Cuse xlink:href='%23s' x='44' y='15'/%3E%3Cuse xlink:href='%23s' x='12' y='11'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='100' height='50'/%3E%3Crect fill='url(%23b)' width='100' height='50'/%3E%3Crect fill='url(%23c)' width='100' height='50'/%3E%3Crect fill='url(%23d)' width='100' height='50'/%3E%3Crect fill='url(%23e)' width='100' height='50'/%3E%3Crect fill='url(%23f)' width='100' height='50'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  background-repeat: repeat;
}
</style>