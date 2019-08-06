<template>
  <div class="search-log" @click="openMenu" :class="{fold:!showMenu}">
    <ul class="menu search-menu">
      <div class="wrapper-page">
        <span class="result">
          {{ searchingKeywords }}
          <i class="fas fa-long-arrow-alt-right"></i>
          {{totalSongs}} results
        </span>
        <button @click="prevPage" :class="{disable:page <= 0}">
          <i class="fas fa-caret-left"></i>
        </button>
        <span>page {{ page + 1 }}</span>
        <button @click="nextPage" :class="{disable:25 * (page + 1) > totalSongs}">
          <i class="fas fa-caret-right"></i>
        </button>
      </div>
      <div class="wrapper-li">
        <li
          v-for="(el, i) in songList"
          class="option"
          :class="{selected:isSelected(i)}"
          @click="select(i)"
          :key="i"
        >{{ el.title }}</li>
      </div>
    </ul>
    <div class="wrapper-functions">
      <h1>DeezerPreview</h1>
      <div class="wrapper-search">
        <button @click="search" class="search-btn">
          <i class="fas fa-search"></i>
        </button>
        <input type="text" v-model="keywords" @keydown="keydown" placeholder=":keywords" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keywords: "",
      songIndex: 0,
      page: 0,
      showMenu: false
    };
  },
  created() {
    document.querySelector("body").addEventListener("click", e => {
      let within = 0;
      e.path.forEach(el => {
        if (el.className && el.className.includes("search-log")) {
          within++;
        } else {
          // do nothing
        }
      });
      if (within === 0) {
        this.showMenu = false;
      }
    });
  },
  mounted() {
    this.keywords = "the muffin song";
    this.search();
  },
  methods: {
    openMenu() {
      this.showMenu = true;
    },
    keydown(e) {
      if (e.keyCode === 13) {
        this.search();
      }
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    nextPage() {
      if (25 * (this.page + 1) > this.totalSongs) {
        return;
      }
      this.page++;
      this.$store.dispatch("searchSongs", {
        keywords: this.keywords,
        index: 25 * this.page
      });
    },
    prevPage() {
      if (this.page <= 0) {
        return;
      }
      this.page--;
      this.$store.dispatch("searchSongs", {
        keywords: this.keywords,
        index: 25 * this.page
      });
    },
    search() {
      if (this.keywords.length === 0) {
        console.log("please enter keywords");
        return;
      }
      this.page = 0;
      this.$store.dispatch("searchSongs", {
        keywords: this.keywords,
        index: 25 * this.page
      });
    },
    isSelected(i) {
      if (this.$store.state.songIndex === i) {
        return true;
      }
      return false;
    },
    select(i) {
      this.songIndex = i;
      this.$store.dispatch("selectSong", this.songIndex);
    }
  },
  computed: {
    searchingKeywords() {
      return this.$store.state.keywords;
    },
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

.wrapper-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-main);
  margin: 10px;
}
.search-btn {
  border: 0;
  outline: 0;
  margin-left: 10px;
}
.disable {
  opacity: 0;
}
h1 {
  font-weight: bold;
  margin-left: 10px;
  font-size: 24px;
  color: var(--color-contrast);
}
button {
  border: 0;
  background: none;
  outline: none;
  font-size: var(--btn-size-small);
  color: var(--color-contrast);
}
button:hover {
  cursor: pointer;
}
button:active {
  color: var(--color-active);
}
input {
  border: 0;
  max-width: 20vw;
  color: var(--color-decoration);
  opacity: 0.7;
  outline: 0;
  font-weight: bold;
  font-size: 15px;
  padding: 4px;
  background-color: transparent;
}
input::placeholder {
  color: var(--color-decoration);
  opacity: 0.4;
}
.wrapper-functions {
  display: flex;
  flex-flow: row nowrap;
  margin-top: 20px;
  padding: 0 10px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.wrapper-search {
  display: flex;
  align-items: center;
}
.search-log {
  width: 90vw;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: var(--color-selectPanel);
  padding: 10px 0;
  border: 3px solid black;
  border-top: 0;
  align-self: center;
  border-radius: 0 0 30px 30px;
  box-shadow: 5px 8px 0 0px white;
  transform: translateY(100%));
  transition: transform 1s;
  z-index: 10;
}
.fold {
  transform: translateY(calc(-100% + 48px));
}
.menu {
  display: flex;
  flex-flow: column;
  text-align: left;
  opacity: 1;
  width: 100%;
  font-weight: bold;
  transition: transform 0.6s;
}
.wrapper-li {
  overflow: scroll;
  max-height:50vh;
  color: var(--color-main);
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 5px 0 0 0;
  /* box-shadow: 0 0px 6px 0px var(--color-opacity) inset; */
  border: 3px solid black;
  margin: 0 15px;
}
span {
  color: var(--color-contrast);
}
.result {
  color: var(--color-contrast);
  text-align: left;
  vertical-align: bottom;
  margin: 5px;
  margin-right: auto;
  padding: 5px;
}

.option {
  margin: 8px;
  padding: 8px;
  background: var(--color-selectPanel);
  border-radius: 40px;
  box-shadow: 0 0 6px 0px var(--color-opacity) inset ;
  font-size: 12px;
}
li.selected {
  background-color: var(--color-active);
  color: white;
}
.option:hover {
  cursor: pointer;
}
</style>
