import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactHtmlParser from 'react-html-parser';

import { generateBoard } from './board.js';

function Square(props) {
    if (props.showAnwser) {
        return props.disabled ? (<input
            className="square"
            value={props.value}
            disabled
        />) : (<input
            style={{ color: '#d74242' }}
            className="square"
            value={props.value}
            disabled />)
    }

    if (props.disabled) {
        return <input
            className="square"
            value={props.value}
            disabled
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
            showAnwser={this.props.showAnwser}
            onChange={(num) => this.props.onChange(num, row, col)}
        />;
    }

    render() {
        const board = this.props.board;
        return (
            <div className='board'>
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
        const { board, rows, cols, boxes, anwser } = generateBoard();
        const lastNumbers = Array(board.length).fill(0).map(() => Array(9).fill(null));
        this.state = {
            history: [
                {
                    board,
                    rows,
                    cols,
                    boxes,
                    lastNumbers,
                }
            ],
            stepNumber: 0,
            status: '',
            solved: {
                diaplay: false,
                anwser,
            },
        }
    }

    handleChange = (num, row, col) => {

        let status;
        if (!/[1-9]/.test(num)) {
            status = `key ${styled(num.toUpperCase())} is pressed, expect key 1 to 9`;
            this.setState({ status });
            return;
        }

        let history = this.state.history;
        let current = history[history.length - 1];
        const boxIndex = Math.trunc(row / 3) * 3 + Math.trunc(col / 3);

        num = parseInt(num);

        if (current.rows[row].has(num)) {
            status = `cannot place ${styled(num)} in board row ${styled(row + 1)}`;
            this.setState({ status });
            return;
        } else if (current.cols[col].has(num)) {
            status = `cannot place ${styled(num)} in board column ${styled(col + 1)}`;
            this.setState({ status });
            return;
        } else if (current.boxes[boxIndex].has(num)) {
            status = `cannot place ${styled(num)} in board row ${styled(row + 1)}, column ${styled(col + 1)}`;
            this.setState({ status });
            return;
        }

        history = this.state.history.slice(0, this.state.stepNumber + 1);
        current = history[history.length - 1];
        const { board, rows, cols, boxes } = clone(current);
        let lastNumbers = current.lastNumbers.map(row => row.map(val => val));
        const lastNum = lastNumbers[col][row];
        if (lastNum) {
            rows[row].delete(lastNum);
            cols[col].delete(lastNum);
            boxes[boxIndex].delete(lastNum);
        }
        board[row][col] = num;
        rows[row].add(num);
        cols[col].add(num);
        boxes[boxIndex].add(num);
        lastNumbers[col][row] = num;
        this.setState({
            history: history.concat([{
                board,
                rows,
                cols,
                boxes,
                lastNumbers,
            }]),
            stepNumber: history.length,
            status: '',
        });
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            solved: { ...this.state.solved, display: false }
        });
    }

    handleClickNewBoard() {
        const { board, rows, cols, boxes, anwser } = generateBoard();
        const lastNumbers = Array(board.length).fill(0).map(() => Array(9).fill(null));
        this.setState({
            history: [
                {
                    board,
                    rows,
                    cols,
                    boxes,
                    lastNumbers
                }
            ],
            stepNumber: 0,
            status: '',
            solved: {
                diaplay: false,
                anwser,
            },
        });
    }

    handleClickShowAnswer() {
        const solved = this.state.solved;
        this.setState({ solved: { ...solved, display: true } })
    }

    render() {

        const status = this.state.status;
        const history = this.state.history;
        const solved = this.state.solved;
        const current = solved.display ? { board: solved.anwser, rows: null, cols: null, boxes: null } :
            history[this.state.stepNumber];

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
                        startBoard={this.state.history[0].board}
                        showAnwser={solved.display}
                        board={current.board}
                        rows={current.rows}
                        cols={current.cols}
                        boxes={current.boxes}
                        onChange={(num, row, col) => this.handleChange(num, row, col)}
                    />
                </div>
                <div className="game-info">
                    <div>Sudoku Game <span><button onClick={() => this.handleClickNewBoard()}>New board</button></span> <span><button onClick={() => this.handleClickShowAnswer()}>Show anwser</button></span></div>
                    <div>{ReactHtmlParser(status)}</div>
                    <ol>{moves}</ol>
                </div>
            </div>

        );
    }
}

// ========================================
// helper functions
const clone = (current) => {
    const board = current.board.map(row => row.map(val => val));
    const rows = current.rows.map(set => new Set(set));
    const cols = current.cols.map(set => new Set(set));
    const boxes = {};
    for (let _key in current.boxes) {
        boxes[_key] = new Set(current.boxes[_key]);
    }
    return { board, rows, cols, boxes };
}

const styled = (s) => `<strong style="color:#d74242">${s}</strong>`
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
