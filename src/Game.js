import clone from 'clone';
import seedrandom from 'seedrandom';

export default class Game {
	constructor() {
		this.side = 6;
		this.state = {
			boardValues: new Array(this.side).fill(0).map(arr => new Array(this.side).fill(0)),
			count: 0,
			startCell: null,
			curSeed: true,
		};
		this.prevState = null;
		this.state.startCell = this._generateFigure();
	}

	get boardValues() {
		return this.state.boardValues;
	}

	get count() {
		return this.state.count;
	}

	get startCellValue() {
		return this.state.startCell;
	}

	_generateFigure() {
		var generator = new Math.seedrandom('', {state: this.state.curSeed});
		var r = generator();
		var newFigure;
		if (r < 0.09)
			newFigure = 2;
		else if (r >= 0.09 && r < 0.115)
			newFigure = 3;
		else if (r >= 0.115 && r < 0.14)
			newFigure = 4;
		else if (r >= 0.14 && r < 1)
			newFigure = 1;

		this.state.curSeed = generator.state();
		return newFigure;
	}

	cellOnClick(x, y) {
		if (this.boardValues[y][x])
			return;
		else {
			this.prevState = clone(this.state);
			this._setFigure(x, y, this.startCellValue);
			this.state.startCell = this._generateFigure();
			this._refreshCellAfterTurn(x, y);
			this.state.count++;
		}
	}

	undoButtonOnClick() {
		this.state = clone(this.prevState);
		this.prevState = null;
	}

	undoIsOn() {
		return this.prevState !== null;
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

	isGameOver() {
  	return this.boardValues.every(row => row.every(val => val));
  }
}
