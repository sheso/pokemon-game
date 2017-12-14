import React, { Component } from 'react';

export default class UndoButton extends Component {
	render() {
		return (
			<button className="button" onClick={this.props.handleClick} disabled={this.props.disabled}>
				Undo
			</button>
		);
	}
}