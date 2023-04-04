import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const TicTacToe = () => {
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);

  const socket = io('http://localhost:3001');

  useEffect(() => {

    socket.on('change-player', player => {
      console.log('change-playe');
      setTurn(player);
    });

    socket.on('win', data => {
      console.log('win')
      console.log(data);;
      setWinner(data);
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleClick = (row, col) => {
    if (board[row][col] === '' && !winner) {
      const newBoard = [...board];
      newBoard[row][col] = turn;
      setBoard(newBoard);
      
      console.log(row, col);
      socket.emit('move', { row, col });

      if (winner) {
        setWinner(turn);
      } else {
        setTurn(turn === 'X' ? 'O' : 'X');
      }
    }
  };

  const handleReset = () => {
    socket.emit('reset');
  };



  return (
    <div>
      <h1>Tic Tac Toe</h1>
      {winner && <h2>{winner} wins!</h2>}
      <table>
        <tbody>
          {board.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  onClick={() => handleClick(i, j)}
                  style={{ border: '1px solid black', padding: '10px' }}
                >
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
