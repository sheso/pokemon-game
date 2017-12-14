import React, { Component } from 'react';
import './App.css';
import Game from './Game';

import InitSquare from './InitSquare'
import MoveCounter from './MoveCounter'
import UndoButton from './UndoButton'
import GameBoard from './GameBoard'

class App extends Component {
  constructor() {
    super();
    this.game = new Game();
  }

  handleCellClick(x, y) {
    this.game.cellOnClick(x, y);
    this.forceUpdate();
  }

  handleUndoButtonClick() {
    this.game.undoButtonOnClick();
    this.forceUpdate();
  }

  render() {
    return (
      <div className="app">
        <div className="gameboard-container">
          <GameBoard value={this.game.boardValues} onCellClick={(x, y) => this.handleCellClick(x, y)} />
        </div>
        <div className="statebar">
          <InitSquare value={this.game.startCellValue} />
          <MoveCounter value={this.game.count} />
          <UndoButton disabled={!this.game.undoIsOn()} handleClick={() => {
            this.handleUndoButtonClick();
          }}/>
        </div>
      </div>
    );
  }
}

export default App;
