'use strict'

let needUpdate = true;

// data closure
function createList(){
    const missions = [];
    return {
        getMissionsAmount: function(){
            return missions.length;
        },
        deleteMission: function(index){
            missions.splice(index,1);
            needUpdate = true;
        },
        addMission: function(title=`new mission`,state = 'unDone',tomato = 0){
            missions.push({
                getTitle: function(){
                    return title;
                },
                setTitle: function(newTitle='new title'){
                    title = newTitle;
                    needUpdate = true;
                },
                getState: function(){
                    return state;
                },
                toggleState: function(){
                    state === 'unDone' ? state = 'isDone' : state = 'unDone';
                    needUpdate = true;
                },
                getTomato: function(){
                    return tomato;
                },
                addTomato: function(){
                    tomato++;
                    needUpdate = true;
                }
            });
            needUpdate = true;
        },
        getMission: function(index){
            return missions[index];
        },
        getUpdateState: function(){
            return updateState;
        },
        requestUpdate: function(){
            needUpdate = true;
        },
        getStaticData: function(){
            const storage = [];
            missions.forEach((el,i)=>{
                storage.push(
                    {
                        title: el.getTitle(),
                        state: el.getState(),
                        tomato: el.getTomato()
                    }
                )
            })
            return storage;
        },
        calcIsDone: function(){
            let isDone = 0;
            missions.forEach((el)=>{    
                if (el.getState()==='isDone'){
                    isDone++;
                }
            });
            return isDone;
        },
        calcTomato: function(){
            let tomato = 0;
            missions.forEach((el)=>{
                if(el.getState()==='isDone'){
                    tomato += el.getTomato();
                }
            });
            return tomato;
        },
        arrangeList: function(order=[]){
            if(order.length !== missions.length){
                console.log('order length mismatch');
                return;
            }
            const buffer = [...missions];
            for(let i=0;i<missions.length;i++){
                missions[i] = buffer[order[i]];
            }
            needUpdate = true;
        },
        reRangeList: function(){
            const todo = [];
            const done = [];
            missions.forEach((el,i)=>{
                if(el.getState()==='isDone'){
                    done.push(el);
                }else{
                    todo.push(el);
                }
            });
            const buffer = [...todo,...done];
            for(let i=0;i<missions.length;i++){
                missions[i] = buffer[i];
            }
        },
        getChartData: function(){
            return{
                totTomato: this.calcTomato(),
                totMission: this.calcIsDone(),
                timeStamp: todayStamp
            }
        }
    }
}
const list = createList(); // list of the day

// load & save data with store.js
function dayStamp(date = new Date()){
    const stamp = date.getTime();
    const per = 86400000;
    const dayStamp = Math.floor(stamp/per);
    return dayStamp;
}
function stampToString(stamp = dayStamp()){
    const d = new Date(stamp * 86400000);
    let str = '';
    str += `${d.getMonth() + 1}/${d.getDate()}`;
    return str;
}
const todayStamp = dayStamp(new Date());
const weekHistory = []; // one time load
initByStorage();
function initByStorage(timeKey = todayStamp,key = `tomatoClock`){
    const storage = store.get(key);
    if(!storage){
        store.set(key,{});
        return;
    }
    if(!storage[timeKey]){
        return;
    }
    storage[timeKey].forEach((el,i)=>{
        list.addMission(el.title,el.state,el.tomato);
    });
    // load six days' history to weekHistory
    for(let i=6;i>0;i--){
        if(storage[timeKey-i]){
            weekHistory.push(storage[timeKey-i]);
        }
    }
}
let historyData = [];
let weekTomato = 0;
let weekMission = 0;
function updateChart(){
    let type;
    if(analyseTomato.className.includes('hide')){
        type = 'totMission';
    }else{
        type = 'totTomato';
    }
    // update history data
    historyData = [];
    weekTomato = 0;
    weekMission = 0;
    weekHistory.forEach((el,i)=>{
        let totTomato = 0;
        let totMission = 0;
        el.forEach((el,i)=>{
            if(el.state === 'isDone'){
                totTomato += el.tomato;
                totMission ++;
            }
        })
        weekTomato += totTomato;
        weekMission += totMission;
        historyData.push({
            timeStamp: todayStamp - weekHistory.length + i,
            totTomato: totTomato,
            totMission, totMission
        })
    });
    historyData.push(list.getChartData());

    // render on canvas
    const canvas = document.querySelector('#js-chart');
    const cHeight = canvas.height;
    const cWidth = canvas.width;
    const rWidth = cWidth / 8;
    const rHeight = cHeight * 0.1;
    const l = historyData.length;
    const interval = cWidth/l;
    const offset = (interval - rWidth)*.5;
    const ctx = canvas.getContext('2d');
    // clear canvas
    ctx.clearRect(0,0,cWidth,cHeight);
    function drawRect(x,y){
        ctx.fillRect(x,cHeight-y,rWidth,y);
    }
    ctx.font = '15px serif';
    ctx.textAlign = 'center';
    historyData.forEach((el,i)=>{
        const x = i*interval + offset;
        const y = el[type]*rHeight;
        ctx.fillStyle = 'black';
        drawRect(x,y);
        ctx.fillStyle = 'white';
        const str = stampToString(el.timeStamp);
        ctx.fillText(str,x+rWidth/2,cHeight-5);
    });
}

