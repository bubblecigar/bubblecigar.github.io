<template>
  <div class="chat-box" :id="id" :style="colorScheme">
    <div class="socket-panel" @click="fold">
      <div class="stateWrapper">
        <button @click="reOpenSocket">
          <i class="fas fa-broadcast-tower" :class="{shake:socketState === 0}"></i>
        </button>
        <span v-if="socketState === 0" class="stateString" :class="socketStateString">connecting...</span>
        <span
          v-else-if="socketState === 1"
          :class="socketStateString"
          class="stateString"
        >{{roomID}}</span>
        <span v-else-if="socketState === 2" :class="socketStateString" class="stateString">closing</span>
        <span v-else-if="socketState === 3" :class="socketStateString" class="stateString">offline</span>
      </div>
      <div class="unread-msg" v-show="unreadMsg">({{unreadMsg}})</div>
      <span class="user-label">{{ user }}</span>
      <button class="fas fa-user-cog setting" @click="toggleSettingPanel"></button>
    </div>
    <div class="main-panel" v-show="!isFold" :style="{height:panelHeight}">
      <div class="settingPanel" v-show="showSettingPanel">
        <div class="field username">
          <label>
            <i class="fas fa-user"></i>
            <span>username</span>
          </label>
          <div class="input">
            <input
              class="username-input"
              type="text"
              v-model="user"
              onclick="this.focus();this.select()"
            />
          </div>
        </div>
        <div class="field alert">
          <label>
            <i class="fas fa-bell"></i>
            <span>alert</span>
          </label>
          <div class="input">
            <span :class="{selected:alert}" @click="turnOnAlert">On</span>
            <span :class="{selected:!alert}" @click="turnOffAlert">Mute</span>
          </div>
        </div>
        <div class="field channel">
          <label>
            <i class="fas fa-broadcast-tower"></i>
            <span>channel</span>
          </label>
          <div class="input">
            <span
              v-for="id in channelList"
              :class="{selected:id===targetRoomID}"
              @click="changeRoomID(id)"
            >{{id}}</span>
          </div>
        </div>
        <div class="field">
          <label>
            <i class="fas fa-palette"></i>
            <span>scheme (main)</span>
          </label>
          <div class="input">
            <span
              class="scheme main"
              v-for="color in mainColors"
              :class="{markUp:color === colorScheme['--c-primary']}"
              :style="{'background-color':color}"
              @click="setColorScheme('--c-primary',color)"
            ></span>
          </div>
        </div>
        <div class="field">
          <label>
            <i class="fas fa-palette"></i>
            <span>scheme (minor)</span>
          </label>
          <div class="input">
            <span
              class="scheme minor"
              v-for="color in minorColors"
              :class="{markUp:color === colorScheme['--c-secondary']}"
              :style="{'background-color':color}"
              @click="setColorScheme('--c-secondary',color)"
            ></span>
          </div>
        </div>
        <div class="field tools">
          <label>
            <i class="fas fa-tools"></i>
            <span>tools</span>
          </label>
          <div class="input">
            <span @click="clearDialogue">clear messages</span>
            <span @click="clearSavedSettings">clear storage</span>
          </div>
        </div>
        <button class="back" @click="toggleSettingPanel">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
      <div class="msg-panel" @click="userIsReading">
        <MessageBlock
          v-for="data in storedData"
          :dataObj="data"
          :parentID="id"
          @msgAdded="scrollToBottom"
        ></MessageBlock>
      </div>
      <div class="emojiPicker">
        <EmojiPicker @emojiPicked="appendEmoji" v-show="showEmojiPicker"></EmojiPicker>
      </div>
    </div>
    <div class="input-panel" v-show="!isFold" @click="showSettingPanel = false">
      <div class="inputs">
        <button @click="pickFile">
          <i class="fas fa-paperclip"></i>
        </button>
        <button class="emoji" @click="toggleEmojiPicker">
          <i class="far fa-laugh"></i>
        </button>
        <input
          type="text"
          v-model="inputContent.textString"
          @keydown="keyDownAction"
          @focus="userIsTyping"
          class="text-input"
          placeholder="type a message..."
        />
        <input type="file" class="file-input" />
        <button @click="sendMsg" :disabled="socketState != 1">
          <i class="far fa-paper-plane"></i>
        </button>
      </div>
      <div class="upload-file-preview">
        <span v-for="(file,i) in inputContent.files" @click="deleteFile(i)">{{file.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import { create } from "domain";
import { type } from "os";
import MessageBlock from "@/components/MessageBlock.vue";
import EmojiPicker from "@/components/EmojiPicker.vue";
export default {
  components: {
    MessageBlock,
    EmojiPicker
  },
  props: {
    id: {
      type: String,
      required: false,
      default: "chatBox1"
    },
    panelHeight: {
      type: String,
      required: false,
      default: "300px"
    },
    channelList: {
      type: Array,
      required: false,
      default() {
        return [
          "Global",
          "Food",
          "Music",
          "Movie",
          "Book",
          "Relationship",
          "Job",
          "Vacation"
        ];
      }
    },
    mainColors: {
      type: Array,
      required: false,
      default() {
        return [
          "darksalmon",
          "lightpink",
          "mistyrose",
          "beige",
          "khaki",
          "gold",
          "darkseagreen",
          "lightblue",
          "lightsteelblue",
          "thistle"
        ];
      }
    },
    minorColors: {
      type: Array,
      required: false,
      default() {
        return [
          "linen",
          "floralwhite",
          "ivory",
          "ghostwhite",
          "honeydew",
          "lemonchiffon"
        ];
      }
    }
  },
  beforeDestroy() {
    this.closeSocket();
  },
  created() {
    this.openSocket(this.roomID);

    // load audio effect
    fetch("assets/audio/ping-bing_E_major.wav")
      .then(res => {
        const blob = res.blob();
        return blob;
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        new Audio(url);
        this.alertSoundURL = url;
      });

    // load local setting
    this.loadSettings();
  },
  mounted() {
    this.msgPanelDOM = document.querySelector(`#${this.id} .msg-panel`);
    this.fileDOM = document.querySelector(`#${this.id} .file-input`);
    this.fileDOM.onchange = e => {
      const file = this.fileDOM.files[0];
      this.handleFile(file);
    };
  },
  data() {
    return {
      roomID: "Global",
      targetRoomID: "Global",

      alert: true,
      alertSoundURL: undefined,
      unreadMsg: 0,
      channelID: "bubblecigar",
      msgPanelDOM: undefined,
      fileDOM: undefined,
      socket: undefined,
      socketState: undefined,
      showSettingPanel: false,
      showEmojiPicker: false,
      inputContent: {
        textString: "",
        files: []
      },
      user: "guest",
      storedData: [],
      isFold: true,
      colorScheme: {
        "--c-primary": this.mainColors[0],
        "--c-secondary": this.minorColors[0]
      }
    };
  },
  computed: {
    socketStateString() {
      switch (this.socketState) {
        case 0:
          return "connecting";
        case 1:
          return "open";
        case 2:
          return "closing";
        case 3:
          return "closed";
        default:
          throw Error("unexpected socket state");
      }
    }
  },
  watch: {
    roomID: {
      handler() {
        this.saveSettings();
      }
    },
    targetRoomID: {
      handler() {
        this.saveSettings();
      }
    },
    user: {
      handler() {
        this.saveSettings();
      }
    },
    isFold: {
      handler() {
        this.saveSettings();
      }
    },
    alert: {
      handler() {
        this.saveSettings();
      }
    },
    colorScheme: {
      deep: true,
      handler() {
        this.saveSettings();
      }
    }
  },
  methods: {
    userIsReading() {
      this.showSettingPanel = false;
      this.showEmojiPicker = false;
    },
    userIsTyping() {
      this.showSettingPanel = false;
      this.showEmojiPicker = false;
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    appendEmoji(emoji) {
      this.inputContent.textString += emoji;
    },
    setColorScheme(key, value) {
      this.colorScheme[key] = value;
    },
    clearSavedSettings() {
      store.remove(`chatBox-${this.id}`);
    },
    clearDialogue() {
      this.storedData.splice(0);
    },
    saveSettings() {
      const settings = {
        roomID: this.roomID,
        targetRoomID: this.targetRoomID,
        user: this.user,
        isFold: this.isFold,
        alert: this.alert,
        colorScheme: this.colorScheme
      };
      store.set(`chatBox-${this.id}`, settings);
    },
    loadSettings() {
      const settings = store.get(`chatBox-${this.id}`);
      if (settings) {
        try {
          (this.roomID = settings.roomID),
            (this.targetRoomID = settings.targetRoomID),
            (this.user = settings.user),
            (this.isFold = settings.isFold),
            (this.alert = settings.alert),
            (this.colorScheme = settings.colorScheme);
        } catch (error) {
          console.log(error);
        }
      }
    },
    fold(e) {
      if (this.isFold) {
        this.isFold = false; // unfold
        this.unreadMsg = 0;
        this.showSettingPanel = false;
      } else {
        if (e.target.classList.contains("socket-panel")) {
          this.isFold = true;
        }
      }
    },
    turnOnAlert() {
      this.alert = true;
    },
    turnOffAlert() {
      this.alert = false;
    },
    changeRoomID(id) {
      this.targetRoomID = id;
      this.reOpenSocket();
    },
    toggleSettingPanel() {
      this.showSettingPanel = !this.showSettingPanel;
    },
    updateSocketState() {
      this.socketState = this.socket.readyState;
    },

    reOpenSocket() {
      if (this.socket.readyState === 1 || this.socket.readyState === 3) {
        this.closeSocket();
        this.openSocket(this.targetRoomID);
      }
    },
    openSocket(roomID) {
      // socket
      this.socket = new WebSocket(
        `wss://connect.websocket.in/${this.channelID}?room_id=${roomID}`
      );
      this.updateSocketState();
      this.socket.onopen = e => {
        this.updateSocketState();
        this.selfNotification(`- you enter ${roomID} -`);
        this.sendNotification(`- ${this.user} enter ${roomID} -`);
        this.roomID = roomID;
      };
      this.socket.onclose = e => {
        this.selfNotification(`- you leave ${roomID} -`);
        this.updateSocketState();
      };
      this.socket.onmessage = e => {
        if (this.alert && this.isFold) {
          new Audio(this.alertSoundURL).play().catch(err => {
            console.log(err.toString());
          });
        }
        if (this.isFold) {
          this.unreadMsg++;
        }
        this.storeData(e.data);
      };
    },
    closeSocket(roomID = this.roomID) {
      this.sendNotification(`- ${this.user} leave ${roomID} -`);
      this.socket.close();
      this.updateSocketState();
    },
    deleteFile(i) {
      this.inputContent.files.splice(i, 1);
    },
    scrollToBottom() {
      if (this.msgPanelDOM) {
        this.msgPanelDOM.scrollTop = this.msgPanelDOM.scrollHeight;
      }
    },
    keyDownAction(e) {
      if (e.keyCode === 13) {
        this.sendMsg();
      }
    },
    emitNotification(notificationMsg) {
      this.selfNotification(notificationMsg);
      this.sendNotification(notificationMsg);
    },
    sendNotification(notificationMsg) {
      const dataObj = {
        inputContent: {},
        user: this.user,
        id: this.id,
        timeStamp: Date.now(),
        type: "notification",
        notificationMsg
      };
      const jsonString = JSON.stringify(dataObj);
      if (this.socketState === 1) {
        this.socket.send(jsonString);
      }
    },
    selfNotification(notificationMsg) {
      const dataObj = {
        inputContent: {},
        user: this.user,
        id: this.id,
        timeStamp: Date.now(),
        type: "notification",
        notificationMsg
      };
      const jsonString = JSON.stringify(dataObj);
      this.storeData(jsonString);
    },
    sendMsg(eventObject, inputContent = this.inputContent) {
      if (this.socketState != 1) {
        return;
      }
      if (
        this.inputContent.textString.length === 0 &&
        this.inputContent.files.length === 0
      ) {
        return;
      }
      const dataObj = {
        inputContent: this.inputContent,
        user: this.user,
        id: this.id,
        timeStamp: Date.now(),
        type: "message"
      };

      const jsonString = JSON.stringify(dataObj);
      this.socket.send(jsonString);
      this.storeData(jsonString);

      this.clearInputContent();
    },
    storeData(jsonString) {
      // dataObj: {
      //   inputContent: {
      //     textString: "Welcome!",
      //     files: []
      //   },
      //   user: "bubble",
      //   id: this.id,
      //   timeStamp: Date.now(),
      // type: 'message'
      // }
      const dataObj = JSON.parse(jsonString);
      this.storedData.push(dataObj);
    },
    clearInputContent() {
      this.inputContent.textString = "";
      this.inputContent.files.splice(0);
    },
    handleFile(file) {
      const reader = new FileReader();
      reader.onload = e => {
        file.dataUrl = e.target.result;
        this.inputContent.files.push(file);
      };
      reader.readAsDataURL(file);
      this.fileDOM.value = "";
    },
    pickFile() {
      this.fileDOM.click();
    },
    createMessageBox(boxClass = "received-msg") {
      const div = document.createElement("div");
      div.classList.add(boxClass);
      return div;
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

button:disabled:hover {
  cursor: initial;
}

.chat-box {
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;

  --g-s: 5px;
  --g-m: 10px;

  --fs-s: 12px;
  --fs-m: 16px;
  --fs-l: 20px;

  --ff: "Source Sans Pro", "Avenir", Helvetica, Arial, sans-serif;

  --c-primary: rgb(212, 244, 255);
  --c-secondary: white;

  --c-hover: var(--c-secondary);
  --c-active: lightgray;
  --c-placeholder: gray;
  --c-alert: tomato;
  --c-selected: var(--c-secondary);
  --c-text: black;
  --c-text-hover: rgb(59, 55, 57);
  --c-input: black;

  --c-safe: black;
  --c-wait: gray;

  --line: 1px solid transparent;
  --line-s: 1px solid black;

  font-family: var(--ff);
  font-size: var(--fs-m);
  line-height: initial;
  * {
    font-size: inherit;
    line-height: inherit;
  }

  color: var(--c-text);
  overflow: hidden;
  outline: var(--line-s);

  button {
    border: none;
    outline: none;
    padding: var(--g-m);
    font-size: var(--fs-l);
    color: var(--c-text);
    background-color: transparent;
    transition: transform 0.1s;

    &:hover {
      cursor: pointer;
      transform: translateY(-3px);
    }
    &:active {
      transform: translateY(0px);
    }
  }
  .socket-panel {
    &:hover {
      cursor: pointer;
    }
    > * {
      cursor: initial;
    }
    background-color: var(--c-secondary);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
  }
  .unread-msg {
    margin-left: var(--g-s);
  }
  .setting {
    position: relative;
  }

  .user-label {
    margin-left: auto;
  }

  .stateWrapper {
    display: flex;
    flex-flow: row;
    align-items: center;
  }
  .stateString {
    font-weight: bold;
  }
  .connecting,
  .closing {
    color: var(--c-wait);
  }
  .open {
    color: var(--c-safe);
  }
  .closed {
    color: var(--c-alert);
  }
  .shake {
    animation: shake 0.5s infinite linear;
  }
  @keyframes shake {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(20deg);
    }
    50% {
      transform: rotate(0deg);
    }
    75% {
      transform: rotate(-20deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .main-panel {
    position: relative;
    border-top: var(--line);
    border-bottom: var(--line);
    height: 300px;
  }

  .settingPanel {
    outline: var(--line);
    padding: var(--g-m);
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    background: var(--c-secondary);
    &::-webkit-scrollbar {
      display: none;
    }
    max-height: 100%;
    width: 100%;
    overflow-y: scroll;
    background: var(--c-primary);
    // background-color: rgba(255, 255, 255, 0.8);

    .field {
      display: flex;
      flex-flow: column nowrap;
      align-items: flex-start;
      margin: var(--g-s);
    }
    label {
      display: flex;
      align-items: center;
      padding: var(--g-s);
      padding-left: 0;
      font-size: var(--fs-m);
      font-weight: bold;
      i {
        width: 2em;
        text-align: center;
      }
    }
    .input {
      padding: var(--g-s);
      display: flex;
      flex-flow: row wrap;
      span {
        padding: var(--g-s) var(--g-m);
        position: relative;
        margin: var(--g-s);
        border-radius: calc(2 * var(--g-m));
        border: var(--line);
        font-size: var(--fs-s);
        &:hover {
          cursor: pointer;
          background-color: var(--c-hover);
        }
        &:active {
          background-color: var(--c-active);
        }
        &.selected {
          background-color: var(--c-selected);
          border: var(--line-s);
        }

        &.scheme {
          padding: 0.75em 1.3em;
          &.markUp {
            border: var(--line-s);
          }
          &.markUp::after {
            content: ":)";
            font-weight: bold;
            position: absolute;
            left: 35%;
            top: 20%;
            transform: rotate(90deg);
          }
        }
      }
      .username-input {
        padding: calc(var(--g-s) * 3.5 / 5);
        margin: var(--g-s);
        border: var(--line-s);
        &:focus {
          background-color: var(--c-secondary);
        }
      }
      input {
        border-radius: calc(2 * var(--g-m));
        border: var(--line);
        background: transparent;
        font-family: var(--ff);
        padding: var(--g-s) var(--g-m);
        font-size: var(--fs-s);
        text-align: center;
        color: var(--c-input);
        outline: 0;
      }
    }
  }

  .back {
    margin-left: auto;
    align-self: flex-end;
    font-size: var(--fs-l);
  }

  .msg-panel {
    outline: var(--line-s);
    overflow-y: scroll;
    padding: var(--g-s) 0;
    scroll-behavior: smooth;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    background: var(--c-primary);
    height: 100%;
    width: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .input-panel {
    background-color: var(--c-secondary);
    position: relative;
    .inputs {
      display: flex;
      flex-flow: row wrap;
      .text-input {
        font-size: var(--fs-m);
        flex-grow: 1;
        padding: var(--g-s);
        color: var(--c-input);
        outline: none;
        border: none;
        background-color: transparent;
        font-family: var(--ff);
        &::placeholder {
          color: var(--c-placeholder);
        }
      }
    }
  }

  .upload-file-preview {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    position: absolute;
    bottom: 100%;
    padding: var(--g-s);
    left: 0;

    span {
      display: inline-block;
      padding: var(--g-s) var(--g-m);
      margin: var(--g-s);
      border-radius: calc(2 * var(--g-m));
      border: var(--line);
      background-color: var(--c-secondary);
      font-size: var(--fs-s);
      position: relative;

      &:hover {
        cursor: pointer;
        color: transparent;
        &::after {
          content: "remove";
          text-decoration: underline;
          position: absolute;
          color: var(--c-alert);
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      }
    }
  }

  .emojiPicker {
    position: absolute;
    bottom: 0%;
    left: 0;
    width: 100%;
    max-height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .file-input {
    display: none;
  }

  .loading {
    animation: spin infinite 2.5s linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>