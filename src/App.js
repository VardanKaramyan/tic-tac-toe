import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  const className = "square" + (isWinningSquare ? " winning" : "");
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}



 function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = [...squares];
    if (xIsNext) {
    nextSquares[i] = "X";
    } else {
    nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winningLine = calculateWinner(squares)?.line;
  const winner = calculateWinner(squares)
  let status;
  if (winner) {
    status = `Winner: ${winner.symbol}`;
  } else if (squares.every((square) => square !== null)) {
    status = "Draw";
  } else {
    status = `Next Player: ${(xIsNext ? "X" : "O")}`;
  }

  const rows = [0, 1, 2];
  const cols = [0, 1, 2];

  return (
    <>
      <div className="status">{status}</div>
      {rows.map((row) => (
        <div className="board-row" key={row}>
          {cols.map((col) => {
            const i = row * 3 + col;
            return (
              <Square
                key={col}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                isWinningSquare={winningLine?.includes(i)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true); // added state variable
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length -1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const [prevRow, prevCol] = getSquareCoords(history[move - 1], squares);
      description = `Go to Move #${move} (${prevCol}, ${prevRow})`;
    } else {
      description = `Go to Game Start`;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  function getSquareCoords(prevSquares, nextSquares) {
    const i = nextSquares.findIndex((square, i) => square !== prevSquares[i]);
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    return [row, col];
  }
  

  const sortedMoves = sortAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={() => window.location.reload()}>REFRESH THE PAGE</button>
        </div>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6] // diagonal
  ];

  for (const line of winningLines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { symbol: squares[a], line };
    }
  }
  return null;
}
