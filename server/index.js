// const express = require('express');
// const socketio = require('socket.io');
// const cors = require('cors');

// const PORT = process.env.PORT || 5000;

// const router = require('./router');

// const app = express();
// const server = require('http').Server(app)
// const io = require("socket.io")(server)

// app.use(router);

// app.use(cors({origin: '*'}));

// // , {
// //   //origins: ["http://localhost:3000"],

// //   handlePreflightRequest: (req, res) => {
// //     // res.writeHead(200, {
// //     //   "Access-Control-Allow-Origin": "*",
// //     //   "Access-Control-Allow-Methods": "*",
// //     //   "Access-Control-Allow-Credentials": true,
// //     //   "Access-Control-Allow-Headers" : "*"
// //     // });
// //     res.setHeader("Access-Control-Allow-Origin", "*"); 
// //     res.setHeader('Access-Control-Allow-Methods', '*'); 
// //     res.setHeader("Access-Control-Allow-Headers", "*"); 
// //     res.setHeader("Access-Control-Allow-Credentials": true);
// //     res.end();
// //   }
// // });


// // const io = require("socket.io")(server, {
// //   cors: {
// //     origin: "http://localhost:3000",
// //     methods: ["GET", "POST"]
// //   }
// // });

// // Add headers
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', '*');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', '*');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });


const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  socket.on('join', ({name, room}, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room});

    if(error) return callback(error);
    
    console.log("New Connection added ---",name, room);
    //console.log(name, room);

    socket.emit('message', { user: 'Jarvis', text: `${user.name}, welcome to room ${user.room}`} )

    socket.broadcast.to(user.room).emit('message', {user: 'Jarvis', text: `${user.name} has joined :D`})

    socket.join(user.room); ///name of room to join

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

    socket.to(user.room).emit('user-connected', userId) //new event created to broadcast //send mssg TO the current room users other than me

    callback();
  });



  socket.on('sendMessage', (messageFromBox, callback)=> {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: messageFromBox})
    callback();
  })

  socket.on('disconnect' ,()=> {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message',{user: 'Jarvis', text: `${user.name} has left :(`})
      
      io.to(user.room).emit('user-disconnected', user.name) 

      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})
    
    }
    console.log("User left!!!");
  })
});


server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));