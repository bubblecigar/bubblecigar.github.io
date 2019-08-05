<template>
  <div class="song-card" v-if="isReady">
    <AudioControls></AudioControls>
    <h1>{{ title }}</h1>
    <p>artist: {{ artist.name }}</p>
    <img :src="artist.picture_big" alt />
  </div>
</template>

<script>
export default {
  computed: {
    songIndex() {
      return this.$store.state.songIndex;
    },
    song() {
      return this.$store.state.songs[this.songIndex];
    },
    title() {
      return this.song.title;
    },
    artist() {
      return this.song.artist;
    },
    isReady() {
      if (this.song) {
        return true;
      }
      return false;
    }
  },
  created() {}
};
</script>

<style scoped>
.song-card {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}
</style>
