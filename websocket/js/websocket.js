const YOUR_CHANNEL_ID = 'bubblecigar';
const YOUR_ROOM_ID = '1';

let listener, speaker;
let openedSocket = 0;

{
    speaker = new WebSocket(`wss://connect.websocket.in/${YOUR_CHANNEL_ID}?room_id=${YOUR_ROOM_ID}`);


    speaker.onopen = e => {
        console.log('speaker open')
        openedSocket++;
        if (openedSocket >= 2) {
            resolver(true);
        }
    }
    speaker.onclose = e => {
        console.log('speaker close')
    }
}
let receivedData; {
    listener = new WebSocket(`wss://connect.websocket.in/${YOUR_CHANNEL_ID}?room_id=${YOUR_ROOM_ID}`);


    listener.onopen = e => {
        console.log('listener open')
        openedSocket++;
        if (openedSocket >= 2) {
            resolver(true);
        }
    }
    listener.onclose = e => {
        console.log('listener close')
    }
    listener.onmessage = e => {
        console.log('listen:')
        appendImg(e.data);

        function appendImg(dataURL) {
            const img = document.createElement('img');
            document.querySelector('body').appendChild(img);
            img.src = dataURL;
        }
    }
}


let resolver, rejector;
const promise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejector = reject;
}).then(res => {
    speaker.send(blob)

}).catch(err => {
    console.log(err);
})


// constructing blob
const blob = new Blob(['lalala blob'], {
    type: 'text/plain'
})

// reader
const reader = new FileReader();

// input file
const input = document.querySelector('input');
let file = undefined;
let dataURL;
input.onchange = e => {
    file = e.target.files[0]

    reader.onload = e => {
        dataURL = e.target.result;
        speaker.send(dataURL)
    }
    reader.readAsDataURL(file);
}