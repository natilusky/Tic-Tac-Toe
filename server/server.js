import express from "express";
import http from "http";
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from "socket.io";
import { checkWin, checkFinish } from './services/TicTacToeService.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

dotenv.config();
app.use(cors());
app.use(express.static("public"));

let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
let turn = "X";
const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    io.emit("update", board);
    socket.on("move", ({ row, col }) => {
        if (board[row][col] === "") {
            board[row][col] = turn;
            if (checkWin(turn, board)) {
                socket.emit("win", turn);
                board = [
                    ["", "", ""],
                    ["", "", ""],
                    ["", "", ""]
                ];
            } else if (checkFinish(board)) {
                board = [
                    ["", "", ""],
                    ["", "", ""],
                    ["", "", ""]
                ];
                socket.emit("update", board);
                console.log("The board has reset");
            }
            else {
                turn = turn === "X" ? "O" : "X";
                console.log('turn: ' + turn);
                socket.emit("change-player", turn); // Changed this line
            }
            io.emit("update", board);
        }
        console.log(board);
    });

    socket.on("reset", () => {
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        io.emit("update", board);
        console.log("The board has reset");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});