function updateStorage(timeKey = todayStamp,key = `tomatoClock`){
    const storage = store.get(key);
    storage[timeKey] = [...list.getStaticData()];
    store.set(key,storage);
}


// update user interface according to list
const ul_todo = document.querySelector('#js-todo');
const ul_done = document.querySelector('#js-done');
const ul_focus = document.querySelector('#js-focusTime');
const ul_chart = document.querySelector('#js-chart');
const ul_wrapper = document.querySelector('.panel-wrapper');
function updateScreen(){
    ul_todo.innerHTML = '';
    ul_done.innerHTML = '';     
    const l = list.getMissionsAmount();
    for(let i=0;i<l;i++){
        const li = document.createElement('li');
        
        const mission = list.getMission(i);
        const title = mission.getTitle();
        const state = mission.getState();
        li.innerHTML = `
            <button data-index='${i}' data-state='${mission.getState()}' class='js-toggle'></button>
            <input data-index='${i}' type='text' value='${title}'>
            <button data-index='${i}' class='js-delete btn-delete'></button>
            <button data-index='${i}' class='js-run btn-run'></button>
            <i data-tomato='${mission.getTomato()}' class='tomato'> &times; ${mission.getTomato()}</i>
        `;
        if(state === 'isDone'){
            li.querySelector('input').readOnly = true;
            ul_done.appendChild(li);
        }else{
            ul_todo.appendChild(li);
        }
    };
    ul_focus.querySelector('#today-tomato').innerHTML = ` &times; ${list.calcTomato()}`;
    ul_focus.querySelector('#week-tomato').innerHTML = ` &times; ${list.calcTomato() + weekTomato}`;
    ul_focus.querySelector('#today-mission').innerHTML = ` &times; ${list.calcIsDone()}`;
    ul_focus.querySelector('#week-mission').innerHTML = ` &times; ${list.calcIsDone() + weekMission}`;
}

// event listening
let selected_mission_index = null;
ul_todo.addEventListener('click',(e)=>{
    if(e.target.tagName != 'BUTTON'){
        return;
    }
    const index = e.target.dataset.index;
    const mission = list.getMission(index);
    if(e.target.className.includes('js-toggle')){
        mission.toggleState();
        return;
    }
    if(e.target.className.includes('js-run')){
        // mission.addTomato();
        selected_mission_index = index;
        ul_wrapper.classList.toggle('scroll-up');
        document.querySelector('#panel-time').classList.toggle('scroll-down');
        return;
    }
    if(e.target.className.includes('js-delete')){
        list.deleteMission(index);
        return;
    }
},false);
ul_todo.addEventListener('focus',(e)=>{
    if(e.target.tagName != 'INPUT'){
        return;
    }
    e.target.select();
},true)
ul_todo.addEventListener('blur',(e)=>{
    if(e.target.tagName != 'INPUT'){
        return;
    }
    const index = e.target.dataset.index;
    if(!index){
        return;
    }
    const title = e.target.value;
    if(title !== list.getMission(index).getTitle(index)){
        list.getMission(index).setTitle(title);
    }
},true)

const addBtn = document.querySelector('#js-add');
const toggleTodoBtn = document.querySelector('#js-toggleTodo');
const toggleDoneBtn = document.querySelector('#js-toggleDone');
addBtn.addEventListener('click',(e)=>{
    let input = document.querySelector('#js-newMission');
    let title = input.value;
    if (title === '') {title = undefined;}
    list.addMission(title);
    input.value = '';
    if (ul_todo.className.includes('hide')){
        ul_todo.classList.toggle('hide');
        toggleTodoBtn.classList.toggle('folder-open');
        toggleTodoBtn.classList.toggle('folder-close');
    }
},false);
toggleTodoBtn.addEventListener('click',(e)=>{
    ul_todo.classList.toggle('hide');
    toggleTodoBtn.classList.toggle('folder-open');
    toggleTodoBtn.classList.toggle('folder-close');
},false);
toggleDoneBtn.addEventListener('click',(e)=>{
    ul_done.classList.toggle('hide');
    toggleDoneBtn.classList.toggle('folder-open');
    toggleDoneBtn.classList.toggle('folder-close');
},false);

const toggleFocusTime = document.querySelector('.toggle-focusTime');
const analyseTomato = document.querySelector('.analyse-tomato');
const analyseMission = document.querySelector('.analyse-mission');
toggleFocusTime.addEventListener('click',(e)=>{
    needUpdate = true;
    analyseTomato.classList.toggle('hide');
    analyseMission.classList.toggle('hide');
},false);

// listen to 'needupdate'
render();
function render(t){
    if(clock.state.finished){
        list.getMission(selected_mission_index).addTomato();
        clock.state.finished = false;
    }
    if(needUpdate){
        list.reRangeList();
        updateStorage();
        updateChart();
        updateScreen();
        needUpdate = false;
    }
    window.requestAnimationFrame(render);
}