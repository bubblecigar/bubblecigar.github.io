<template>
  <article>
    <h1>
      <i class="fab fa-vuejs"></i>
      ChatBox.vue
    </h1>
    <section>
      <h2>
        <i class="far fa-comment-dots"></i>
        About
      </h2>
      <p>
        ChatBox is a vue component built on top of
        <a
          target="_BLANK"
          href="https://www.websocket.in/"
          class="external-link"
        >
          <i class="fas fa-link"></i> WebSocket.in
        </a>, which is an open and free WebSocket server for bi-direction data transmission usage.
      </p>
    </section>
    <section>
      <h2>
        <i class="fas fa-hammer"></i>
        Usage
      </h2>
      <p>You may use ChatBox to simulate client-client side real-time communication, and bypassing all server side stuff.</p>
      <p>There are two ChatBoxs fixed at the bottom of the page. Try to type and send something, then you'll see them communicating with each other.</p>
      <p>
        Other functionalities are written in
        <router-link to="/features">#Features</router-link>&nbsp;and&nbsp;
        <router-link to="/settings">#Settings</router-link>.
      </p>
      <p>
        To customize channel and style, see
        <router-link to="/documentation">#Documentation</router-link>.
      </p>
    </section>
    <section>
      <h2>
        <i class="fas fa-file-download"></i>
        Download SFC
      </h2>
      <p>
        <a href="./downloadSrc/ChatBox.vue" download>ChatBox.vue</a>
      </p>
      <p>
        <a href="./downloadSrc/MessageBlock.vue" download>MessageBlock.vue</a>
      </p>
      <p>
        <a href="./downloadSrc/EmojiPicker.vue" download>EmojiPicker.vue</a>
      </p>
    </section>
    <section>
      <h1>
        <i class="fas fa-bezier-curve"></i>
        Dependencies
      </h1>
      <p class="dependency">
        <a target="_BLANK" href="https://fontawesome.com/" class="external-link">
          <i class="fas fa-link"></i>
          FontAwesome
        </a>
      </p>
      <p class="code-block dependency">
        <span>
          &lt;script src="https://kit.fontawesome.com/
          <b>{ your kit }</b> .js">&lt;script>
        </span>
      </p>
      <p class="dependency">
        <a target="_BLANK" href="https://github.com/marcuswestin/store.js/" class="external-link">
          <i class="fas fa-link"></i>
          store.js
        </a>
      </p>
      <p class="code-block dependency">
        <span>&lt;script src="https://cdn.jsdelivr.net/npm/store-js@2.0.4/dist/store.legacy.min.js">&lt;script></span>
      </p>
    </section>
  </article>
</template>
