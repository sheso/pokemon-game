import React, { Component } from 'react';

export default class GameBoard extends Component {


	render() {
		return (
			<table className="gameboard">
				<tbody>
					{this.props.value.map((row, rowI) => (
						<tr key={rowI}>
							{row.map((cell, cellI) => (
								<td
									key={cellI}
									onClick={() => this.props.onCellClick(cellI, rowI)}
									style={{
										backgroundImage: 'url(img/' + cell + '.png)',
									}}
								>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		);
	}
}
