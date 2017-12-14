window.onload = function() {
    ourTable = new Table(6, "gameBoard");
    var startCell = document.getElementById("startCell");
    var moveCounter = document.getElementById("moveCounter");
    for (i = 0; i < ourTable.cells.length; i++) {
        ourTable.cells[i].addEventListener("click", cellOnClick);
    }
    // moveCounter.innerHTML = ourTable.moveCounter;
    setFigure(startCell, generateFigure());

}

function cellOnClick() {
    if (this.sdFigureId)
        alert("Не надо так");
    else {
        setFigure(this, startCell.sdFigureId);
        setFigure(startCell, generateFigure());
        ourTable.refreshCellAfterTurn(this.xAxis, this.yAxis);
        ourTable.moveCounter++;
        moveCounter.innerHTML = ourTable.moveCounter;
        if (ourTable.endOfGameCheck())
            console.log("Игра окончена! Сделано " + ourTable.moveCounter + " ходов.");
    }
}

function setFigure(cell, fId) {
    cell.sdFigureId = fId;
    if (cell.sdFigureId) {
        cell.style.backgroundImage = "url('Images/" + fId + ".png')";
    } else {
        cell.style.backgroundImage = "";
    }
}

// определяет, какая фигура появится в стартовой клетке
// с помощью генератора случайных чисел
function generateFigure() {
    var r = Math.random();
    var newFigure;
    if (r < 0.09)
        newFigure = 2;
    else if (r >= 0.09 && r < 0.115)
        newFigure = 3;
    else if (r >= 0.115 && r < 0.14)
        newFigure = 4;
    else if (r >= 0.14 && r < 1)
        newFigure = 1;
    return newFigure;
}

function testXYAlert() {
    alert (this.xAxis + " " + this.yAxis);
}

class Table {
    constructor(squareSize, tableId) {
        var table = document.createElement("table");
        document.body.appendChild(table);
        table.id = tableId;
        this.cells = [];
        for (var i = 0; i < squareSize; ++i) {
            var tr = document.createElement("tr");
            tr.yAxis = i;
            table.appendChild(tr);
            for (var j = 0; j < squareSize; ++j) {
                var td = document.createElement("td");
                td.xAxis = j;
                td.yAxis = i;
                tr.appendChild(td);
                this.cells.push(td);
            }
        }
        this.table = table;
        this.squareSize = squareSize;
        this.moveCounter = 0;
    }

    getCell(x, y) {
        if (0 <= x && x <= 5 && 0 <= y && y <= 5) {
            var i = x + this.squareSize * y;
            return this.cells[i];
        }
    }

    refreshCellAfterTurn(x, y) {
        var baseCell = this.getCell(x, y);
        var baseCellFigureId = baseCell.sdFigureId;
        var xYCellMap = {};

        var self = this;

        function checkSideCells(cell) {
            var baseFigureId = cell.sdFigureId;
            var sideCells = self.getSideCells(cell);
            var sameFigureCells = [];
            for (let elem of sideCells) {
                if (elem.sdFigureId == baseFigureId) {
                    let xYKey = "x" + elem.xAxis + "y" + elem.yAxis;
                    if (!(xYKey in xYCellMap)) {
                        xYCellMap[xYKey] = elem;
                        sameFigureCells.push(elem);
                    }
                }
            }

            for (let elem of sameFigureCells) {
                console.log(elem);
                checkSideCells(elem);
            }
        }  

        function clearSameFigureCells(cellMap) {
            for (let key in cellMap) {
                if (cellMap.hasOwnProperty(key)) {
                    var cell = cellMap[key];
                    setFigure(cell, undefined);
                }
            }
        }

        checkSideCells(baseCell);
        console.log(xYCellMap);
        if (Object.keys(xYCellMap).length >= 3) {
            clearSameFigureCells(xYCellMap);
            setFigure(baseCell, baseCellFigureId + 1);
            this.refreshCellAfterTurn(x, y);
        }
    }

    getSideCells(cell) {
        var x = cell.xAxis;
        var y = cell.yAxis;
        var sideCellsCoords = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        var sideCells = [];
        for (i = 0; i < sideCellsCoords.length; i++) {
            var a = this.getCell(sideCellsCoords[i][0], sideCellsCoords[i][1]);
            if (a) {
                sideCells.push(a);
            }
        }
        return sideCells;
    }

    endOfGameCheck() {
        return this.cells.every(elem => elem.sdFigureId);         
    }
}
