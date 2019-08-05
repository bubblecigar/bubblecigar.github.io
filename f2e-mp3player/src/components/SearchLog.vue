<template>
  <div class="search-log">
    <button @click="toggleMenu">toggle menu</button>
    <input type="text" v-model="keywords" />
    <button @click="search">search</button>
    <span>{{ totalSongs }} result</span>
    <ul class="menu" v-if="showMenu">
      <span>showing {{ 25 * page }} to {{ 25 * (page + 1) }}</span>
      <button @click="prevPage" v-if="page > 0">prev</button>
      <button @click="nextPage" v-if="25 * (page + 1) < totalSongs">
        next
      </button>
      <li
        v-for="(el, i) in songList"
        class="option"
        @click="select(i)"
        :key="i"
      >
        {{ el.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keywords: "",
      songIndex: 0,
      page: 0,
      showMenu: true
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    nextPage() {
      this.page++;
      this.$store.dispatch("searchSongs", {
        keywords: this.keywords,
        index: 25 * this.page
      });
    },
    prevPage() {
      this.page--;
      this.$store.dispatch("searchSongs", {
        keywords: this.keywords,
        index: 25 * this.page
      });
    },
    search() {
      this.showMenu = true;
      this.page = 0;
      this.$store.dispatch("searchSongs", {
        keywords: this.keywords,
        index: 25 * this.page
      });
    },
    select(i) {
      this.songIndex = i;
      this.$store.dispatch("selectSong", this.songIndex);
    }
  },
  computed: {
    songList() {
      return this.$store.state.songs;
    },
    totalSongs() {
      return this.$store.state.totalSongs;
    }
  }
};
</script>

<style scoped>
.menu {
  display: flex;
  flex-flow: column;
  position: absolute;
  background-color: white;
  text-align: left;
}
.option {
}
.option:hover {
  background-color: pink;
  cursor: pointer;
}
</style>
