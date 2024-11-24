import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

interface User {
    socket: WebSocket;
    room: string;
}
let allSockets: User[] = [];

wss.on('connection', function connection(ws) {
   
    ws.on('message',(message)=>{
      const parsedMessage = JSON.parse(message as unknown as string);

      if(parsedMessage.type === 'join') {
        console.log('user joined room' + parsedMessage.payload.roomId)
        allSockets.push({
            socket: ws,
            room: parsedMessage.payload.roomId
        })
      }

      if(parsedMessage.type === 'chat') {
        console.log('user wants to chat')
        const currentSocketRoom = allSockets.find(x=> x.socket === ws)?.room;

        allSockets.forEach(({socket,room})=>{
            if(room === currentSocketRoom) {
                socket.send(parsedMessage.payload.message);
            }
        })

      }
    })


});


