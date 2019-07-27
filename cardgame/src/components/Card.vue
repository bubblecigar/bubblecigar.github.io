<template>
  <div class="card-wrapper" :class="[card.side]" @mousedown="cardPicked">
    <div class="card-front card unselectable" :class="[card.color]">
      <span class="banner-top banner">
        <i :class="card.suit" v-html="suit_Icon(card.suit)"></i>
        <i>{{point_AKQJ(card.point)}}</i>
      </span>
      <span class="card-body" v-html="point_PIC(card.point)"></span>
      <span class="banner-bottom banner">
        <i :class="card.suit" v-html="suit_Icon(card.suit)"></i>
        <i>{{point_AKQJ(card.point)}}</i>
      </span>
      <div class="front-cover"></div>
    </div>
    <div class="card-back card"></div>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: false,
      default() {
        return {
          id: 0,
          side: "up" || "down",
          color: "black" || "red",
          suit: "spade" || "heart" || "diamond" || "club",
          point: 0
        };
      }
    },
    indexs: {
      type: Object,
      required: false,
      default() {
        return {
          gi: -1,
          si: -1,
          ci: -1
        };
      }
    }
  },
  methods: {
    cardPicked(e) {
      const layerCoord = {
        layerX: e.layerX,
        layerY: e.layerY
      };
      this.$emit("cardPicked", this.indexs, layerCoord);
    },
    point_AKQJ(point) {
      switch (point) {
        case 1:
          return "A";
        case 13:
          return "K";
        case 12:
          return "Q";
        case 11:
          return "J";
        default:
          return point;
      }
    },
    point_PIC(point) {
      switch (point) {
        case 1:
          return `<i class="fas fa-chess-bishop"></i>`;
        case 13:
          return `<i class="fas fa-chess-king"></i>`;
        case 12:
          return `<i class="fas fa-chess-queen"></i>`;
        case 11:
          return `<i class="fas fa-chess-knight"></i>`;
        default:
          return point;
      }
    },
    suit_Icon(suit) {
      switch (suit) {
        case "spade":
          return `<i class="fas fa-seedling"></i>`;
        case "heart":
          return `<i class="fas fa-water"></i>`;
        case "diamond":
          return `<i class="fas fa-cloud"></i>`;
        case "club":
          return `<i class="fas fa-carrot"></i>`;
      }
    }
  }
};
</script>

<style scoped>
.card-wrapper {
  width: 100px;
  height: 150px;
  border-radius: 15px;
  position: absolute;
  transform-style: preserve-3d;
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.5);
  transition: transform 0.6s, top 2s;
}
.card-hover:hover {
  cursor: pointer;
  box-shadow: -2px -2px 10px black;
  transform: translateY(-5px);
}
.card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  font-size: 20px;
}
.card-wrapper.down {
  transform: rotateY(180deg);
}
.card-front {
  background-color: azure;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  font-weight: bold;
}
.front-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.banner {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;
}
.banner-bottom {
  transform: rotateZ(180deg);
}
.card-body {
  font-size: 50px;
  font-weight: bolder;
}
.card-back {
  background-color: rgb(45, 155, 100);
  color: white;
  transform: rotateY(180deg);
}
.down {
  transform: rotate(180deg);
}
.red {
  /* color: crimson; */
  background-color: lightskyblue;
  color: lightcyan;
}
.black {
  color: white;
  background-color: rgb(240, 90, 45);
}
.spade {
}
.heart {
}
.diamond {
}
.club {
}
</style>
