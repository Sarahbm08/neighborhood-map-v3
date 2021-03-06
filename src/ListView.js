import React, { Component } from 'react';
import './App.css';

class ListView extends Component {
	
	render() {
		return (
			<div className='list-view'>

				<input
					className='filter-input'
					type='text'
					placeholder='Filter places below'
					name='filter'
					onChange={e => this.props.updateQuery(e.target.value)}
					tabIndex='2'
				/>

				<ul	>
					{this.props.myPlaces && 
					this.props.myPlaces.map( (place, index) => (
						<li key={index}>
							<button onClick={e => this.props.clickListItem(e, index)}>
								{place.name}
							</button>
						</li>
					))}
				</ul>

			</div>
		);
	}
}

export default ListView