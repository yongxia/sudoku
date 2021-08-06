import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { generateBoard } from './board.js';

function Square(props) {
    if (props.disabled) {
        return <input
            className="square"
            value={props.value}
            disabled={props.disabled}
        />
    }

    return <input
        className="square"
        maxLength="1"
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        style={{ color: "blue" }}
    />
}

class Board extends React.Component {
    renderSquare(val, row, col) {
        const disabled = this.props.startBoard[row][col] !== '';
        return <Square
            key={`${row},${col}`}
            value={val}
            disabled={disabled}
            onChange={(num) => this.props.onChange(num, row, col)}
        />;
    }

    render() {
        const board = this.props.board;
        return (
            <div>
                {board.map((arr, row) => <div key={row} className="board-row">{
                    arr.map((val, col) => this.renderSquare(val, row, col))
                }</div>)}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);

        const { board: startBoard, rows, cols, boxes } = generateBoard();
        const board = startBoard.map(row => row.map(val => val));
        console.log(rows, cols, boxes)
        this.state = {
            startBoard,
            history: [
                {
                    board,
                    rows,
                    cols,
                    boxes
                }
            ],
            stepNumber: 0,
            status: '',
        }
    }

    handleChange = (num, row, col) => {
        if (!/[1-9]/.test(num)) {
            alert(`non numeric key "${num}" pressed, expect key 1 to 9`);
            return;
        }

        let r = Math.trunc(row / 3), c = Math.trunc(col / 3);
        let key = `${r},${c}`;
        let history = this.state.history;
        let current = history[history.length - 1];
        let status;
        if (current.rows[row].has(num)) {
            status = `${num} can not be placed in board row: ${row + 1}`;
            this.setState({ status });
            return;
        } else if (current.cols[col].has(num)) {
            status = `${num} can not be placed in board column: ${col + 1}`;
            this.setState({ status });
            return;
        } else if (current.boxes[key].has(num)) {
            status = `${num} can not be placed in board row: ${row + 1}, column: ${col + 1}`;
            this.setState({ status });
            return;
        }

        history = this.state.history.slice(0, this.state.stepNumber + 1);
        current = history[history.length - 1];

        const board = current.board.map(row => row.map(val => val));
        const rows = current.rows.map(set => new Set(set));
        const cols = current.cols.map(set => new Set(set));
        const boxes = {};
        for (key in current.boxes) {
            boxes[key] = new Set(current.boxes[key]);
        }

        board[row][col] = num;
        rows[row].add(num);
        cols[col].add(num);
        boxes[key].add(num);

        this.setState({
            history: history.concat([{
                board,
                rows,
                cols,
                boxes,
            }]),
            stepNumber: history.length,
            status: '',
        });

        console.log(row, col, board)
    }

    jumpTo(move) {
        this.setState({ stepNumber: move });
    }

    render() {

        const status = this.state.status;
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        startBoard={this.state.startBoard}
                        board={current.board}
                        rows={current.rows}
                        cols={current.cols}
                        boxes={current.boxes}
                        onChange={(num, row, col) => this.handleChange(num, row, col)}
                    />
                </div>
                <div className="game-info">
                    <div>Sudoku Game</div>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
