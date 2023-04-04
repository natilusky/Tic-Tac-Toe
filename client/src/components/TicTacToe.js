import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const TicTacToe = () => {
    const [board, setBoard] = useState([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]);
    const [turn, setTurn] = useState("X");
    const [winner, setWinner] = useState(null);
    const [tie, setTie] = useState(false);

    const socket = io("http://localhost:3001");

    useEffect(() => {
        socket.on("update", (data) => {
            setBoard(data);
        });

        socket.on("win", (data) => {
            setWinner(data);
        });

        socket.on("tie", () => {
            setTie(true);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    const handleClick = (row, col) => {
        if (board[row][col] === "" && !winner && !tie) {
            const newBoard = [...board];
            newBoard[row][col] = turn;
            setBoard(newBoard);

            socket.emit("move", { row, col });

            if (checkWin(turn)) {
                setWinner(turn);
            } else if (checkTie()) {
                setTie(true);
            } else {
                setTurn(turn === "X" ? "O" : "X");
            }
        }
    };

    const handleReset = () => {
        socket.emit("reset");
    };

    const checkWin = (player) => {
        // ...
    };

    const checkTie = () => {
        // ...
    };

    return (
        <div>
            <h1>Tic Tac Toe</h1>
            {winner && <h2>{winner} wins!</h2>}
            {tie && <h2>It's a tie!</h2>}
            <table>
                <tbody>
                    {
                    board.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j} onClick={() => handleClick(i, j)}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleReset}>Reset</button>
        </div>
    );
};

export default TicTacToe;
