export const generateBoard = () => {
    const board = [
        ["5", "3", '', '', "7", '', '', '', ''],
        ["6", '', '', "1", "9", "5", '', '', ''],
        ['', "9", "8", '', '', '', '', "6", ''],
        ["8", '', '', '', "6", '', '', '', "3"],
        ["4", '', '', "8", '', "3", '', '', "1"],
        ["7", '', '', '', "2", '', '', '', "6"],
        ['', "6", '', '', '', '', "2", "8", ''],
        ['', '', '', "4", "1", "9", '', '', "5"],
        ['', '', '', '', "8", '', '', "7", "9"]
    ];

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
            let r = Math.trunc(row / 3), c = Math.trunc(col / 3);
            let index = `${r},${c}`;
            if (!(index in boxes)) {
                boxes[index] = new Set();
            }
            boxes[index].add(board[row][col]);
        }
    }

    return { board, rows, cols, boxes };

}

