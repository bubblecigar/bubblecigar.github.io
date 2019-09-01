<template>
  <div class="wrapper">
    <article>
      <h1>
        <i class="far fa-paper-plane"></i>
        Features
      </h1>
      <section>
        <h2>
          <i class="fas fa-broadcast-tower"></i>
          Connection state
        </h2>
        <p>
          There are four connection states: connecting, open (show connected channel), closing, and
          <span
            class="alert"
          >offline</span>.
        </p>
        <p>
          When
          <span class="alert">offline</span>, the sending button
          <i class="far fa-paper-plane"></i> is locked.
        </p>
        <p>Click the tower to reconnect.</p>
      </section>
      <section>
        <h2>
          <i class="fas fa-paperclip"></i>
          Files
        </h2>
        <p>You can append multiple files.</p>
        <p>Image, Audio, and Video will be directly displayed in the ChatBox.</p>
        <p>
          Files with other type will be sent as a
          <i
            class="far fa-file"
            style="text-decoration: underline"
          >&nbsp;download</i> link.
        </p>
      </section>
      <section>
        <h2>
          <i class="far fa-laugh"></i>
          Emoticons
        </h2>
        <p>
          A subset of
          <a target="_BLANK" href="https://getemoji.com/" class="external-link">
            <i class="fas fa-link"></i>emoji.com
          </a>:
        </p>
        <p>😀🤢😈👽🤖🐷🐹🐭🐮🐠🍔🍟🍎🥥🥝🚝🛵🏰🚁🗻</p>
        <p>🕶👕👚👛🧶⛑❤️🧡🖤🇦🇷🇨🇾🇹🇩🏳️‍🌈🏴‍☠️🇪🇺🏴‍☠️</p>
        <p>🥍🤸🏾‍♂️🏋🏽‍♀️🎾⚾️🏀🏈🥌🤸🏿‍♂️👧🏼👩🏼‍🎤👨🏼‍🎤🕵🏼‍♀️👨🏼‍🚒💆🏼🙍🏼🏃🏼✊🏼🙏🏼</p>
        <p>...and more.</p>
      </section>
    </article>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.alert {
  color: tomato;
  font-weight: bold;
}
</style>