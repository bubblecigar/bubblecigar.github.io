<template>
  <div class="song-card" v-if="isReady">
    <div class="info" @click="toggleSelect">
      <img :src="artist.picture_xl" :class="{hide:select==='artist'}" />
      <img :src="album.cover_xl" :class="{hide:select==='album'}" />
      <span class="label">
        <i class="artist" :class="{hide:select==='artist'}">artist</i>
        <i class="album" :class="{hide:select==='album'}">album</i>
      </span>

      <h3 class="artist" :class="{hide:select==='artist'}">{{artist.name}}</h3>
      <h3 class="album" :class="{hide:select==='album'}">{{album.title}}</h3>
    </div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: "artist"
    };
  },
  methods: {
    toggleSelect() {
      if (this.select === "artist") {
        this.select = "album";
      } else {
        this.select = "artist";
      }
    }
  },
  computed: {
    songIndex() {
      return this.$store.state.songIndex;
    },
    album() {
      return this.song.album;
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
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin: 0;
  background-size: contain;
  background-repeat: no-repeat;
  max-height: 80vh;
  /* overflow: scroll; */
}
.info {
  width: 80vw;
  height: 80vw;
  max-width: 70vh;
  max-height: 70vh;
  position: absolute;
  bottom: 50%;
  transform: translateY(50%);
  border: 3px solid black;
  box-shadow: 15px -10px 0 0px white;
  border-radius: 5vw;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.info:hover {
  cursor: pointer;
}
.album-label {
  right: 30vw;
  z-index: 0;
}
span,
h3 {
  position: absolute;
  bottom: 100%;
  right: 10%;
}
i,
h3 {
  box-shadow: 15px -10px 0 0px white;
  border-radius: 20px 20px 0 0;
  background: white;
  padding: 10px 15px 0 20px;
  margin: 0 3px;
  font-size: 20px;
  font-weight: bold;
  border: 3px solid black;
  border-bottom: 0;
}
h3 {
  white-space: nowrap;
  height: 2em;
  bottom: 2%;
  right: 50%;
  max-width: 70%;
  transform: translateX(50%);
  box-shadow: none;
  overflow: scroll;
}
img {
  width: 95%;
  height: 95%;
  border-radius: 5vw;
  border: 3px solid black;
}
.artist,
.album {
  color: var(--color-darker);
}
.hide {
  display: none;
}
</style>
