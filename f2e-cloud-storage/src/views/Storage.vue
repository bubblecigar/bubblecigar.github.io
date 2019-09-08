<template>
  <div @click="dropNode">
    <div class="wrapper-2">
      <input id="file-input" type="file" @change="uploadFile" />
      <div class="content-panel">
        <div class="path">
          <div
            class="folder fas fa-folder"
            :class="{'fa-folder':currentFolder.length>0,'fa-folder-open':currentFolder.length===0}"
            @click="popFolder(-1)"
          >&nbsp;root</div>
          <div
            v-for="(folder,i) in currentFolder"
            class="folder fas"
            :class="{'fa-folder':i<currentFolder.length-1,'fa-folder-open':i===currentFolder.length-1}"
            @click="popFolder(i)"
          >&nbsp;{{folder}}</div>
        </div>
        <div class="tools">
          <i
            class="fas fa-angle-double-left btn return-btn"
            @click="prevFolder"
            v-show="currentFolder.length"
          ></i>
          <div class="wrapper">
            <i @click="newFolder" class="fas fa-folder-plus btn"></i>
            <div class="input-wrapper">
              <input
                :class="{showNewFolderInput:showNewFolderInput}"
                type="text"
                class="new-folder-name"
                v-model="newFolderName"
              />
              <i
                @click="createFolder"
                :class="{showNewFolderBtn:showNewFolderInput}"
                class="fas fa-check-circle folder-create-btn"
              ></i>
            </div>
          </div>
          <i @click="pickFile" class="fas fa-cloud-upload-alt btn"></i>
        </div>
        <div class="folders" v-if="contentWithinFolder && contentWithinFolder.prefixes.length">
          <i
            v-for="prefix in contentWithinFolder.prefixes"
            class="fas fa-folder folder node"
            @dblclick="pushFolder(prefix)"
            @click="selectNode(prefix,'folder')"
            :class="{selected:isSelected(prefix)}"
          >&nbsp;{{prefix.name}}</i>
        </div>
        <div class="files" v-if="contentWithinFolder && contentWithinFolder.items.length-1>0">
          <div
            v-for="item in contentWithinFolder.items"
            v-if="item.name != 'folderInitDoc.txt'"
            @click="selectNode(item,'file')"
            class="file fas fa-file node"
            :class="{selected:isSelected(item)}"
          >&nbsp;{{item.name}}</div>
        </div>
      </div>
      <div class="info-wrapper" :class="{pop:selectedNode}">
        <div class="info-panel" v-if="selectedNode && selectedNode.type==='file'">
          <div class="operation-panel">
            <a :href="selectedNode.node.downloadLink" target="_BLANK">
              <i class="fas fa-eye"></i>
            </a>
            <a
              :href="selectedNode.node.downloadLink"
              target="_BLANK"
              :download="selectedNode.node.name"
            >
              <i class="fas fa-cloud-download-alt"></i>
            </a>
            <button @click="deleteItem(selectedNode.node)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <table>
            <tr>
              <th class="info-label">Type</th>
              <td class="info-value">{{selectedNode.metadata.type}}</td>
            </tr>
            <tr>
              <th class="info-label">Name</th>
              <td class="info-value">{{selectedNode.metadata.name}}</td>
            </tr>
            <tr>
              <th class="info-label">Size (kb)</th>
              <td class="info-value">{{selectedNode.metadata.size}}</td>
            </tr>
            <tr>
              <th class="info-label">Created</th>
              <td class="info-value">{{selectedNode.metadata.timeCreated.slice(0,10)}}</td>
            </tr>
          </table>
        </div>
        <div class="info-panel" v-if="selectedNode && selectedNode.type==='folder'">
          <div class="operation-panel">
            <i class="far fa-star btn" @click="toggleFavorite"></i>
            <button @click="deleteFolder(selectedNode.node)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <table>
            <tr>
              <th class="info-label">Type</th>
              <td class="info-value">folder</td>
            </tr>
            <tr>
              <th class="info-label">Name</th>
              <td class="info-value">{{selectedNode.node.name}}</td>
            </tr>
            <tr>
              <th>Contents</th>
              <td class="flex-col">
                <i
                  v-for="subFolder in selectedNode.subFolders"
                  class="fas fa-folder content"
                >&nbsp;{{subFolder.name}}</i>
                <i
                  v-for="subFile in selectedNode.subFiles"
                  class="fas fa-file content"
                  v-if="subFile.name != 'folderInitDoc.txt'"
                >&nbsp;{{subFile.name}}</i>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
