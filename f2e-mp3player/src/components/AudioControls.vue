<template>
  <div :class="{ hide: !'canplay' }">
    <audio :src="song.preview" id="main-audio" :loop="loop"></audio>
    <button v-if="isPaused" @click="play">play</button>
    <button v-if="!isPaused" @click="pause">pause</button>
    <button @click="mute">muted:{{ isMuted }}</button>
    <button @click="loop = !loop">loop? {{ loop }}</button>
    <button @click="toNextSong = !toNextSong">next? {{ toNextSong }}</button>
    <ControlBar :bindAttri="'volume'" :barWidth="300"></ControlBar>
    <span>:::</span>
    <ControlBar :bindAttri="'current'" :barWidth="300"></ControlBar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      audio: undefined,
      isPaused: undefined,
      isMuted: undefined,
      loop: false,
      canplay: false,
      toNextSong: false
    };
  },
  computed: {
    songs() {
      return this.$store.state.songs;
    },
    songIndex() {
      return this.$store.state.songIndex;
    },
    song() {
      return this.songs[this.songIndex];
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
  mounted() {
    const audio = document.querySelector("#main-audio");
    this.audio = audio;
    this.isPaused = audio.paused;
    this.isMuted = audio.muted;
    this.audio.addEventListener("canplay", () => {
      this.$store.commit("SET_DURATION", this.audio.duration);
      this.audio.autoplay = true;
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
      if (this.toNextSong === true) {
        this.$store.dispatch("nextSong");
      }
    });
  }
};
</script>

<style scoped>
.hide {
  opacity: 0;
}
</style>
