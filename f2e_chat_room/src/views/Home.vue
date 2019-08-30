<template>
  <div class="home">
    <p>
      <ChatBox :id="rollID()"></ChatBox>
      <ChatBox :id="rollID()"></ChatBox>
    </p>
  </div>
</template>

<script>
// @ is an alias to /src
import ChatBox from "@/components/ChatBox.vue";
export default {
  name: "home",
  components: { ChatBox },
  methods: {
    rollID() {
      return "chat-box-" + Math.floor(Math.random() * 100000000);
    }
  }
};
</script>

<style lang="scss" scoped>
iframe {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
p {
  display: flex;
  height: 300px;
  position: fixed;
  width: 100%;
  bottom: 0;
  flex-flow: row;
  align-items: flex-end;
  justify-content: space-evenly;
  > * {
    width: 49%;
  }
}
</style>
