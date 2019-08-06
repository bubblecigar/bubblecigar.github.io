<template>
  <div class="button-big scheme-color">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.button-big {
  width: var(--btn-size-big);
  height: calc(var(--btn-size-big) / 2);
  border-radius: calc(var(--btn-size-big) * 2) calc(var(--btn-size-big) * 2) 0 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  padding: 5px;
  top: 0;
  left: 50%;
  z-index: 10;
  transform: translate3d(-50%, -100%, 0);
  box-shadow: var(--shadow-contrast);
  font-size: calc(var(--btn-size-big) / 5);
  color: var(--color-contrast);
  border: 3px solid black;
  border-bottom: 0;
}
.scheme-color {
  background-color: var(--color-controlPanel);
}
img {
  width: 25px;
}
.button-big:hover {
  cursor: pointer;
}
.button-big:active {
  color: var(--color-active);
}
</style>
