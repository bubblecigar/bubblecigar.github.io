<template>
  <div
    id="app"
    @mousemove="updateMousePosition"
    @mouseup="captureCards"
    @touchstart="touched"
    class="background-pattern noselect"
  >
    <GameMenu :gameInfo="gameInfo">
      <Button
        eventName="startNewGame"
        :eventParams="1"
        @startNewGame="startNewGame"
        slot="level1"
      >level 1</Button>
      <Button
        eventName="startNewGame"
        :eventParams="2"
        @startNewGame="startNewGame"
        slot="level2"
      >level 2</Button>
    </GameMenu>

    <ScoreBoard :gameInfo="gameInfo" :time="stampToTime" :level="level">
      <Button eventName="giveUp" @giveUp="giveUp">another round</Button>
    </ScoreBoard>

    <GamePanel :gameInfo="gameInfo" :level="level">
      <Clock :time="stampToTime"></Clock>
      <Button
        eventName="backward"
        @backward="backward"
        :disabled="!historyStack.length"
        style="margin-left:auto"
      >backward</Button>
      <Button eventName="giveUp" @giveUp="giveUp">give up</Button>
    </GamePanel>

    <div class="slot-wrapper">
      <SlotGroup v-for="(group,gi) in groups" :class="[setClassByGI(gi)]">
        <CardSlot
          v-for="(slot,si) in group"
          @slotPicked="slotPicked"
          @slotTouched="slotTouched"
          :indexs="{gi:gi,si:si}"
          :touchDevice="touchDevice"
        >
          <Card
            v-for="(card,ci) in slot"
            :card="card"
            :indexs="{gi:gi,si:si,ci:ci}"
            :touchDevice="touchDevice"
            :style="{'top':top(ci,gi),'z-index':zIndex(ci)}"
            :class="{'card-hover':holdingSlot.cards.length===0, shining: isShining(gi,si,ci)}"
            @cardPicked="cardPicked"
            @cardTouched="cardTouched"
            @autoMove="autoMove"
          />
        </CardSlot>
      </SlotGroup>
    </div>
    <HoldSlot
      :mousePosition="mousePosition"
      :layerCoord="holdingSlot.layerCoord"
      :class="{'noDisplay':touchDevice}"
    >
      <Card
        v-for="(card,ci) in holdingSlot.cards"
        :card="card"
        :style="{'top':top(ci)}"
        class="slinging"
      />
    </HoldSlot>

    <AuthorInfo />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  data() {
    return {
      touchDevice: false,
      groups: [
        [[], [], [], []],
        [[], [], [], []],
        [[], [], [], [], [], [], [], []]
      ],
      level: 1 || 2,
      mousePosition: {
        clientX: 0,
        clientY: 0,
        layerX: 0,
        layerY: 0
      },
      holdingSlot: {
        cards: [],
        indexs: {
          gi: -1,
          si: -1,
          ci: -1
        },
        layerCoord: {
          layerX: 0,
          layerY: 0
        }
      },
      historyStack: [],
      steps: 0,
      currentStamp: this.updateStamp(),
      startingStamp: 0,
      displayedStamp: 0,
      finishingTime: {
        minute: "00",
        second: "00"
      }
    };
  },
  computed: {
    stampToTime() {
      let second = Math.floor(
        (this.displayedStamp - this.startingStamp) / 1000
      );
      let minute = Math.floor(second / 60);
      second -= minute * 60;
      second = "00" + second.toString();
      second = second[second.length - 2] + second[second.length - 1];
      minute = "00" + minute.toString();
      minute = minute[minute.length - 2] + minute[minute.length - 1];
      return {
        second,
        minute
      };
    },
    cardsAmount() {
      let c = 0;
      this.groups.forEach(group => {
        group.forEach(slot => {
          c += slot.length;
        });
      });
      return c;
    },
    gameState() {
      if (this.cardsAmount === 0) {
        return "Waiting";
      } else {
        return this.finishedCards >= 52 ? "Win" : "Playing";
      }
    },
    finishedCards() {
      let finishedCards = 0;
      this.groups[0].forEach(slot => {
        finishedCards += slot.length;
      });
      return finishedCards;
    },
    gameInfo() {
      return {
        gameState: this.gameState,
        finishedCards: this.finishedCards,
        steps: this.steps
      };
    }
  },
  methods: {
    touched(e) {
      this.touchDevice = true;
      this.mousePosition.clientX = e.touches[0].clientX;
      this.mousePosition.clientY = e.touches[0].clientY;
      this.clearHoldingSlot();
    },
    autoMove(indexs) {
      const group = this.groups[indexs.gi];
      const slot = group[indexs.si];
      const b = [...slot];
      const cards = [...b.splice(indexs.ci)];
      this.holdingSlot.cards.push(...cards);
      this.holdingSlot.indexs.gi = indexs.gi;
      this.holdingSlot.indexs.si = indexs.si;
      this.holdingSlot.indexs.ci = indexs.ci;
      // foundation => cascade => cell
      for (let turn = 0; turn < 3; turn++) {
        let gi;
        switch (turn) {
          case 0:
            gi = 0;
            break;
          case 1:
            gi = 2;
            break;
          case 2:
            gi = 1;
            break;
        }
        for (let si = 0; si < this.groups[gi].length; si++) {
          const indexs = { gi, si };
          this.slotPicked(indexs, false);
        }
      }

      setTimeout(() => {
        this.clearHoldingSlot();
      }, 1);
    },
    isShining(gi, si, ci) {
      if (this.holdingSlot.indexs.gi != gi) {
        return false;
      }
      if (this.holdingSlot.indexs.si != si) {
        return false;
      }
      if (this.holdingSlot.indexs.ci > ci) {
        return false;
      }
      return true;
    },
    updateStamp() {
      this.currentStamp = Date.now();

      if (this.gameState === "Playing") {
        this.displayedStamp = this.currentStamp;
      } else if (this.gameState === "Win") {
        // do nothing, hold the stamps
      } else if (this.gameState === "Waiting") {
        this.displayedStamp = this.currentStamp;
        this.startingStamp = this.currentStamp;
      }

      window.requestAnimationFrame(() => {
        this.updateStamp();
      });
    },
    giveUp() {
      this.clearDeck();
    },
    zIndex(ci) {
      return ci + 2;
    },
    updateTime(finishingTime) {
      this.finishingTime.minute = finishingTime.minute;
      this.finishingTime.second = finishingTime.second;
    },
    isHide(gi, si, ci) {
      const i = this.holdingSlot.indexs;
      if (i.gi === gi && i.si === si && i.ci <= ci) {
        return 0.7;
      } else {
        return 1;
      }
    },
    startNewGame(level = 2) {
      this.clearDeck();
      this.groups = this.createDeck();
      this.steps = 0;
      this.historyStack.splice(0);
      this.startingStamp = Date.now();
      this.finishingTime.minute = "00";
      this.finishingTime.second = "00";
      this.level = level;
    },
    setClassByGI(gi) {
      switch (gi) {
        case 0:
          return "foundation-group";
          break;
        case 1:
          return "cell-group";
          break;
        case 2:
          return "cascade-group";
          break;
      }
    },
    captureCards() {
      if (this.touchDevice === true) {
        return;
      }
      this.clearHoldingSlot();
    },
    updateMousePosition(e) {
      this.mousePosition.clientX = e.clientX;
      this.mousePosition.clientY = e.clientY;
    },
    top(ci, gi = 2) {
      switch (gi) {
        case 0:
          return `0px`;
          break;
        case 1:
          return `0px`;
          break;
        case 2:
          return `${ci * 30}px`;
          break;
      }
    },
    createDeck(side = "up") {
      const orderDeck = [];
      for (let i = 0; i < 52; i++) {
        let card = {};
        card.id = i + 1;
        card.point = 1 + (i % 13);
        switch (Math.floor(i / 13)) {
          case 0:
            card.suit = "spade";
            card.color = "black";
            break;
          case 1:
            card.suit = "heart";
            card.color = "red";
            break;
          case 2:
            card.suit = "diamond";
            card.color = "red";
            break;
          case 3:
            card.suit = "club";
            card.color = "black";
            break;
        }
        card.side = side;
        orderDeck.push(card);
      }
      const shuffledDeck = [];
      while (orderDeck.length > 0) {
        const index = Math.floor(Math.random() * orderDeck.length);
        shuffledDeck.push(orderDeck.splice(index, 1)[0]);
      }

      const groups = [
        [[], [], [], []],
        [[], [], [], []],
        [[], [], [], [], [], [], [], []]
      ];

      groups[2][0].push(...shuffledDeck.splice(0, 7));
      groups[2][1].push(...shuffledDeck.splice(0, 7));
      groups[2][2].push(...shuffledDeck.splice(0, 7));
      groups[2][3].push(...shuffledDeck.splice(0, 7));
      groups[2][4].push(...shuffledDeck.splice(0, 6));
      groups[2][5].push(...shuffledDeck.splice(0, 6));
      groups[2][6].push(...shuffledDeck.splice(0, 6));
      groups[2][7].push(...shuffledDeck.splice(0, 6));

      return groups;
    },
    clearDeck() {
      this.groups.forEach(group => {
        group.forEach(slot => {
          slot.splice(0);
        });
      });
    },
    copyCard(target) {
      // suit point side color id
      const newCard = {};
      newCard.id = target.id;
      newCard.point = target.point;
      newCard.side = target.side;
      newCard.color = target.color;
      newCard.suit = target.suit;
      return newCard;
    },
    cardTouched(indexs) {
      setTimeout(() => {
        if (this.holdingSlot.cards.length === 0) {
          this.cardPicked(indexs);
        }
      }, 5);
    },
    slotTouched(indexs) {
      if (this.holdingSlot.cards.length > 0) {
        this.slotPicked(indexs);
      }
    },
    cardPicked(indexs, layerCoord = { layerX: 25, layerY: 50 }) {
      // drag
      if (this.holdingSlot.cards.length === 0) {
        const group = this.groups[indexs.gi];
        const slot = group[indexs.si];
        const card = slot[indexs.ci];

        // if side === down, check if the card is flippable
        if (card.side === "down") {
          if (indexs.ci === slot.length - 1) {
            this.historyStack.push(this.copyGroups());
            let b = slot.pop();
            b = this.copyCard(b);
            b.side = "up";
            slot.push(b);
            this.steps++;
          }
        }
        // if side === up, check if the cards are draggable
        else {
          let b = [...slot];
          b = b.splice(indexs.ci);
          if (this.isInOrder(b, this.level)) {
            this.holdingSlot.cards.push(...b);
            this.holdingSlot.indexs.gi = indexs.gi;
            this.holdingSlot.indexs.si = indexs.si;
            this.holdingSlot.indexs.ci = indexs.ci;
            this.holdingSlot.layerCoord.layerX = layerCoord.layerX;
            this.holdingSlot.layerCoord.layerY = layerCoord.layerY;
          }
        }
      }
    },
    slotPicked(indexs, reset = true) {
      // drop
      if (this.holdingSlot.cards.length > 0) {
        const group = this.groups[indexs.gi];
        const slot = group[indexs.si];
        const ii = this.holdingSlot.indexs; //initial indexs
        if (indexs.gi === 0 && this.holdingSlot.cards.length === 1) {
          // foundations group
          if (slot.length === 0 && this.holdingSlot.cards[0].point === 1) {
            this.movePile(ii, slot);
          } else if (slot.length > 0) {
            const lastCard = slot[slot.length - 1];
            if (
              this.holdingSlot.cards[0].point === lastCard.point + 1 &&
              this.holdingSlot.cards[0].suit === lastCard.suit
            ) {
              this.movePile(ii, slot);
            }
          }
        } else if (
          indexs.gi === 1 &&
          this.holdingSlot.cards.length === 1 &&
          slot.length === 0
        ) {
          // cells group
          this.movePile(ii, slot);
        } else if (indexs.gi === 2) {
          // cascades group

          if (slot.length === 0) {
            this.movePile(ii, slot);
          } else {
            const lastCard = slot[slot.length - 1];
            if (lastCard.side === "down") {
              this.movePile(ii, slot);
            } else if (lastCard.side === "up") {
              const b = [lastCard, ...this.holdingSlot.cards];
              if (this.isInOrder(b, this.level)) {
                this.movePile(ii, slot);
              }
            }
          }
        }
        if (reset === true) {
          this.clearHoldingSlot();
        }
      }
    },
    movePile(ii, slot) {
      this.historyStack.push(this.copyGroups());
      slot.push(...this.groups[ii.gi][ii.si].splice(ii.ci));
      this.steps++;
      this.clearHoldingSlot();
    },
    copyGroups() {
      const newGroups = [
        [[], [], [], []],
        [[], [], [], []],
        [[], [], [], [], [], [], [], []]
      ];
      this.groups.forEach((group, gi) => {
        group.forEach((slot, si) => {
          slot.forEach((card, ci) => {
            newGroups[gi][si].push(card);
          });
        });
      });
      return newGroups;
    },
    backward() {
      const historyData = this.historyStack.pop();
      this.clearDeck();
      this.groups.forEach((group, gi) => {
        group.forEach((slot, si) => {
          if (historyData[gi][si].length > 0) {
            slot.push(...historyData[gi][si]);
          }
        });
      });
      this.steps++;
    },
    clearHoldingSlot() {
      this.holdingSlot.cards.splice(0);
      this.holdingSlot.indexs.gi = -1;
      this.holdingSlot.indexs.si = -1;
      this.holdingSlot.indexs.ci = -1;
    },
    isInOrder(cards, level = 1) {
      if (level === 1) {
        for (let i = 1; i < cards.length; i++) {
          if (cards[i - 1].point < cards[i].point) {
            return false;
          }
          if (cards[i - 1].color === cards[i].color) {
            return false;
          }
        }
        return true;
      } else if (level === 2) {
        for (let i = 1; i < cards.length; i++) {
          if (cards[i - 1].point !== cards[i].point + 1) {
            return false;
          }
          if (cards[i - 1].color === cards[i].color) {
            return false;
          }
        }
        return true;
      }
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
@media (orientation: portrait) {
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  min-width: 980px;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  background-color: rgb(99, 146, 99);
  overflow: hidden;
}
#app:active {
  cursor: grabbing;
}
.shining {
  animation: shine;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-direction: alternate;
}
@keyframes shine {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 0.9;
  }
}
.slinging {
  animation: sling;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: alternate;
}
@keyframes sling {
  from {
    transform: rotateZ(5deg);
  }
  to {
    transform: rotateZ(-5deg);
  }
}
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.layout-wrapper {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
}
.slot-wrapper {
  display: flex;
  flex-flow: row wrap;
  max-width: 960px;
  justify-content: center;
  align-items: center;
}
.background-pattern {
  background-color: transparent;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%238eaf71' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%236c913f' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%23b9cba1' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23448045' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%23ac8648' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%231b7d45' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%23a2c165' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%231d6f6d' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%23c4e33d' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%231a4c6b' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%23fbfc26' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%236e743d' points='943 900 1210 900 971 687'/%3E%3C/svg%3E");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
.noDisplay {
  display: none;
}
</style>
