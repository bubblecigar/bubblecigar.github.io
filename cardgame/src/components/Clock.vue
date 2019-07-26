<template>
  <div class="game-clock" :class="{alert:needStart}">
    <i class="fas fa-clock"></i>
    <span>{{stampToTime.minute}} : {{stampToTime.second}}</span>
  </div>
</template>

<script>
export default {
  props: {
    gameState: {
      type: String,
      required: false,
      default: "Win" || "Playing"
    },
    startingStamp: {
      type: Number,
      required: false,
      default: Date.now()
    }
  },
  data() {
    return {
      currentStamp: this.updateStamp(),
      working: true
    };
  },
  methods: {
    updateStamp() {
      this.currentStamp = Date.now();
      if (this.gameState === "Playing") {
        window.requestAnimationFrame(() => {
          this.updateStamp();
        });
      } else if (this.gameState === "Win") {
        this.$emit("timeUp", this.stampToTime);
        this.working = false;
        return 0;
      }
    },
    start() {
      this.working = true;
      this.startingStamp = Date.now();
      this.currentStamp = this.updateStamp();
    }
  },
  computed: {
    needStart() {
      if (this.working === false && this.gameState === "Playing") {
        this.start();
      }
      return false;
    },
    elapsedStamp() {
      const milisecond = this.currentStamp - this.startingStamp;
      let second = milisecond / 1000;
      let minute = Math.floor(second / 60);
      second = -minute * 60;
      return milisecond;
    },
    stampToTime() {
      let second = Math.floor(this.elapsedStamp / 1000);
      let minute = Math.floor(second / 60);
      second -= minute * 60;
      second = "00" + second.toString();
      second = second[second.length - 2] + second[second.length - 1];
      minute = "00" + minute.toString();
      minute = minute[minute.length - 2] + minute[minute.length - 1];
      return {
        second,
        minute
      };
    }
  }
};
</script>

<style scoped>
i {
  margin-right: 10px;
}
.alert {
  color: darkorange;
}
</style>