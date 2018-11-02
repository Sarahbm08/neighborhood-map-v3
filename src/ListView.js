import React, { Component } from 'react';
import './App.css';

class ListView extends Component {
	state = {
		query: ''
	}

	updateQuery(newValue) {
		this.setState({ query: newValue });
	}

	render() {
		return (
			<div className='list-view'>
				<div className='list-title'>Sarah's Places</div>

				<input
					className='filter-input'
					type='text'
					placeholder='Filter places below'
					name='filter'
					onChange={e => this.updateQuery(e.target.value)}
					value={this.state.query}
				/>

				<ul>
					{this.props.myPlaces.map( (place) => (
						<li><button>{place.name}</button></li>
					))}
				</ul>

			</div>
		);
	}
}

export default ListView