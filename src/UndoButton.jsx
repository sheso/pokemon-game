import React, { Component } from 'react';

export default class UndoButton extends Component {
	render() {
		return (
			<button className="button" id="undobutton" onClick={this.props.handleClick}>
				Undo
			</button>
		);
	}
}