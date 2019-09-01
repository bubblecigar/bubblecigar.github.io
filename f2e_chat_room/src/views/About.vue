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
      <p>There are two ChatBoxs fixed at the bottom of the page. Try to type and send something, and you can see them communicating with each other. There should be a delay between sending and receiving, which tells they are in fact communicating via the server of WebSocket.in.</p>
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
  </article>
</template>
