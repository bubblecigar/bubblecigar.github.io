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
                tomato += el.getTomato();
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
        }
    }
}
const list = createList();

// load & save data with store.js
let today;
{
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    today = `${year}-${month}-${day}`;
}

loadFromStorage();
function loadFromStorage(key = `tomatoClock`,timeKey = today){
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
}
function updateStorage(key = `tomatoClock`,timeKey = today){
    const storage = store.get(key);
    storage[timeKey] = [...list.getStaticData()];
    store.set(key,storage);
}

// update user interface according to list
const ul_todo = document.querySelector('#js-todo');
const ul_done = document.querySelector('#js-done');
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
        state === 'isDone' ? ul_done.appendChild(li) : ul_todo.appendChild(li);
    }
}

// event listening
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
        mission.addTomato();
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
addBtn.addEventListener('click',(e)=>{
    let input = document.querySelector('#js-newMission');
    let title = input.value;
    if (title === '') {title = undefined;}
    list.addMission(title);
    input.value = '';
},false);

const toggleTodoBtn = document.querySelector('#js-toggleTodo');
const toggleDoneBtn = document.querySelector('#js-toggleDone');
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

// listen to 'needupdate'
render();
function render(t){
    if(needUpdate){
        list.reRangeList();
        updateScreen();
        updateStorage();
        needUpdate = false;
    }
    window.requestAnimationFrame(render);
}