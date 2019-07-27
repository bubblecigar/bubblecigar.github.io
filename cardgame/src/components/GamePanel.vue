<template>
  <div class="game-panel">
    <h1>
      <i class="fas fa-chess"></i>
      FreeCell&nbsp;
      <i class="fas fa-chess-board slant"></i>
    </h1>
    <p>level {{level}}</p>
    <p>
      <i class="fas fa-layer-group"></i>
      {{gameInfo.finishedCards}}
    </p>
    <p>
      <i class="fas fa-shoe-prints"></i>
      {{gameInfo.steps}}
    </p>

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    gameInfo: {
      type: Object
    },
    level: {
      type: Number,
      required: true
    }
  }
};
</script>

<style  scoped>
.game-panel {
  display: flex;
  flex-flow: row wrap;
  width: 962px;
  justify-content: space-evenly;
  align-items: center;
  padding: 60px 10px 30px 10px;
  font-family: "Kaushan Script", cursive;
  font-weight: bold;
  font-size: 20px;
}
h1 {
  margin-right: 40px;
  font-size: 40px;
  align-self: flex-start;
}
p {
  margin-right: 20px;
}
.slant {
  transform: rotate(30deg);
}
</style>