export const generateBoard = () => {
    const board = [
        ["5", "3", "", "", "7", "", "", "", ""],
        ["6", "", "", "1", "9", "5", "", "", ""],
        ["", "9", "8", "", "", "", "", "6", ""],
        ["8", "", "", "", "6", "", "", "", "3"],
        ["4", "", "", "8", "", "3", "", "", "1"],
        ["7", "", "", "", "2", "", "", "", "6"],
        ["", "6", "", "", "", "", "2", "8", ""],
        ["", "", "", "4", "1", "9", "", "", "5"],
        ["", "", "", "", "8", "", "", "7", "9"]
    ];

    // initialize row sets, col sets and box sets
    const rows = board.map(row => new Set(row));
    let cols = [];
    for (let col = 0; col < board.length; col++) {
        const set = new Set();
        for (let row = 0; row < board.length; row++) {
            set.add(board[row][col]);
        }
        cols.push(set);
    }
    let boxes = {};
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            const boxIndex = Math.trunc(row / 3) * 3 + Math.trunc(col / 3);
            if (!(boxIndex in boxes)) {
                boxes[boxIndex] = new Set();
            }
            boxes[boxIndex].add(board[row][col]);
        }
    }

    return { board, rows, cols, boxes };

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

