import Vue from 'vue'
import App from './App.vue'

// global components
import CardSlot from './components/CardSlot.vue';
import SlotGroup from './components/SlotGroup.vue';
import Card from './components/Card.vue';
import HoldSlot from './components/HoldSlot.vue';
import GamePanel from './components/GamePanel.vue';
import Clock from './components/Clock.vue';
import Button from './components/Button.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import GameMenu from './components/GameMenu.vue';
import AuthorInfo from './components/AuthorInfo.vue';

Vue.component('CardSlot', CardSlot)
Vue.component('SlotGroup', SlotGroup)
Vue.component('Card', Card)
Vue.component('HoldSlot', HoldSlot)
Vue.component('GamePanel', GamePanel)
Vue.component('Clock', Clock)
Vue.component('Button', Button)
Vue.component('ScoreBoard', ScoreBoard)
Vue.component('GameMenu', GameMenu)
Vue.component('AuthorInfo', AuthorInfo)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')