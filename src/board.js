function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const generateBoard = () => {
    const N = 9;
    let board = Array(N).fill(0).map(() => Array(N).fill(''));
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    //Fill all the diagonal 3x3 matrices
    for (let d = 0; d < N; d += 3) {
        shuffleArray(nums);
        let k = 0;
        for (let i = d; i < d + 3; i++) {
            for (let j = d; j < d + 3; j++) {
                board[i][j] = nums[k];
                k++;
            }
        }
    }

    const rows = board.map(row => new Set(row));
    const cols = [];
    for (let col = 0; col < board.length; col++) {
        const set = new Set();
        for (let row = 0; row < board.length; row++) {
            set.add(board[row][col]);
        }
        cols.push(set);
    }
    const boxes = {};
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            const boxIndex = Math.trunc(row / 3) * 3 + Math.trunc(col / 3);
            if (!(boxIndex in boxes)) {
                boxes[boxIndex] = new Set();
            }
            boxes[boxIndex].add(board[row][col]);
        }
    }

    const anwser = solve({ board, rows, cols, boxes });
    board = anwser.map(row => row.map(val => val));

    //remove elements
    const K = 4;
    let i = 0, j = 0;
    while (i < N && j < N) {
        const step = Math.floor(Math.random() * K);
        j += step;
        if (j >= N) {
            j = 0;
            i++;
            if (i >= N) break;
        }
        const num = board[i][j];
        board[i][j] = '';
        rows[i].delete(num);
        cols[j].delete(num);
        const boxIndex = Math.trunc(i / 3) * 3 + Math.trunc(j / 3);
        boxes[boxIndex].delete(num);
    }

    return { board, rows, cols, boxes, anwser };
}


export const solve = ({ board, rows, cols, boxes }) => {

    const N = board.length;

    const backtrack = (i, j) => {
        if (i === N - 1 && j === N) {
            return true
        } else if (j === N) {
            j = 0;
            i++;
        }
        // current grid is filled
        if (board[i][j] !== '') return backtrack(i, j + 1);
        const boxIndex = Math.trunc(i / 3) * 3 + Math.trunc(j / 3);
        for (let n = 1; n <= 9; n++) {
            if (!rows[i].has(n) && !cols[j].has(n) && !boxes[boxIndex].has(n)) {
                board[i][j] = n;
                rows[i].add(n);
                cols[j].add(n);
                boxes[boxIndex].add(n);
                if (backtrack(i, j + 1)) return true;
                board[i][j] = '';
                rows[i].delete(n);
                cols[j].delete(n);
                boxes[boxIndex].delete(n);
            }
        }
        return false;
    }

    backtrack(0, 0);
    return board;
}
