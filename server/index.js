const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoDb = require("./database/db")();
const UsersTable = require("./model/Users");
const TodosTable = require("./model/Todo");

const PORT = 5000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
let onlineUsers = {};
let online = 0;
io.on('connection', (socket) => {
    if (typeof onlineUsers[socket.id] === 'undefined') {
        onlineUsers[socket.id] = true;
        online++;
        socket.emit("online_users", online);
    }
    socket.on('login', async (data) => {
        try {
            let user = await UsersTable.find({
                email: data.email,
                password: data.password
            });
            let response = {};
            if (!user.length) {
                response.status = "error";
                response.message = "No such a user found or password is not correct!";
                socket.emit('userLogedIn', response);
            } else {
                socket.emit('userLogedIn', user[0]);
            }
        } catch (error) {

        }
    })

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        online--;
        socket.emit("online_users", online);
    });
})

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));
app.use(express.json());

app.post('/todos', (req, res) => {
    let body = req.body;
    TodosTable
        .find({ users_id: body.users_id })
        .then(data => res.json(data))
        .catch(err => res.json(err));
})

app.post('/deleteTodo', async (req, res) => {
    let body = req.body;
    await TodosTable.findByIdAndDelete({ _id: body.todo_id });
    let response = { status: 200, message: '' };
    res.send(response);
})

app.post('/createUser', async (req, res) => {
    let body = req.body;
    let response = { status: 200, message: '' };
    if (typeof body.email === 'undefined') {
        response.status = 400;
        response.message = "Request is not correct!";
        res.send(response);
    } else {
        let data = body;
        let user = await UsersTable.find({
            email: data.email
        });
        if (user.length) {
            response.status = 400;
            response.message = "E-mail already exist!";
            res.send(response);
        } else {
            let result = await new UsersTable(data).save();
            response.status = 200;
            response.message = "User created!";
            res.send(response);
        }
    }
})

app.post('/createTask', async (req, res) => {
    let body = req.body;
    let response = { status: 200, message: '', data: {} };
    if (typeof body.users_id === 'undefined') {
        response.status = 400;
        response.message = "User is not found!";
        res.send(response);
    } else {
        if (typeof body.todo_id !== 'undefined') {

        } else {
            // console.log(body);
            // return false;
            let result = await new TodosTable(body).save();
            console.log(result);
            response.status = 200;
            response.message = "Todo added!";
            res.send(response);
        }
    }

})

server.listen(PORT, () => {
    console.log('Server is working!');
})