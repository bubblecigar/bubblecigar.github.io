<template>
  <div class="emojiList">
    <div class="emojis">
      <span
        class="emoji"
        v-for="emoji in emojis[selectedKey]"
        :key="emoji"
        @click="pickEmoji(emoji)"
      >{{emoji}}</span>
    </div>
    <div class="topics">
      <span
        v-for="(value,key) in emojis"
        @click="selectKey(key)"
        :class="{selected:key===selectedKey}"
      >{{key}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emojis: {
        "😀": [
          "😀",
          "😁",
          "😂",
          "🤣",
          "😃",
          "😄",
          "😅",
          "😆",
          "😉",
          "😊",
          "😋",
          "😎",
          "😍",
          "😘",
          "🥰",
          "😗",
          "😙",
          "😚",
          "☺️",
          "🙂",
          "🤗",
          "🤩",
          "🤔",
          "🤨",
          "😐",
          "😑",
          "😶",
          "🙄",
          "😏",
          "😣",
          "😥",
          "😮",
          "🤐",
          "😯",
          "😪",
          "😫",
          "😴",
          "😌",
          "😛",
          "😜",
          "😝",
          "🤤",
          "😒",
          "😓",
          "😔",
          "😕",
          "🙃",
          "🤑",
          "😲",
          "☹️",
          "🙁",
          "😖",
          "😞",
          "😟",
          "😤",
          "😢",
          "😭",
          "😦",
          "😧",
          "😨",
          "😩",
          "🤯",
          "😬",
          "😰",
          "😱",
          "🥵",
          "🥶",
          "😳",
          "🤪",
          "😵",
          "😡",
          "😠",
          "🤬",
          "😷",
          "🤒",
          "🤕",
          "🤢",
          "🤮",
          "🤧",
          "😇",
          "🤠",
          "🤡",
          "🥳",
          "🥴",
          "🥺",
          "🤥",
          "🤫",
          "🤭",
          "🧐",
          "🤓",
          "😈",
          "👿",
          "👹",
          "👺",
          "💀",
          "👻",
          "👽",
          "🤖",
          "💩",
          "😺"
        ],
        "🍎": [
          "🍏",
          "🍎",
          "🍐",
          "🍊",
          "🍋",
          "🍌",
          "🍉",
          "🍇",
          "🍓",
          "🍈",
          "🍒",
          "🍑",
          "🍍",
          "🥭",
          "🥥",
          "🥝",
          "🍅",
          "🍆",
          "🥑",
          "🥦",
          "🥒",
          "🥬",
          "🌶",
          "🌽",
          "🥕",
          "🥔",
          "🍠",
          "🥐",
          "🍞",
          "🥖",
          "🥨",
          "🥯",
          "🧀",
          "🥚",
          "🍳",
          "🥞",
          "🥓",
          "🥩",
          "🍗",
          "🍖",
          "🌭",
          "🍔",
          "🍟",
          "🍕",
          "🥪",
          "🥙",
          "🌮",
          "🌯",
          "🥗",
          "🥘",
          "🥫",
          "🍝",
          "🍜",
          "🍲",
          "🍛",
          "🍣",
          "🍱",
          "🥟",
          "🍤",
          "🍙",
          "🍚",
          "🍘",
          "🍥",
          "🥮",
          "🥠",
          "🍢",
          "🍡",
          "🍧",
          "🍨",
          "🍦",
          "🥧",
          "🍰",
          "🎂",
          "🍮",
          "🍭",
          "🍬",
          "🍫",
          "🍿",
          "🧂",
          "🍩",
          "🍪",
          "🌰",
          "🥜",
          "🍯",
          "🥛",
          "🍼",
          "☕️",
          "🍵",
          "🥤",
          "🍶",
          "🍺",
          "🍻",
          "🥂",
          "🍷",
          "🥃",
          "🍸",
          "🍹",
          "🍾",
          "🥄",
          "🍴"
        ],
        "🐶": [
          "🐶",
          "🐱",
          "🐭",
          "🐹",
          "🐰",
          "🦊",
          "🦝",
          "🐻",
          "🐼",
          "🦘",
          "🦡",
          "🐨",
          "🐯",
          "🦁",
          "🐮",
          "🐷",
          "🐽",
          "🐸",
          "🐵",
          "🙈",
          "🙉",
          "🙊",
          "🐒",
          "🐔",
          "🐧",
          "🐦",
          "🐤",
          "🐣",
          "🐥",
          "🦆",
          "🦢",
          "🦅",
          "🦉",
          "🦚",
          "🦜",
          "🦇",
          "🐺",
          "🐗",
          "🐴",
          "🦄",
          "🐝",
          "🐛",
          "🦋",
          "🐌",
          "🐚",
          "🐞",
          "🐜",
          "🦗",
          "🕷",
          "🕸",
          "🦂",
          "🦟",
          "🦠",
          "🐢",
          "🐍",
          "🦎",
          "🦖",
          "🦕",
          "🐙",
          "🦑",
          "🦐",
          "🦀",
          "🐡",
          "🐠",
          "🐟",
          "🐬",
          "🐳",
          "🐋",
          "🦈",
          "🐊",
          "🐅",
          "🐆",
          "🦓",
          "🦍",
          "🐘",
          "🦏",
          "🦛",
          "🐪",
          "🐫",
          "🦙",
          "🦒",
          "🐃",
          "🐂",
          "🐄",
          "🐎",
          "🐖",
          "🐏",
          "🐑",
          "🐐",
          "🦌",
          "🐕",
          "🐩",
          "🐈",
          "🐓",
          "🦃",
          "🕊",
          "🐇"
        ],
        "⚽️": [
          "⚽️",
          "🏀",
          "🏈",
          "⚾️",
          "🥎",
          "🏐",
          "🏉",
          "🎾",
          "🥏",
          "🎱",
          "🏓",
          "🏸",
          "🥅",
          "🏒",
          "🏑",
          "🥍",
          "🏏",
          "⛳️",
          "🏹",
          "🎣",
          "🥊",
          "🥋",
          "🎽",
          "⛸",
          "🥌",
          "🛷",
          "🛹",
          "🎿",
          "⛷",
          "🏂",
          "🏋️‍♀️",
          "🏋🏻‍♀️",
          "🏋🏼‍♀️",
          "🏋🏽‍♀️",
          "🏋🏾‍♀️",
          "🏋🏿‍♀️",
          "🏋️‍♂️",
          "🏋🏻‍♂️",
          "🏋🏼‍♂️",
          "🏋🏽‍♂️",
          "🏋🏾‍♂️",
          "🏋🏿‍♂️",
          "🤼‍♀️",
          "🤼‍♂️",
          "🤸‍♀️",
          "🤸🏻‍♀️",
          "🤸🏼‍♀️",
          "🤸🏽‍♀️",
          "🤸🏾‍♀️",
          "🤸🏿‍♀️",
          "🤸‍♂️",
          "🤸🏻‍♂️",
          "🤸🏼‍♂️",
          "🤸🏽‍♂️",
          "🤸🏾‍♂️",
          "🤸🏿‍♂️",
          "⛹️‍♀️",
          "⛹🏻‍♀️",
          "⛹🏼‍♀️",
          "⛹🏽‍♀️",
          "⛹🏾‍♀️",
          "⛹🏿‍♀️",
          "⛹️‍♂️",
          "⛹🏻‍♂️",
          "⛹🏼‍♂️",
          "⛹🏽‍♂️",
          "⛹🏾‍♂️",
          "⛹🏿‍♂️",
          "🤺",
          "🤾‍♀️",
          "🤾🏻‍♀️",
          "🤾🏼‍♀️",
          "🤾‍♂️",
          "🤾🏻‍♂️",
          "🤾🏼‍♂️",
          "🤾🏽‍♂️",
          "🤾🏾‍♂️",
          "🤾🏿‍♂️",
          "🏌️‍♀️",
          "🏌🏻‍♀️",
          "🏌🏼‍♀️",
          "🏌🏽‍♀️",
          "🏌🏾‍♀️",
          "🏌🏿‍♀️",
          "🏌️‍♂️",
          "🏌🏻‍♂️",
          "🏌🏼‍♂️",
          "🏌🏽‍♂️",
          "🏌🏾‍♂️",
          "🏌🏿‍♂️",
          "🏇",
          "🏇🏻",
          "🏇🏼",
          "🏇🏽",
          "🏇🏾",
          "🏇🏿",
          "🧘‍♀️"
        ],
        "🚗": [
          "🚗",
          "🚕",
          "🚙",
          "🚌",
          "🚎",
          "🏎",
          "🚓",
          "🚑",
          "🚒",
          "🚐",
          "🚚",
          "🚛",
          "🚜",
          "🛴",
          "🚲",
          "🛵",
          "🏍",
          "🚨",
          "🚔",
          "🚍",
          "🚘",
          "🚖",
          "🚡",
          "🚠",
          "🚟",
          "🚃",
          "🚋",
          "🚞",
          "🚝",
          "🚄",
          "🚅",
          "🚈",
          "🚂",
          "🚆",
          "🚇",
          "🚊",
          "🚉",
          "✈️",
          "🛫",
          "🛬",
          "🛩",
          "💺",
          "🛰",
          "🚀",
          "🛸",
          "🚁",
          "🛶",
          "⛵️",
          "🚤",
          "🛥",
          "🛳",
          "⛴",
          "🚢",
          "⚓️",
          "⛽️",
          "🚧",
          "🚦",
          "🚥",
          "🚏",
          "🗺",
          "🗿",
          "🗽",
          "🗼",
          "🏰",
          "🏯",
          "🏟",
          "🎡",
          "🎢",
          "🎠",
          "⛲️",
          "⛱",
          "🏖",
          "🏝",
          "🏜",
          "🌋",
          "⛰",
          "🏔",
          "🗻",
          "🏕",
          "⛺️",
          "🏠",
          "🏡",
          "🏘",
          "🏚",
          "🏗",
          "🏭",
          "🏢",
          "🏬",
          "🏣",
          "🏤",
          "🏥",
          "🏦",
          "🏨",
          "🏪",
          "🏫",
          "🏩",
          "💒",
          "🏛",
          "⛪️",
          "🕌"
        ],
        "🧥": [
          "🧥",
          "👚",
          "👕",
          "👖",
          "👔",
          "👗",
          "👙",
          "👘",
          "👠",
          "👡",
          "👢",
          "👞",
          "👟",
          "🥾",
          "🥿",
          "🧦",
          "🧤",
          "🧣",
          "🎩",
          "🧢",
          "👒",
          "🎓",
          "⛑",
          "👑",
          "👝",
          "👛",
          "👜",
          "💼",
          "🎒",
          "👓",
          "🕶",
          "🥽",
          "🥼",
          "🌂",
          "🧵",
          "🧶"
        ],
        "👶🏼": [
          "👶🏼",
          "👦🏼",
          "👧🏼",
          "👨🏼",
          "👩🏼",
          "👱🏼‍♀️",
          "👱🏼",
          "👴🏼",
          "👵🏼",
          "👲🏼",
          "👳🏼‍♀️",
          "👳🏼",
          "👮🏼‍♀️",
          "👮🏼",
          "👷🏼‍♀️",
          "👷🏼",
          "💂🏼‍♀️",
          "💂🏼",
          "🕵🏼‍♀️",
          "🕵🏼",
          "👩🏼‍⚕️",
          "👨🏼‍⚕️",
          "👩🏼‍🌾",
          "👨🏼‍🌾",
          "👩🏼‍🍳",
          "👨🏼‍🍳",
          "👩🏼‍🎓",
          "👨🏼‍🎓",
          "👩🏼‍🎤",
          "👨🏼‍🎤",
          "👩🏼‍🏫",
          "👨🏼‍🏫",
          "👩🏼‍🏭",
          "👨🏼‍🏭",
          "👩🏼‍💻",
          "👨🏼‍💻",
          "👩🏼‍💼",
          "👨🏼‍💼",
          "👩🏼‍🔧",
          "👨🏼‍🔧",
          "👩🏼‍🔬",
          "👨🏼‍🔬",
          "👩🏼‍🎨",
          "👨🏼‍🎨",
          "👩🏼‍🚒",
          "👨🏼‍🚒",
          "👩🏼‍✈️",
          "👨🏼‍✈️",
          "👩🏼‍🚀",
          "👨🏼‍🚀",
          "👩🏼‍⚖️",
          "👨🏼‍⚖️",
          "🤶🏼",
          "🎅🏼",
          "👸🏼",
          "🤴🏼",
          "👰🏼",
          "🤵🏼",
          "👼🏼",
          "🤰🏼",
          "🙇🏼‍♀️",
          "🙇🏼",
          "💁🏼",
          "💁🏼‍♂️",
          "🙅🏼",
          "🙅🏼‍♂️",
          "🙆🏼",
          "🙆🏼‍♂️",
          "🙋🏼",
          "🙋🏼‍♂️",
          "🤦🏼‍♀️",
          "🤦🏼‍♂️",
          "🤷🏼‍♀️",
          "🤷🏼‍♂️",
          "🙎🏼",
          "🙎🏼‍♂️",
          "🙍🏼",
          "🙍🏼‍♂️",
          "💇🏼",
          "💇🏼‍♂️",
          "💆🏼",
          "💆🏼‍♂️",
          "🕴🏼",
          "💃🏼",
          "🕺🏼",
          "🚶🏼‍♀️",
          "🚶🏼",
          "🏃🏼‍♀️",
          "🏃🏼",
          "🤲🏼",
          "👐🏼",
          "🙌🏼",
          "👏🏼",
          "🙏🏼",
          "👍🏼",
          "👎🏼",
          "👊🏼",
          "✊🏼",
          "🤛🏼",
          "🤜🏼"
        ],
        "🇩🇿": [
          "🏳️",
          "🏴",
          "🏁",
          "🚩",
          "🏳️‍🌈",
          "🏴‍☠️",
          "🇦🇫",
          "🇦🇽",
          "🇦🇱",
          "🇩🇿",
          "🇦🇸",
          "🇦🇩",
          "🇦🇴",
          "🇦🇮",
          "🇦🇶",
          "🇦🇬",
          "🇦🇷",
          "🇦🇲",
          "🇦🇼",
          "🇦🇺",
          "🇦🇹",
          "🇦🇿",
          "🇧🇸",
          "🇧🇭",
          "🇧🇩",
          "🇧🇧",
          "🇧🇾",
          "🇧🇪",
          "🇧🇿",
          "🇧🇯",
          "🇧🇲",
          "🇧🇹",
          "🇧🇴",
          "🇧🇦",
          "🇧🇼",
          "🇧🇷",
          "🇮🇴",
          "🇻🇬",
          "🇧🇳",
          "🇧🇬",
          "🇧🇫",
          "🇧🇮",
          "🇰🇭",
          "🇨🇲",
          "🇨🇦",
          "🇮🇨",
          "🇨🇻",
          "🇧🇶",
          "🇰🇾",
          "🇨🇫",
          "🇹🇩",
          "🇨🇱",
          "🇨🇳",
          "🇨🇽",
          "🇨🇨",
          "🇨🇴",
          "🇰🇲",
          "🇨🇬",
          "🇨🇩",
          "🇨🇰",
          "🇨🇷",
          "🇨🇮",
          "🇭🇷",
          "🇨🇺",
          "🇨🇼",
          "🇨🇾",
          "🇨🇿",
          "🇩🇰",
          "🇩🇯",
          "🇩🇲",
          "🇩🇴",
          "🇪🇨",
          "🇪🇬",
          "🇸🇻",
          "🇬🇶",
          "🇪🇷",
          "🇪🇪",
          "🇪🇹",
          "🇪🇺",
          "🇫🇰",
          "🇫🇴",
          "🇫🇯",
          "🇫🇮",
          "🇫🇷",
          "🇬🇫",
          "🇵🇫",
          "🇹🇫",
          "🇬🇦",
          "🇬🇲",
          "🇬🇪",
          "🇩🇪",
          "🇬🇭",
          "🇬🇮",
          "🇬🇷",
          "🇬🇱",
          "🇬🇩",
          "🇬🇵",
          "🇬🇺",
          "🇬🇹",
          "🇬🇬"
        ],
        "⌚️": [
          "⌚️",
          "📱",
          "📲",
          "💻",
          "⌨️",
          "🖥",
          "🖨",
          "🖱",
          "🖲",
          "🕹",
          "🗜",
          "💽",
          "💾",
          "💿",
          "📀",
          "📼",
          "📷",
          "📸",
          "📹",
          "🎥",
          "📽",
          "🎞",
          "📞",
          "☎️",
          "📟",
          "📠",
          "📺",
          "📻",
          "🎙",
          "🎚",
          "🎛",
          "⏱",
          "⏲",
          "⏰",
          "🕰",
          "⌛️",
          "⏳",
          "📡",
          "🔋",
          "🔌",
          "💡",
          "🔦",
          "🕯",
          "🗑",
          "🛢",
          "💸",
          "💵",
          "💴",
          "💶",
          "💷",
          "💰",
          "💳",
          "🧾",
          "💎",
          "⚖️",
          "🔧",
          "🔨",
          "⚒",
          "🛠",
          "⛏",
          "🔩",
          "⚙️",
          "⛓",
          "🔫",
          "💣",
          "🔪",
          "🗡",
          "⚔️",
          "🛡",
          "🚬",
          "⚰️",
          "⚱️",
          "🏺",
          "🧭",
          "🧱",
          "🔮",
          "🧿",
          "🧸",
          "📿",
          "💈",
          "⚗️",
          "🔭",
          "🧰",
          "🧲",
          "🧪",
          "🧫",
          "🧬",
          "🧯",
          "🔬",
          "🕳",
          "💊",
          "💉",
          "🌡",
          "🚽",
          "🚰",
          "🚿",
          "🛁",
          "🛀",
          "🛀🏻",
          "🛀🏼"
        ],
        "❤️": [
          "❤️",
          "🧡",
          "💛",
          "💚",
          "💙",
          "💜",
          "🖤",
          "💔",
          "❣️",
          "💕",
          "💞",
          "💓",
          "💗",
          "💖",
          "💘",
          "💝",
          "💟",
          "☮️",
          "✝️",
          "☪️",
          "🕉",
          "☸️",
          "✡️",
          "🔯",
          "🕎",
          "☯️",
          "☦️",
          "🛐",
          "⛎",
          "♈️",
          "♉️",
          "♊️",
          "♋️",
          "♌️",
          "♍️",
          "♎️",
          "♏️",
          "♐️",
          "♑️",
          "♒️",
          "♓️",
          "🆔",
          "⚛️",
          "🉑",
          "☢️",
          "☣️",
          "📴",
          "📳",
          "🈶",
          "🈚️",
          "🈸",
          "🈺",
          "🈷️",
          "✴️",
          "🆚",
          "💮",
          "🉐",
          "㊙️",
          "㊗️",
          "🈴",
          "🈵",
          "🈹",
          "🈲",
          "🅰️",
          "🅱️",
          "🆎",
          "🆑",
          "🅾️",
          "🆘",
          "❌",
          "⭕️",
          "🛑",
          "⛔️",
          "📛",
          "🚫",
          "💯",
          "💢",
          "♨️",
          "🚷",
          "🚯",
          "🚳",
          "🚱",
          "🔞",
          "📵",
          "🚭",
          "❗️",
          "❕",
          "❓",
          "❔",
          "‼️",
          "⁉️",
          "🔅",
          "🔆",
          "〽️",
          "⚠️",
          "🚸",
          "🔱",
          "⚜️",
          "🔰",
          "♻️"
        ]
      },
      selectedKey: "😀"
    };
  },
  methods: {
    pickEmoji(emoji) {
      this.$emit("emojiPicked", emoji);
    },
    selectKey(key) {
      this.selectedKey = key;
    }
  }
};
</script>

<style lang="scss" scoped>
.emojiList {
  display: flex;
  flex-flow: column;
}

div {
  display: flex;
  flex-flow: row wrap;
  span {
    flex-shrink: 0;
    width: 1.5em;
    height: 1.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
  }
}

.topics {
  max-width: 100%;
  padding: var(--g-s) var(--g-m);
  margin: var(--g-m);
  margin-top: 0;
  overflow-x: scroll;
  border-radius: 0 0 1.5em 1.5em;
  border: var(--line-s);
  border-top: 0;
  background-color: var(--c-primary);
  &::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  flex-flow: row nowrap;
  span {
    width: 2em;
    height: 2em;
    position: relative;
    transform: translateY(0.1em);

    &.selected::after {
      content: " ";
      position: absolute;
      width: 1em;
      border-bottom: 1px solid black;
      top: 90%;
      left: 44%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
}

.emojis {
  border-radius: 1.5em 1.5em 0 0;
  background-color: var(--c-secondary);
  border: var(--line-s);
  max-height: 100%;
  margin: var(--g-m);
  margin-bottom: 0;
  padding: var(--g-m);
  padding-left: 0.75em;
  padding-right: 0;
}
</style>