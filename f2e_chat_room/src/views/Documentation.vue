<template>
  <div class="wrapper">
    <article>
      <h1>
        <i class="fas fa-book"></i>
        Documentation
      </h1>
      <section>
        <h2>
          <i class="fas fa-cube"></i>
          Vue component
        </h2>
        <p class="code-block">
          <span>
            &lt; ChatBox&nbsp;
            <b>id="chatbox1"</b>/ >
          </span>
        </p>
      </section>
      <section>
        <h2>
          <i class="fas fa-dna"></i>
          props:
        </h2>
        <table>
          <tr>
            <th>prop</th>
            <th>type</th>
            <th>require</th>
            <th>default</th>
          </tr>
          <tr>
            <td>id</td>
            <td>String</td>
            <td class="alert-text">true</td>
            <td class="array">
              <span class="alert-text">- -</span>
            </td>
          </tr>
          <tr>
            <td>panelHeight</td>
            <td>String</td>
            <td>false</td>
            <td class="array">
              <span>300px</span>
            </td>
          </tr>
          <tr>
            <td>channelList</td>
            <td>Array</td>
            <td>false</td>
            <td class="array">
              <span>Global</span>
              <span>Food</span>
              <span>Music</span>
              <span>Movie</span>
              <span>Book</span>
              <span>Relationship</span>
              <span>Job</span>
              <span>Vacation</span>
            </td>
          </tr>
          <tr>
            <td>mainColors</td>
            <td>Array</td>
            <td>false</td>
            <td class="array">
              <span>darksalmon</span>
              <span>lightpink</span>
              <span>mistyrose</span>
              <span>beige</span>
              <span>khaki</span>
              <span>gold</span>
              <span>darkseagreen</span>
              <span>lightblue</span>
              <span>lightsteelblue</span>
              <span>thistle</span>
            </td>
          </tr>
          <tr>
            <td>minorColors</td>
            <td>Array</td>
            <td>false</td>
            <td class="array">
              <span>linen</span>
              <span>floralwhite</span>
              <span>ivory</span>
              <span>ghostwhite</span>
              <span>honeydew</span>
              <span>lemonchiffon</span>
            </td>
          </tr>
        </table>
        <p>
          <sup class="alert-text" style="margin:0;padding:0">Id must be unique</sup>, or the ChatBox may not work properly.
        </p>
        <p>
          Channels and colors accept array of Strings. Their usage is explained
          <router-link to="/settings">#here</router-link>.
        </p>
      </section>
      <section>
        <h2>
          <i class="fas fa-border-style"></i>
          Styling
        </h2>
        <p>The ChatBox acts as a normal block. It's height change as it is folded / unfolded.</p>
        <p>You can control the ChatBox's width and position by simple CSS.</p>
        <p>For example, the pair of ChatBoxs at bottom of this page is positioned and sized by the following CSS:</p>
        <p class="code-block">
          <span class="line">#chatbox1, #chatbox2 {</span>
          <span class="line indent">
            position: fixed;
            <sub>// parent position: relative</sub>
          </span>
          <span class="line indent">width: calc(50% - 15px);</span>
          <span class="line indent">top: 100%;</span>
          <span class="line indent">transform: translateY(-100%);</span>
          <span class="line">}</span>
          <span class="line">#chatbox1{</span>
          <span class="line indent">right: 10px;</span>
          <span class="line">}</span>
          <span class="line">#chatbox2{</span>
          <span class="line indent">left: 10px;</span>
          <span class="line">}</span>
        </p>
        <p>Or you may want to do something like this:</p>
        <div id="anchor">
          <ChatBox id="chatbox3" panelHeight="250px" />
        </div>
        <p class="code-block">
          <span class="line">#chatbox3-wrapper {</span>
          <span class="line indent">margin-left: auto;</span>
          <span class="line indent">position: relative;</span>
          <span class="line indent">width: 300px;</span>
          <span class="line indent">height: 0px;</span>
          <span class="line">}</span>

          <span class="line">#chatbox3 {</span>
          <span class="line indent">width: 100%;</span>
          <span class="line indent">transform: translateY(-100%);</span>
          <span class="line">}</span>
        </p>
      </section>
    </article>
  </div>
</template>

<script>
import ChatBox from "@/components/ChatBox.vue";
export default {
  components: { ChatBox }
};
</script>

<style lang="scss" scoped>
b {
  color: #42b983;
  font-weight: bold;
}
.array {
  display: flex;
  flex-flow: row wrap;
  margin: 0;
}

#anchor {
  position: relative;
  width: 350px;
  height: 0;
  padding: 15px;
  margin: 40px 0 50px 0;
  margin-left: auto;
  border: 5px dashed black;
  #chatbox3 {
    width: 100%;
    transform: translateY(-100%);
  }
  &::after {
    content: "#chatbox3-wrapper";
    font-family: "Courier New", Courier, monospace;
    position: absolute;
    left: 0%;
    top: 130%;
  }
}
</style>