import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const baseURL = "https://deezerdevs-deezer.p.rapidapi.com/";

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    "x-rapidapi-key": "6cd836535cmshdbf7a9ffa1c7eabp19e82bjsne539f53f3220"
  }
});

export default new Vuex.Store({
  state: {
    songs: [],
    song: {
      id: 561856792,
      readable: true,
      title: "Always Remember Us This Way",
      title_short: "Always Remember Us This Way",
      title_version: "",
      link: "https://www.deezer.com/track/561856792",
      duration: 210,
      rank: 974069,
      explicit_lyrics: false,
      explicit_content_lyrics: 0,
      explicit_content_cover: 1,
      preview:
        "https://cdns-preview-0.dzcdn.net/stream/c-0ed0308396f779b677c4d146c5eeb2a9-5.mp3",
      artist: {
        id: 75491,
        name: "Lady Gaga",
        link: "https://www.deezer.com/artist/75491",
        picture: "https://api.deezer.com/artist/75491/image",
        picture_small:
          "https://e-cdns-images.dzcdn.net/images/artist/c467c1ffc64c8ef18467838c97f26014/56x56-000000-80-0-0.jpg",
        picture_medium:
          "https://e-cdns-images.dzcdn.net/images/artist/c467c1ffc64c8ef18467838c97f26014/250x250-000000-80-0-0.jpg",
        picture_big:
          "https://e-cdns-images.dzcdn.net/images/artist/c467c1ffc64c8ef18467838c97f26014/500x500-000000-80-0-0.jpg",
        picture_xl:
          "https://e-cdns-images.dzcdn.net/images/artist/c467c1ffc64c8ef18467838c97f26014/1000x1000-000000-80-0-0.jpg",
        tracklist: "https://api.deezer.com/artist/75491/top?limit=50",
        type: "artist"
      },
      album: {
        id: 74434962,
        title: "A Star Is Born Soundtrack",
        cover: "https://api.deezer.com/album/74434962/image",
        cover_small:
          "https://e-cdns-images.dzcdn.net/images/cover/88a8288e14f61ffa39c14ac2ef9210d8/56x56-000000-80-0-0.jpg",
        cover_medium:
          "https://e-cdns-images.dzcdn.net/images/cover/88a8288e14f61ffa39c14ac2ef9210d8/250x250-000000-80-0-0.jpg",
        cover_big:
          "https://e-cdns-images.dzcdn.net/images/cover/88a8288e14f61ffa39c14ac2ef9210d8/500x500-000000-80-0-0.jpg",
        cover_xl:
          "https://e-cdns-images.dzcdn.net/images/cover/88a8288e14f61ffa39c14ac2ef9210d8/1000x1000-000000-80-0-0.jpg",
        tracklist: "https://api.deezer.com/album/74434962/tracks",
        type: "album"
      },
      type: "track"
    },
    songIndex: 0,
    totalSongs: 0,
    volume: 1,
    duration: 1,
    current: 0
  },
  mutations: {
    SET_SONGS({ state }, songs) {
      this.state.songs = songs;
    },
    SET_SONG({ state }, index) {
      this.state.song = this.state.songs[index];
    },
    ADD_SONG_INDEX({}) {
      this.state.songIndex++;
    },
    RESET_SONG_INDEX({}) {
      this.state.songIndex = 0;
    },
    SET_SONG_INDEX({}, index) {
      this.state.songIndex = index;
    },
    SET_TOTAL_SONGS({ state }, total) {
      this.state.totalSongs = total;
    },
    SET_VOLUME({ state }, percentage) {
      this.state.volume = percentage;
    },
    SET_DURATION({ state }, duration) {
      this.state.duration = duration;
    },
    SET_CURRENT({ state }, percentage) {
      this.state.current = percentage;
    }
  },
  actions: {
    searchSongs({}, { keywords, index }) {
      apiClient
        .get(`search?q=${keywords}&index=${index}`)
        .then(result => {
          this.commit("SET_SONGS", result.data.data);
          this.commit("SET_TOTAL_SONGS", result.data.total);
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectSong({}, index) {
      this.commit("SET_SONG_INDEX", index);
    },
    nextSong({}) {
      if (this.state.songIndex === this.state.songs.length - 1) {
        this.commit("RESET_SONG_INDEX");
      } else {
        this.commit("ADD_SONG_INDEX");
      }
    }
  }
});
