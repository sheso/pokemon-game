import React, { Component } from 'react';

export default class InitSquare extends Component {
	constructor(props) {
		super();
	}

	render() {
		return(
			<div className="square initSquare" style={{
					backgroundImage: 'url(img/' + this.props.value + '.png)',
				}}>				
			</div>
		);
	}
}
