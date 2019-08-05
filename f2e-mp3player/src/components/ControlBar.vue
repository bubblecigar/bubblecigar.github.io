<template>
  <div>
    <div
      class="container"
      :style="containerStyle"
      @mousemove="drag"
      @click="blink"
    >
      <div class="filled" :style="filledStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bindAttri: {
      type: String,
      required: true
    },
    barWidth: {
      type: Number,
      required: false,
      default: 150
    }
  },
  data() {
    return {};
  },
  computed: {
    percentage() {
      return this.$store.state[this.bindAttri];
    },
    filledStyle() {
      return {
        width: `${this.percentage * this.barWidth}px`
      };
    },
    containerStyle() {
      return {
        width: `${this.barWidth}px`
      };
    }
  },
  methods: {
    drag(e) {
      if (e.buttons === 1) {
        let newPercentage = e.offsetX / this.barWidth;
        if (newPercentage > 1) {
          newPercentage = 1;
        }
        if (newPercentage < 0) {
          newPercentage = 0;
        }
        this.$store.commit(
          `SET_${this.bindAttri.toUpperCase()}`,
          newPercentage
        );
      }
    },
    blink(e) {
      let newPercentage = e.offsetX / this.barWidth;
      if (newPercentage > 1) {
        newPercentage = 1;
      }
      if (newPercentage < 0) {
        newPercentage = 0;
      }
      this.$store.commit(`SET_${this.bindAttri.toUpperCase()}`, newPercentage);
    }
  }
};
</script>

<style scoped>
.container {
  background-color: gray;
  height: 20px;
}
.filled {
  height: 100%;
  background-color: pink;
}
</style>
