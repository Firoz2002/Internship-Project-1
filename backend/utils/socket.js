const {getUsers, users} = require("./getUsers");

function socket(io) {
    io.on('connection', (socket) => {
        
        socket.on('user-online', (data) => {

            var user = {};
            user[socket.id] = data.id;

            if(users[data.type] === "mentor" || user[data.type] === "both") {
                users["mentor"].push(user);
            }
            else {
                users["student"] = [user];
            }

            socket.join(data.type);
        });

        socket.on('doubt', (data) => {
            socket.broadcast.to("mentor").emit('doubt', data);
        });

        socket.on('calloff', () => {
            socket.broadcast.to("mentor").emit('calloff');
        })
    })
}

module.exports = socket;