const cors = require('cors');
const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const connect = require("./config/database");
//const client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});

require('dotenv').config();
const port = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(require("./routes/index"));

const server = app.listen(port, async () => {
    try {
        await connect();
        console.log('Mongodb connected');
        console.log(`Server Running on PORT: ${port}`);
    } catch (error) {
        console.error(error);
    }
});

const io = socket(server, {
    cors: {
        origin: process.env.REACT_APP_URL
    }
});

require("./utils/socket")(io);