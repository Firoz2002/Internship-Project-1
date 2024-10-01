const {getUsers, getRoom} = require("./getUsers");

function socket(io) {
    io.on('connection', (socket) => {

        socket.on('user-online', (data) => {
            var user = {};
            user[socket.id] = data.id;

            if(data.type === "mentor" || data.type === "both") {
                getRoom("mentor", user, socket);

                const skillSet = JSON.parse(data.skillSet);
                skillSet.forEach(skill => {
                    getRoom(skill, user, socket);
                });
            }
            else {
                getRoom("student", user, socket);
            }
        });

        socket.on('doubt', (data) => {
            const topic = data.topic.replace(" ", "");
            socket.broadcast.to(topic).emit('doubt', data);
        });

        socket.on('calloff', (data) => {
            socket.broadcast.to("mentor").emit('calloff', data);
        })
    })
}

module.exports = socket;