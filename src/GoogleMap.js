import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';

class GoogleMap extends Component {
	state = {
		map: null,
		markers: [],
		markerProps: [],
		currentMarker: null,
		currentMarkerProps: null,
		infoWindowVisible: false
	}

	mapIsReady = (props, map) => {
		this.setState({map});
		this.updateMarkers(this.props.myPlaces);
	}

	componentDidUpdate(prevProps) {
		// our places have changed, so we need to update the markers
		if (this.props.myPlaces.length !== prevProps.myPlaces.length) {
			this.updateMarkers(this.props.myPlaces);
		}
	}

	updateMarkers(myPlaces) {
		//if there are no places to show, then we're done
		if(!myPlaces)
			return;

		this.removeAllMarkers();

		let markerProps = [];
		let markers = myPlaces.map( (place, index) => {
			let marker = new this.props.google.maps.Marker({
				position: place.pos,
				map: this.state.map
			});

			let props = {
				key: index,
				name: place.name,
				pos: place.pos,
				city: place.city
			};
			markerProps.push(props);

			marker.addListener('click', () => {
				this.onMarkerClick(props, marker, null);
			});

			return marker;
		});

		this.setState({markers, markerProps});
	}

	removeAllMarkers() {
		this.state.markers.forEach( (marker) => marker.setMap(null));
	}

	closeInfoWindow = () => {
		this.setState({ currentMarker: null,
						currentMarkerProps: null,
						infoWindowVisible: false});
	}

	onMarkerClick(props, marker, e) {
		this.closeInfoWindow();

		this.setState({ currentMarker: marker,
						currentMarkerProps: props,
						infoWindowVisible: true});
	}

	render() {
		return (
			<Map
				role="application"
				aria-label="map"
				onReady={this.mapIsReady}
				google={this.props.google}
				zoom={this.props.zoom}
				initialCenter={this.props.center}
				className="map">

				{/*this.state.markers.map((place, index) => (			    
				<Marker 
					title={place.name + ' in ' + place.city}
					name={place.name}
					position={place.pos}
					onClick={this.onMarkerClick}
					key={index}
				/>
				))*/}
				<InfoWindow 
					onClose={this.closeInfoWindow}
					marker={this.state.currentMarker}
					visible={this.state.infoWindowVisible}>

					<div>
						<h3>
							{this.state.currentMarkerProps && 
							this.state.currentMarkerProps.name + ' in ' + 
							this.state.currentMarkerProps.city}
						</h3>
					</div>

				</InfoWindow>

			</Map>
		);
	}
}

export default GoogleApiWrapper({apiKey: 'AIzaSyD5R-Qq9SoZ3Y4RmxD2xB7XDhaag-nKZ9s'})(GoogleMap)