export default {
  created() {
    this.$store.dispatch("getContentWithinFolder");
  },
  data() {
    return {
      fileInput: undefined,
      selectedFile: null, // uploading file
      newFolderName: "",
      showNewFolderInput: false
    };
  },
  mounted() {
    // bind DOM
    this.fileInput = document.querySelector("#file-input");
  },
  computed: {
    ...mapState(["currentFolder", "contentWithinFolder", "selectedNode"])
  },
  methods: {
    toggleFavorite() {},
    dropNode(e) {
      let preserve = false;
      e.path.forEach(el => {
        if (el.classList) {
          if (
            el.classList.contains("node") ||
            el.classList.contains("info-wrapper")
          ) {
            preserve = true;
          }
        }
      });
      if (preserve) {
        return;
      } else {
        this.$store.commit("CLEAR_NODE_INFO");
      }
    },
    newFolder() {
      this.showNewFolderInput = !this.showNewFolderInput;
    },
    selectNode(node, type) {
      this.$store.dispatch("selectNode", { node, type });
    },
    isSelected(node) {
      if (!this.selectedNode) {
        return false;
      }
      return node.fullPath === this.selectedNode.node.fullPath;
    },
    createFolder() {
      if (!this.newFolderName) {
        return;
      }
      this.$store.dispatch("createFolder", this.newFolderName);
      this.newFolderName = "";
      this.showNewFolderInput = false;
    },
    popFolder(index) {
      this.$store.dispatch("popFolder", index);
    },
    prevFolder() {
      this.$store.dispatch("popFolder", this.currentFolder.length - 2);
    },
    pushFolder(prefix) {
      this.$store.dispatch("pushFolder", prefix);
    },
    getContentWithinFolder() {
      this.$store.dispatch("getContentWithinFolder");
    },
    selectFile(e) {
      this.selectedFile = e.target.files[0];
    },
    uploadFile(e) {
      this.selectedFile = e.target.files[0];
      this.$store.dispatch("uploadFile", this.selectedFile);
      this.selectedFile = null;
      this.fileInput.value = null;
    },
    pickFile() {
      this.fileInput.click();
    },
    deleteItem(item) {
      this.$store.dispatch("deleteItem", item);
      this.$store.commit("CLEAR_NODE_INFO");
    },
    deleteFolder(prefix) {
      this.$store.dispatch("deleteFolder", prefix);
    },
    getMetadata(item) {
      this.$store.dispatch("getMetadata", item);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  white-space: pre-wrap;
  word-break: break-all;
}
.path {
  display: flex;
  flex-flow: row wrap;
  padding: 0 var(--g-m);
  background-color: white;
  border-radius: var(--g-l) 0 0 0;
  border-left: 1px solid var(--c-main);
  border-top: 1px solid var(--c-main);
  justify-content: flex-start;
  .folder {
    color: var(--c-main);
  }
}
.wrapper-1,
.wrapper-2 {
  display: flex;
  flex-flow: row;
  justify-content: center;
  .content-panel,
  .info-wrapper {
    flex-grow: 1;
    margin: var(--g-l);
  }
  .content-panel {
    max-width: 800px;
    border-radius: var(--g-l) 0 0 var(--g-l);
    margin-right: 0;
    min-height: 90vh;
  }
  .info-wrapper {
    width: 300px;
    flex-shrink: 0;
    flex-grow: 0;
    overflow: hidden;
    margin-left: 0;
    box-shadow: 0 0 5px black;
    border-radius: 0 var(--g-l) var(--g-l) 0;
  }
}
@media (max-width: 700px) {
  .wrapper-2 {
    display: flex;
    flex-flow: column;
  }
}
.content-panel {
  background-color: var(--c-main);
  overflow: hidden;
  // box-shadow: 0 0 5px black;
  border-radius: var(--g-l);
}
.info-panel {
  overflow: hidden;
  .operation-panel {
    background-color: var(--c-main);
  }
}
.folders,
.files {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  padding: var(--g-m);
  > div {
    margin: var(--g-m);
  }
}
.tools {
  display: flex;
  flex-flow: row wrap;
  padding-right: 15px;
  justify-content: flex-end;
}
#file-input {
  height: 0;
  width: 0;
}
.new-folder-name {
  width: 0;
  margin: 0;
  border: 0;
  outline: 0;
  opacity: 0;
  color: var(--c-main);
  font-size: var(--fs-m);
  border-radius: var(--g-s);
  border: 0px solid transparent;
  transition: border 0.5s, width 0.5s, padding 0.5s, margin 0.5s,
    background-color 0.5s, transform 0.5s, opacity 0.5s;
}

.wrapper,
.input-wrapper {
  display: flex;
  flex-flow: row;
  align-items: center;
  position: relative;
}
.input-wrapper {
  position: absolute;
  right: 100%;
}
.showNewFolderInput {
  opacity: 1;
  width: 150px;
  padding: var(--g-s) var(--g-m);
  padding-right: 40px;
}
.folder-create-btn {
  &:hover {
    cursor: pointer;
  }
  &:active {
    color: var(--c-active);
  }
  &.selected {
    color: var(--c-selected);
  }
  overflow: hidden;
  position: absolute;
  width: 0;
  left: 80%;
  padding: 0;
  margin: 0;
  border: 0;
  outline: 0;
  opacity: 0;
  font-size: var(--fs-m);
  transition: width 0.5s, padding 0.5s, margin 0.5s, background-color 0.5s,
    opacity 0.5s, transform 0.5s;
}
.showNewFolderBtn {
  opacity: 1;
  color: var(--c-main);
  width: auto;
}
.folder,
.file,
.btn {
  line-height: 1.2em;
  border-radius: var(--g-s);
  padding: var(--g-m);
  margin: var(--g-m);
  display: row;
  align-items: center;
}
.folder,
.file {
  color: white;
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 3px black;
  }
  &:active {
    box-shadow: 0 0 3px black inset;
  }
  &.selected {
    color: var(--c-main);
    background-color: white;
    box-shadow: 0 0 3px black inset;
  }
}
.btn,
a,
button {
  color: white;
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 3px black;
  }
  &:active {
    box-shadow: 0 0 3px black inset;
  }
}
.return-btn {
  margin-right: auto;
}
.folder-wrapper {
  position: relative;
}
.delete-btn {
  border: 0;
  outline: 0;
  width: var(--g-l);
  height: var(--g-l);
  // background-color: var(--c-error);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 100%;
  bottom: 100%;
  transform: translate3d(-50%, 50%, 0);
}
.content-panel {
  display: flex;
  flex-flow: column wrap;
}
.flex-col {
  display: flex;
  flex-flow: column;
}
table {
  width: 80%;
  margin: 0px auto;
  margin-bottom: 30px;
  tr {
    display: flex;
    flex-flow: column;
    margin: var(--g-l) 0;
  }
  th,
  td {
    padding: var(--g-s);
    font-size: var(--fs-s);
    text-align: left;
  }
  th {
    color: var(--c-label);
  }
  td {
    border-bottom: 1px solid black;
  }
}
.operation-panel {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  a,
  button {
    padding: var(--g-m);
    margin: var(--g-m);
    border-radius: var(--g-s);
    background-color: transparent;
    border: none;
    font-size: var(--fs-m);
    &:hover {
      cursor: pointer;
    }
  }
}
.content {
  margin: var(--g-s) 0;
}
</style>