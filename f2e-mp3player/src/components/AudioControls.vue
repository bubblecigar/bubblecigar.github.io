<template>
  <div class="position-wrapper audio-controls">
    <div class="customized-control" :class="{ fold: fold }">
      <audio :src="song.preview" id="main-audio" :loop="loop"></audio>
      <div class="wrapper-btns">
        <Button_Big @click.native="playOrPause">
          <i class="fas fa-pause" :class="{ hide: isPaused }"></i>
          <i class="fas fa-play" :class="{ hide: !isPaused }"></i>
        </Button_Big>
        <Button_Medium :left="calcLeft('-10% - 70px')" @click.native="prevSong" :lr="false">
          <i class="fas fa-backward"></i>
        </Button_Medium>
        <Button_Medium :left="calcLeft('10% + 70px')" @click.native="nextSong">
          <i class="fas fa-forward"></i>
        </Button_Medium>
      </div>

      <div class="wrapper-vol-controler flex-row">
        <ControlBar
          :bindAttri="'volume'"
          :barWidth="80"
          :unit="'vw'"
          :id="'volume-bar'"
          :label_lr="true"
        >
          <Button_Small @click.native="mute" slot="before">
            <i class="fas fa-volume-mute" v-if="isMuted"></i>
            <i class="fas fa-volume-up" v-if="!isMuted"></i>
          </Button_Small>
        </ControlBar>
      </div>
      <div class="wrapper-pro-controler flex-row">
        <ControlBar
          :bindAttri="'current'"
          :barWidth="80"
          :unit="'vw'"
          :id="'progress-bar'"
          :label_lr="false"
        >
          <Button_Small eventName="switchMode" @switchMode="switchMode" slot="after">
            <i class="fas fa-infinity" v-if="playeMode === 'loop'"></i>
            <i class="fas fa-ban" v-if="playeMode === 'stop'"></i>
            <i class="fas fa-long-arrow-alt-right" v-if="playeMode === 'next'"></i>
            <i class="fas fa-dice" v-if="playeMode === 'random'"></i>
          </Button_Small>
        </ControlBar>
      </div>
      <div class="shadowBlocker" @click="fold = !fold"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      audio: undefined,
      isPaused: undefined,
      isMuted: undefined,
      canplay: false,
      toNextSong: false,
      hide: true,
      fold: true,
      playeMode: "loop" || "next" || "stop" || "random"
    };
  },
  computed: {
    loop() {
      return this.playeMode === "loop";
    },
    songs() {
      return this.$store.state.songs;
    },
    songIndex() {
      return this.$store.state.songIndex;
    },
    song() {
      if (this.songs[this.songIndex]) {
        return this.songs[this.songIndex];
      }
      return {};
    },
    volume() {
      return this.$store.state.volume;
    },
    current() {
      return this.$store.state.current;
    },
    duration() {
      return this.$store.state.duration;
    }
  },
  watch: {
    volume() {
      this.audio.volume = this.volume;
    },
    current() {
      if (
        Math.abs(this.current * this.duration - this.audio.currentTime) > 0.05
      ) {
        this.audio.currentTime = this.current * this.duration;
      }
    },
    song() {
      this.initialize();
    }
  },
  methods: {
    calcLeft(cssValue) {
      return `calc(50% + ${cssValue})`;
    },
    playOrPause() {
      if (this.isPaused) {
        this.play();
      } else {
        this.pause();
      }
    },
    nextSong() {
      this.$store.dispatch("nextSong");
    },
    prevSong() {
      this.$store.dispatch("prevSong");
    },
    switchMode() {
      switch (this.playeMode) {
        case "stop":
          this.playeMode = "loop";
          this.audio.loop = true;
          break;
        case "loop":
          this.playeMode = "next";
          this.audio.loop = false;
          break;
        case "next":
          this.playeMode = "random";
          this.audio.loop = false;
          break;
        case "random":
          this.playeMode = "stop";
          this.audio.loop = false;
          break;
      }
    },
    initialize() {
      this.isPaused = true;
      this.audio.oncanplay = () => {
        this.$store.commit("SET_DURATION", this.audio.duration);
      };
    },
    mute() {
      this.audio.muted = !this.audio.muted;
      this.isMuted = !this.isMuted;
    },
    play() {
      this.audio.play();
    },
    pause() {
      this.audio.pause();
    },
    updateCurrent() {
      this.$store.commit(
        "SET_CURRENT",
        this.audio.currentTime / this.$store.state.duration
      );
    }
  },
  created() {
    document.querySelector("body").addEventListener("click", e => {
      let within = 0;
      e.path.forEach(el => {
        if (el.className && el.className.includes("audio-controls")) {
          within++;
        } else {
          // do nothing
        }
      });
      if (within === 0) {
        this.fold = true;
      }
    });
  },
  mounted() {
    const audio = document.querySelector("#main-audio");
    this.audio = audio;
    this.isPaused = audio.paused;
    this.isMuted = audio.muted;
    this.audio.addEventListener("canplay", () => {
      this.$store.commit("SET_DURATION", this.audio.duration);
      this.audio.autoplay = true;
      this.hide = false;
    });
    this.$store.commit("SET_VOLUME", this.audio.volume);

    this.audio.addEventListener("timeupdate", () => {
      this.canplay = true;
      this.updateCurrent();
    });
    this.audio.addEventListener("play", () => {
      this.isPaused = false;
    });
    this.audio.addEventListener("pause", () => {
      this.isPaused = true;
    });
    this.audio.addEventListener("ended", () => {
      if (this.playeMode === "next") {
        this.$store.dispatch("nextSong");
      } else if (this.playeMode === "random") {
        this.$store.dispatch("randomSong");
      }
    });
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
.fold {
  transform: translateY(calc(100% - 20px));
}
.wrapper-btns {
  width: 100%;
}
.customized-control {
  padding: 20px;
  padding-bottom: 10px;
  width: 100vw;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background-color: var(--color-controlPanel);
  box-shadow: var(--shadow-contrast);
  z-index: 11;
  transition: transform 1s;
}
.shadowBlocker {
  position: absolute;
  background: var(--color-controlPanel);
  top: -5px;
  z-index: 0;
  height: 25px;
  width: 100%;
  margin-bottom: 10px;
  color: white;
  border-top: 3px solid black;
}
.shadowBlocker:hover {
  cursor: pointer;
  color: black;
}
.position-wrapper {
  margin-top: auto;
}

.flex-row {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}
</style>
