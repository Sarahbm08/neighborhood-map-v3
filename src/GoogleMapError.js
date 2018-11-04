import React, {Component} from 'react';

class GoogleMapError extends Component {
	render() {
		return (
			<div className='load-error'>
				<h3>Error Loading Google Map</h3>
				<p>
					Map could not be loaded. See Javascript console for more details.
				</p>				
			</div>
		);
	}
}

export default GoogleMapError