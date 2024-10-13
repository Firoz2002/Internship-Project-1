var users = {}

//Funtion to get users online in a room
function getUsers(arr){
    if(arr) {
        onlineUsers = []
        arr.forEach((onlineUser) => {
            onlineUsers.push(Object.values(onlineUser)[0])
        })
        return onlineUsers
    }
}

function getRoom(room, user, socket) {
    room = room.replace(" ", "");
    
    if(users[room]) {
        users[room].push(Object.values(user)[0]);
    } else {
        users[room] = [Object.values(user)[0]];
    }                    
  
    socket.join(room);
}

module.exports = {
    getUsers, 
    getRoom,
    users
};
