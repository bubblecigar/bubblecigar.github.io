(function(t){function e(e){for(var i,r,o=e[0],c=e[1],l=e[2],d=0,p=[];d<o.length;d++)r=o[d],s[r]&&p.push(s[r][0]),s[r]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);u&&u(e);while(p.length)p.shift()();return a.push.apply(a,l||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],i=!0,o=1;o<n.length;o++){var c=n[o];0!==s[c]&&(i=!1)}i&&(a.splice(e--,1),t=r(r.s=n[0]))}return t}var i={},s={app:0},a=[];function r(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=i,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/F2E-freecell/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var l=0;l<o.length;l++)e(o[l]);var u=c;a.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var i=n("64a9"),s=n.n(i);s.a},"0e94":function(t,e,n){"use strict";var i=n("6e44"),s=n.n(i);s.a},"0f30":function(t,e,n){"use strict";var i=n("9af6"),s=n.n(i);s.a},"444c":function(t,e,n){"use strict";var i=n("76e8"),s=n.n(i);s.a},"477f":function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var i=n("2b0e"),s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"background-pattern",attrs:{id:"app"},on:{mousemove:t.updateMousePosition,mouseup:t.captureCards}},[n("GameMenu",{attrs:{gameInfo:t.gameInfo}},[n("Button",{attrs:{slot:"level1",eventName:"startNewGame",eventParams:1},on:{startNewGame:t.startNewGame},slot:"level1"},[t._v("level 1")]),n("Button",{attrs:{slot:"level2",eventName:"startNewGame",eventParams:2},on:{startNewGame:t.startNewGame},slot:"level2"},[t._v("level 2")])],1),n("ScoreBoard",{attrs:{gameInfo:t.gameInfo,time:t.stampToTime,level:t.level}},[n("Button",{attrs:{eventName:"giveUp"},on:{giveUp:t.giveUp}},[t._v("another round")])],1),n("GamePanel",{attrs:{gameInfo:t.gameInfo,level:t.level}},[n("Clock",{attrs:{time:t.stampToTime}}),n("Button",{staticStyle:{"margin-left":"auto"},attrs:{eventName:"backward",disabled:!t.historyStack.length},on:{backward:t.backward}},[t._v("backward")]),n("Button",{attrs:{eventName:"giveUp"},on:{giveUp:t.giveUp}},[t._v("give up")])],1),n("div",{staticClass:"slot-wrapper"},t._l(t.groups,function(e,i){return n("SlotGroup",{class:[t.setClassByGI(i)]},t._l(e,function(e,s){return n("CardSlot",{attrs:{indexs:{gi:i,si:s}},on:{slotPicked:t.slotPicked}},t._l(e,function(e,a){return n("Card",{class:{"card-hover":0===t.holdingSlot.cards.length,shining:t.isShining(i,s,a)},style:{top:t.top(a,i),"z-index":t.zIndex(a)},attrs:{card:e,indexs:{gi:i,si:s,ci:a}},on:{cardPicked:t.cardPicked}})}),1)}),1)}),1),n("HoldSlot",{attrs:{mousePosition:t.mousePosition,layerCoord:t.holdingSlot.layerCoord}},t._l(t.holdingSlot.cards,function(e,i){return n("Card",{staticClass:"shining",style:{top:t.top(i)},attrs:{card:e}})}),1)],1)},a=[],r=n("75fc"),o=(n("ac6a"),n("6b54"),{name:"app",components:{},data:function(){return{groups:[[[],[],[],[]],[[],[],[],[]],[[],[],[],[],[],[],[],[]]],level:1,mousePosition:{clientX:0,clientY:0,layerX:0,layerY:0},holdingSlot:{cards:[],indexs:{gi:-1,si:-1,ci:-1},layerCoord:{layerX:0,layerY:0}},historyStack:[],steps:0,currentStamp:this.updateStamp(),startingStamp:0,displayedStamp:0,finishingTime:{minute:"00",second:"00"}}},computed:{stampToTime:function(){var t=Math.floor((this.displayedStamp-this.startingStamp)/1e3),e=Math.floor(t/60);return t-=60*e,t="00"+t.toString(),t=t[t.length-2]+t[t.length-1],e="00"+e.toString(),e=e[e.length-2]+e[e.length-1],{second:t,minute:e}},cardsAmount:function(){var t=0;return this.groups.forEach(function(e){e.forEach(function(e){t+=e.length})}),t},gameState:function(){return 0===this.cardsAmount?"Waiting":this.finishedCards>=52?"Win":"Playing"},finishedCards:function(){var t=0;return this.groups[0].forEach(function(e){t+=e.length}),t},gameInfo:function(){return{gameState:this.gameState,finishedCards:this.finishedCards,steps:this.steps}}},methods:{isShining:function(t,e,n){return this.holdingSlot.indexs.gi==t&&(this.holdingSlot.indexs.si==e&&!(this.holdingSlot.indexs.ci>n))},updateStamp:function(){var t=this;this.currentStamp=Date.now(),"Playing"===this.gameState?this.displayedStamp=this.currentStamp:"Win"===this.gameState||"Waiting"===this.gameState&&(this.displayedStamp=this.currentStamp,this.startingStamp=this.currentStamp),window.requestAnimationFrame(function(){t.updateStamp()})},giveUp:function(){this.clearDeck()},zIndex:function(t){return t+2},updateTime:function(t){this.finishingTime.minute=t.minute,this.finishingTime.second=t.second},isHide:function(t,e,n){var i=this.holdingSlot.indexs;return i.gi===t&&i.si===e&&i.ci<=n?.7:1},startNewGame:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2;this.clearDeck(),this.groups=this.createDeck(),this.steps=0,this.historyStack.splice(0),this.startingStamp=Date.now(),this.finishingTime.minute="00",this.finishingTime.second="00",this.level=t},setClassByGI:function(t){switch(t){case 0:return"foundation-group";case 1:return"cell-group";case 2:return"cascade-group"}},captureCards:function(){this.clearHoldingSlot()},updateMousePosition:function(t){this.mousePosition.clientX=t.clientX,this.mousePosition.clientY=t.clientY},top:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;switch(e){case 0:return"0px";case 1:return"0px";case 2:return"".concat(30*t,"px")}},createDeck:function(){for(var t,e,n,i,s,a,o,c,l=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"up",u=[],d=0;d<52;d++){var p={};switch(p.id=d+1,p.point=1+d%13,Math.floor(d/13)){case 0:p.suit="spade",p.color="black";break;case 1:p.suit="heart",p.color="red";break;case 2:p.suit="diamond",p.color="red";break;case 3:p.suit="club",p.color="black";break}p.side=l,u.push(p)}var f=[];while(u.length>0){var h=Math.floor(Math.random()*u.length);f.push(u.splice(h,1)[0])}var v=[[[],[],[],[]],[[],[],[],[]],[[],[],[],[],[],[],[],[]]];return(t=v[2][0]).push.apply(t,Object(r["a"])(f.splice(0,7))),(e=v[2][1]).push.apply(e,Object(r["a"])(f.splice(0,7))),(n=v[2][2]).push.apply(n,Object(r["a"])(f.splice(0,7))),(i=v[2][3]).push.apply(i,Object(r["a"])(f.splice(0,7))),(s=v[2][4]).push.apply(s,Object(r["a"])(f.splice(0,6))),(a=v[2][5]).push.apply(a,Object(r["a"])(f.splice(0,6))),(o=v[2][6]).push.apply(o,Object(r["a"])(f.splice(0,6))),(c=v[2][7]).push.apply(c,Object(r["a"])(f.splice(0,6))),v},clearDeck:function(){this.groups.forEach(function(t){t.forEach(function(t){t.splice(0)})})},copyCard:function(t){var e={};return e.id=t.id,e.point=t.point,e.side=t.side,e.color=t.color,e.suit=t.suit,e},cardPicked:function(t,e){if(0===this.holdingSlot.cards.length){var n=this.groups[t.gi],i=n[t.si],s=i[t.ci];if("down"===s.side){if(t.ci===i.length-1){this.historyStack.push(this.copyGroups());var a=i.pop();a=this.copyCard(a),a.side="up",i.push(a),this.steps++}}else{var o,c=Object(r["a"])(i);if(c=c.splice(t.ci),this.isInOrder(c,this.level))(o=this.holdingSlot.cards).push.apply(o,Object(r["a"])(c)),this.holdingSlot.indexs.gi=t.gi,this.holdingSlot.indexs.si=t.si,this.holdingSlot.indexs.ci=t.ci,this.holdingSlot.layerCoord.layerX=e.layerX,this.holdingSlot.layerCoord.layerY=e.layerY}}},slotPicked:function(t){if(this.holdingSlot.cards.length>0){var e=this.groups[t.gi],n=e[t.si],i=this.holdingSlot.indexs;if(0===t.gi&&1===this.holdingSlot.cards.length){if(0===n.length&&1===this.holdingSlot.cards[0].point)this.movePile(i,n);else if(n.length>0){var s=n[n.length-1];this.holdingSlot.cards[0].point===s.point+1&&this.holdingSlot.cards[0].suit===s.suit&&this.movePile(i,n)}}else if(1===t.gi&&1===this.holdingSlot.cards.length&&0===n.length)this.movePile(i,n);else if(2===t.gi)if(0===n.length)this.movePile(i,n);else{var a=n[n.length-1];if("down"===a.side)this.movePile(i,n);else if("up"===a.side){var o=[a].concat(Object(r["a"])(this.holdingSlot.cards));this.isInOrder(o,this.level)&&this.movePile(i,n)}}this.clearHoldingSlot()}},movePile:function(t,e){this.historyStack.push(this.copyGroups()),e.push.apply(e,Object(r["a"])(this.groups[t.gi][t.si].splice(t.ci))),this.steps++},copyGroups:function(){var t=[[[],[],[],[]],[[],[],[],[]],[[],[],[],[],[],[],[],[]]];return this.groups.forEach(function(e,n){e.forEach(function(e,i){e.forEach(function(e,s){t[n][i].push(e)})})}),t},backward:function(){var t=this.historyStack.pop();this.clearDeck(),this.groups.forEach(function(e,n){e.forEach(function(e,i){t[n][i].length>0&&e.push.apply(e,Object(r["a"])(t[n][i]))})}),this.steps++},clearHoldingSlot:function(){this.holdingSlot.cards.splice(0),this.holdingSlot.indexs.gi=-1,this.holdingSlot.indexs.si=-1,this.holdingSlot.indexs.ci=-1},isInOrder:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(1===e){for(var n=1;n<t.length;n++){if(t[n-1].point<t[n].point)return!1;if(t[n-1].color===t[n].color)return!1}return!0}if(2===e){for(var i=1;i<t.length;i++){if(t[i-1].point!==t[i].point+1)return!1;if(t[i-1].color===t[i].color)return!1}return!0}}}}),c=o,l=(n("034f"),n("2877")),u=Object(l["a"])(c,s,a,!1,null,null,null),d=u.exports,p=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"card-slot unselectable",on:{mouseup:t.slotPicked}},[n("div",{staticClass:"hint",domProps:{innerHTML:t._s(t.hint)}}),t._t("default")],2)},f=[],h={props:{indexs:{type:Object,required:!0}},methods:{slotPicked:function(){this.$emit("slotPicked",this.indexs)}},computed:{hint:function(){switch(this.indexs.gi){case 0:return'<i class="fas fa-boxes"></i>';case 1:return'<i class="fas fa-dolly"></i>';case 2:return'<i class="fas fa-dolly-flatbed"></i>'}}}},v=h,m=(n("8d2e"),Object(l["a"])(v,p,f,!1,null,"3f8c96a8",null)),g=m.exports,_=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"slot-group"},[t._t("default")],2)},b=[],y={},S=y,C=(n("7ae5"),Object(l["a"])(S,_,b,!1,null,"0a1433ae",null)),k=C.exports,P=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"card-wrapper",class:[t.card.side],on:{mousedown:t.cardPicked}},[n("div",{staticClass:"card-front card unselectable",class:[t.card.color]},[n("span",{staticClass:"banner-top banner"},[n("i",{class:t.card.suit,domProps:{innerHTML:t._s(t.suit_Icon(t.card.suit))}}),n("i",[t._v(t._s(t.point_AKQJ(t.card.point)))])]),n("span",{staticClass:"card-body",domProps:{innerHTML:t._s(t.point_PIC(t.card.point))}}),n("span",{staticClass:"banner-bottom banner"},[n("i",{class:t.card.suit,domProps:{innerHTML:t._s(t.suit_Icon(t.card.suit))}}),n("i",[t._v(t._s(t.point_AKQJ(t.card.point)))])]),n("div",{staticClass:"front-cover"})]),n("div",{staticClass:"card-back card"})])},x=[],O={props:{card:{type:Object,required:!1,default:function(){return{id:0,side:"up",color:"black",suit:"spade",point:0}}},indexs:{type:Object,required:!1,default:function(){return{gi:-1,si:-1,ci:-1}}}},methods:{cardPicked:function(t){var e={layerX:t.layerX,layerY:t.layerY};this.$emit("cardPicked",this.indexs,e)},point_AKQJ:function(t){switch(t){case 1:return"A";case 13:return"K";case 12:return"Q";case 11:return"J";default:return t}},point_PIC:function(t){switch(t){case 1:return'<i class="fas fa-chess-bishop"></i>';case 13:return'<i class="fas fa-chess-king"></i>';case 12:return'<i class="fas fa-chess-queen"></i>';case 11:return'<i class="fas fa-chess-knight"></i>';default:return t}},suit_Icon:function(t){switch(t){case"spade":return'<i class="fas fa-seedling"></i>';case"heart":return'<i class="fas fa-water"></i>';case"diamond":return'<i class="fas fa-cloud"></i>';case"club":return'<i class="fas fa-carrot"></i>'}}}},w=O,j=(n("0f30"),Object(l["a"])(w,P,x,!1,null,"5c1348fa",null)),E=j.exports,I=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"hold-slot",style:{top:t.top,left:t.left}},[t._t("default")],2)},N=[],T={props:{mousePosition:{type:Object,required:!1,default:function(){return{clientX:0,clientY:0}}},layerCoord:{type:Object,required:!1,default:function(){return{layerX:0,layerY:0}}}},computed:{top:function(){return"".concat(this.mousePosition.clientY-this.layerCoord.layerY-5,"px")},left:function(){return"".concat(this.mousePosition.clientX-this.layerCoord.layerX,"px")}}},$=T,G=(n("ee6d"),Object(l["a"])($,I,N,!1,null,"630038b0",null)),M=G.exports,q=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"game-panel"},[t._m(0),n("p",[t._v("Lv. "+t._s(t.level))]),n("p",[n("i",{staticClass:"fas fa-layer-group"}),t._v("\n    "+t._s(t.gameInfo.finishedCards)+"\n  ")]),n("p",[n("i",{staticClass:"fas fa-shoe-prints"}),t._v("\n    "+t._s(t.gameInfo.steps)+"\n  ")]),t._t("default")],2)},Y=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("h1",[n("i",{staticClass:"fas fa-chess"}),t._v("\n    FreeCell \n    "),n("i",{staticClass:"fas fa-chess-board slant"})])}],X=(n("c5f6"),{props:{gameInfo:{type:Object},level:{type:Number,required:!0}}}),B=X,H=(n("ee25"),Object(l["a"])(B,q,Y,!1,null,"11fcdb3c",null)),D=H.exports,A=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"game-clock"},[n("i",{staticClass:"fas fa-clock"}),n("span",[t._v(t._s(t.time.minute)+" : "+t._s(t.time.second))])])},U=[],z={props:{time:{type:Object,required:!0}}},J=z,W=(n("e162"),Object(l["a"])(J,A,U,!1,null,"6e77be40",null)),F=W.exports,L=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("button",{staticClass:"customized-button",on:{click:t.emitEvent}},[t._t("default")],2)},K=[],Q={props:{eventName:{type:String,required:!0},eventParams:{type:Number,required:!1,default:0}},methods:{emitEvent:function(){this.$emit(this.eventName,this.eventParams)}}},R=Q,V=(n("8fce"),Object(l["a"])(R,L,K,!1,null,"26ef119f",null)),Z=V.exports,tt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrapper",class:{hide:"Playing"===t.gameInfo.gameState||"Waiting"===t.gameInfo.gameState}},[n("div",{staticClass:"score-board background-pattern customized-font"},[n("p",[t._v("Congratulations !")]),n("p",[t._v("\n      You have finished FreeCell\n      level\n      "),n("strong",[t._v(t._s(t.level))])]),n("p",[t._v("\n      in\n      "),n("strong",[t._v(t._s(Number(t.time.minute)))]),t._v(" minute(s) and\n      "),n("strong",[t._v(t._s(Number(t.time.second)))]),t._v(" seconds\n    ")]),n("p",[t._v("\n      by\n      "),n("strong",[t._v(t._s(t.gameInfo.steps))]),t._v(" steps\n    ")]),t._m(0),n("p",{staticClass:"delay"},[t._v("\n      >>>\n      "),t._t("default"),t._v("<<<\n    ")],2)])])},et=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",[t._v("\n      good job !\n      "),n("i",{staticClass:"fas fa-laugh-wink rotate"})])}],nt={props:{gameInfo:{type:Object,required:!0},time:{type:Object,required:!0},level:{type:Number,required:!0}}},it=nt,st=(n("0e94"),Object(l["a"])(it,tt,et,!1,null,"f4d34240",null)),at=st.exports,rt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrapper customized-font",class:{hide:"Playing"===t.gameInfo.gameState||"Win"===t.gameInfo.gameState}},[n("div",{staticClass:"game-menu background-pattern"},[t._m(0),n("div",{staticClass:"options"},[n("div",{staticClass:"option level1"},[t._m(1),t._v(">>>\n        "),t._t("level1"),t._v("<<<\n      ")],2),n("div",{staticClass:"option level2"},[t._m(2),t._v(">>>\n        "),t._t("level2"),t._v("<<<\n      ")],2)])])])},ot=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"logo"},[t._v("\n      --FreeCell solitaire--\n      "),n("br"),n("sub",[t._v("welcome! select difficulty:")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"explain"},[n("h1",[n("i",{staticClass:"fas fa-baby-carriage"}),t._v("\n            Easy\n          ")]),n("span",[t._v("Succeeding card must have:")]),n("span",[t._v("- different color")]),n("span",[t._v("\n            -\n            "),n("strong",[t._v("equal or less")]),t._v(" points\n          ")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"explain"},[n("h1",[n("i",{staticClass:"fas fa-bicycle"}),t._v(" Standard\n          ")]),n("span",[t._v("Succeeding card must have:")]),n("span",[t._v("- different color")]),n("span",[t._v("\n            -\n            "),n("strong",[t._v("-1")]),t._v(" point\n          ")])])}],ct={props:{gameInfo:{type:Object}}},lt=ct,ut=(n("444c"),Object(l["a"])(lt,rt,ot,!1,null,"5518e813",null)),dt=ut.exports;i["a"].component("CardSlot",g),i["a"].component("SlotGroup",k),i["a"].component("Card",E),i["a"].component("HoldSlot",M),i["a"].component("GamePanel",D),i["a"].component("Clock",F),i["a"].component("Button",Z),i["a"].component("ScoreBoard",at),i["a"].component("GameMenu",dt),i["a"].config.productionTip=!1,new i["a"]({render:function(t){return t(d)}}).$mount("#app")},6490:function(t,e,n){},"64a9":function(t,e,n){},"69af":function(t,e,n){},"6e44":function(t,e,n){},"751a":function(t,e,n){},"76e8":function(t,e,n){},"7ae5":function(t,e,n){"use strict";var i=n("6490"),s=n.n(i);s.a},8973:function(t,e,n){},"8d2e":function(t,e,n){"use strict";var i=n("477f"),s=n.n(i);s.a},"8fce":function(t,e,n){"use strict";var i=n("69af"),s=n.n(i);s.a},"95f9":function(t,e,n){},"9af6":function(t,e,n){},e162:function(t,e,n){"use strict";var i=n("751a"),s=n.n(i);s.a},ee25:function(t,e,n){"use strict";var i=n("8973"),s=n.n(i);s.a},ee6d:function(t,e,n){"use strict";var i=n("95f9"),s=n.n(i);s.a}});
//# sourceMappingURL=app.4ea0b580.js.map