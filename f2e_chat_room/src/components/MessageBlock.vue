<template>
  <div class="msg-block" :class="{self: isSelf, notification:dataObj.type==='notification'}">
    <div class="messageWrapper" v-if="dataObj.type==='message'">
      <div class="user" v-if="!isSelf">{{dataObj.user}}</div>
      <div class="wrapper">
        <div class="content">
          <div class="files" v-if="dataObj.inputContent.files.length">
            <div
              class="file"
              v-for="file in dataObj.inputContent.files"
              v-html="fileHTML(file.dataUrl)"
            ></div>
          </div>
          <div
            class="text"
            v-if="dataObj.inputContent.textString"
          >{{dataObj.inputContent.textString}}</div>
        </div>
        <div class="time">{{timeString}}</div>
      </div>
    </div>
    <div v-if="dataObj.type==='notification'">{{dataObj.notificationMsg}}</div>
  </div>
</template>

<script>
export default {
  props: {
    dataObj: {
      type: Object,
      required: true
    },
    parentID: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.$emit("msgAdded");
  },
  methods: {
    fileHTML(url) {
      if (url.startsWith("data:image/")) {
        return `<img src='${url}' alt='image' />`;
      }
      if (url.startsWith("data:audio/")) {
        return `<audio src='${url}' controls></audio>`;
      }
      if (url.startsWith("data:video/")) {
        return `<video src='${url}' controls></video>`;
      }
      return `<a target='_BLANK' style='color:black' href='${url}'><i class="far fa-file"></i> download</a>`;
    }
  },
  computed: {
    isSelf() {
      return this.dataObj.id === this.parentID;
    },
    date() {
      return new Date(this.dataObj.timeStamp);
    },
    timeString() {
      let h = String(this.date.getHours());
      let m = String(this.date.getMinutes());
      if (m.length === 0) {
        m = "00";
      } else if (m.length === 1) {
        m = "0" + m;
      }
      return h + ":" + m;
    }
  }
};
</script>

<style lang="scss">
.msg-block {
  margin: var(--g-s) var(--g-m);
  position: relative;
  display: flex;
  flex-flow: column;

  .user,
  .time {
    font-size: var(--fs-s);
  }

  &.self {
    align-self: flex-end;
    .time {
      order: 1;
    }
    .user {
      text-align: right;
    }
    .content {
      border-radius: var(--g-m) var(--g-m) 0 var(--g-m);
    }
  }

  &.notification {
    align-self: center;
    font-size: var(--fs-s);
    opacity: 0.5;
  }

  .user {
    text-align: left;
    padding: var(--g-s);
  }

  .wrapper {
    display: flex;
  }

  .content {
    background-color: white;
    max-width: 400px;
    padding: var(--g-s);
    border-radius: 0 var(--g-m) var(--g-m) var(--g-m);
    order: 2;
  }

  .time {
    align-self: flex-end;
    padding: var(--g-s);
    order: 3;
  }

  .files {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;

    .file {
      overflow: hidden;
      margin: var(--g-m);
      img,
      video {
        width: 100%;
        max-width: 300px;
      }
      audio {
        width: 300px;
      }
    }
  }
  .text {
    text-align: left;
    padding: var(--g-m);
    word-break: break-word;
    font-size: var(--fs-m);
  }
}
</style>
