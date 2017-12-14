import clone from 'clone';

export default class Game {
	constructor() {
		this.side = 6;
		this.startCellValue = this._generateFigure(); 
		this.boardValues = new Array(this.side).fill(0).map(arr => new Array(this.side).fill(0));
		this.count = 0;
		this.prevBoardValues = new Array(this.side).fill(0).map(arr => new Array(this.side).fill(0));
		this.prevStartCellValue = this.startCellValue;
	}

	_generateFigure() {
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

	cellOnClick(x, y) {
		if (this.boardValues[y][x])
			return;
		else {
			this.prevBoardValues = clone(this.boardValues);
			this.prevStartCellValue = clone(this.startCellValue);
			this._setFigure(x, y, this.startCellValue);
			this.startCellValue = this._generateFigure();
			this._refreshCellAfterTurn(x, y);
			this.count++;
			if (this.endOfGameCheck())
				console.log("Игра окончена! Сделано " + this.count + " ходов.");
		}
	}

	undoButtonOnClick() {
		this.boardValues = clone(this.prevBoardValues);
		this.startCellValue = clone(this.prevStartCellValue);
		this.count--;
	}

	_setFigure(x, y, fId) {
		this.boardValues[y][x] = fId;
	}

	_getFigure(x, y) {
		return this.boardValues[y][x];
	}

	_refreshCellAfterTurn(x, y) {
		var baseCell = this._getFigure(x, y);
		var xYCellMap = {};

		var checkSideCells = (x, y) => {
			var baseValue = this._getFigure(x, y);
			var sideCells = this.getSideCells(x, y);
			var sameValueCells = [];
			for (let elem of sideCells) {
				let [sideX, sideY] = elem;
				if (this._getFigure(sideX, sideY) === baseValue) {
					let xYKey = "x" + sideX + "y" + sideY;
					if (!(xYKey in xYCellMap)) {
						xYCellMap[xYKey] = elem;
						sameValueCells.push(elem);
					}
				}
			}

			for (let [elemX, elemY] of sameValueCells) {
				checkSideCells(elemX, elemY);
			}
		};  

		var clearSameFigureCells = cellMap => {
			for (let key in cellMap) {
				if (cellMap.hasOwnProperty(key)) {
					var [cellX, cellY] = cellMap[key];
					this._setFigure(cellX, cellY, 0);
				}
			}
		}

		checkSideCells(x, y);
		if (Object.keys(xYCellMap).length >= 3) {
			clearSameFigureCells(xYCellMap);
			this._setFigure(x, y, baseCell + 1);
			this._refreshCellAfterTurn(x, y);
		}
	}

	getSideCells(x, y) {
	  var sideCellsCoords = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
	  return sideCellsCoords.filter(([x, y]) => this.cellIsValid(x, y));
  }

  cellIsValid(x, y) {
    return 0 <= x && x <= this.side - 1 && 0 <= y && y <= this.side - 1;
	}

	endOfGameCheck() {
  	return this.boardValues.every(row => row.every(val => val));
  }
}

var testGame = new Game();
testGame.cellOnClick(0, 0);
testGame.cellOnClick(0, 1);
testGame.cellOnClick(0, 2);
console.log(testGame.boardValues);
