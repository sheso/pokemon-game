import React, { Component } from 'react';

export default class MoveCounter extends Component {
	render() {
		return (
			<div className="square movecounter">
				<div className="movecounter-number">
					{this.props.value}
				</div>
				<div className="movecounter-text">
					ходов
				</div>
			</div>
		);
	}
}