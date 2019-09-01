<template>
  <article>
    <h1>
      <i class="fas fa-user-cog setting"></i>
      Settings
    </h1>
    <section>
      <h2>
        <i class="fas fa-user"></i> username
      </h2>
      <p>Accept any valid string, (ㆁᴗㆁ✿).</p>
    </section>
    <section>
      <h2>
        <i class="fas fa-bell"></i> alert
      </h2>
      <p>If set to be on and the ChatBox is folded, there will be an alert sound on messaged.</p>
    </section>
    <section>
      <h2>
        <i class="fas fa-broadcast-tower"></i> channel
      </h2>
      <p>Messages will only be passed between ChatBox sharing the same channel.</p>
    </section>
    <section>
      <h2>
        <i class="fas fa-palette"></i> color scheme
      </h2>
      <p>Main color associates with message panel, emoji picker, and setting panel itself.</p>
      <p>Minor color associates with folding bar, input bar, selected button, and background of emoji picker.</p>
    </section>
    <section>
      <h2>
        <i class="fas fa-tools"></i> tools
      </h2>
      <p>All settings are automatically saved to your local storage, but you can clear it by clicking the "clear storage".</p>
      <p>Messages only live with the page, so they'll be cleared as the page reload.</p>
      <p>If for some reasons you don't want to reload the page, click "clear messages" to do the job.</p>
    </section>
  </article>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>