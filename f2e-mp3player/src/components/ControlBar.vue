<template>
  <div class="position-wrapper" :class="{ left: !label_lr, right: label_lr }">
    <div class="before">
      <slot name="before"></slot>
    </div>
    <div class="after">
      <slot name="after"></slot>
    </div>
    <div
      class="container"
      :style="containerStyle"
      @mousemove="drag"
      @mousedown="blink"
      :id="id"
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
    },
    unit: {
      type: String,
      required: false,
      default: "px"
    },
    id: {
      type: String,
      required: true
    },
    label_lr: {
      type: Boolean,
      required: false,
      default: true
    },
    flyIcon: {
      type: String,
      required: false,
      default: "<i>hi</i>"
    }
  },
  methods: {
    flyIcon() {
      const classString = this.flyIcon;
      return `<i>${classString}</i>`;
    }
  },
  data() {
    return {
      barDOM: undefined,
      _barWidth: this.barWidth
    };
  },
  computed: {
    percentage() {
      return this.$store.state[this.bindAttri];
    },
    filledStyle() {
      return {
        width: `${this.percentage * this._barWidth}px`
      };
    },
    containerStyle() {
      return {
        width: `${this.barWidth}${this.unit}`
      };
    }
  },
  mounted() {
    this.barDOM = document.querySelector(`#${this.id}`);
    this.checkElementWidth();
  },
  methods: {
    checkElementWidth() {
      if (this.barDOM.clientWidth != this._barWidth) {
        this._barWidth = this.barDOM.clientWidth;
      }
      window.requestAnimationFrame(() => {
        this.checkElementWidth();
      });
    },
    drag(e) {
      if (e.buttons === 1) {
        let newPercentage = e.offsetX / this._barWidth;
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
      let newPercentage = e.offsetX / this._barWidth;
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
.position-wrapper {
  padding: 3px;
  margin: 3px;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  background-color: white;
  height: var(--bar-size-small);
  border-left: 0px solid var(--color-decoration);
  border-radius: calc(var(--bar-size-small) * 0.5);
  position: relative;
  overflow: hidden;
  z-index: 0;
  border: 3px solid black;
}
.filled {
  height: 100%;
  background-color: var(--color-decoration);
  position: relative;
  transform: translate3d(-2px, 30%, 0);
  border-radius: 0 calc(var(--bar-size-small) * 0.5)
    calc(var(--bar-size-small) * 0.5) 0;
}

.after,
.before {
  /* position: absolute;
  left: 0; */
}
</style>
