import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';

const CLIENT_ID = 'YQMUGUSOPVQ00HNH1O4TWU4PUQYF3WSASXHNUHO25KQDOFSC';
const CLIENT_SECRET = 'DBMGJPUFAHPPDJC4KQKYCFT32ZHOZ4K2DVNOM3ZNIH4MH13P';
const VERSION = '20180323';

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

		if(this.props.currentMarkerIndex !== prevProps.currentMarkerIndex) {
			this.setState({ currentMarker: this.state.markers[this.props.currentMarkerIndex],
							currentMarkerProps: this.state.markerProps[this.props.currentMarkerIndex]
							});
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
				pos: place.pos				
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

		let newProps = props;
		this.getPlaceInfo(props.pos)
			.then(placeInfo => {
				if(placeInfo) {
					newProps = {
						...props,
						fourSquareInfo: placeInfo
					};
				}
				
				this.setState({ currentMarker: marker,
						currentMarkerProps: newProps,
						infoWindowVisible: true});
			});	
	}

	getPlaceInfo(pos) {
		let venueID = '';
		let lat = pos.lat, lng = pos.lng;		

		return fetch(`https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}&ll=${lat},${lng}`)
		    .then(data => data.json())
		    .then(data => {
		    	venueID = data.response.venues[0].id;
		    	return this.getPlaceTip(venueID);
		    })
		    .catch(function(e) {
		        console.log("Four square error! " + e);
		        return null;
		    });	    
	}

	getPlaceTip = (venueID) => {
		return fetch(`https://api.foursquare.com/v2/venues/${venueID}/tips?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}`)
		    .then(data => data.json())
		    .then(data => {
		    	return data.response.tips.items[0];
		    })
		    .catch(function(e) {
		    	console.log("Tips error! " + e);
		    	return null;
		    });
	}

	getFourSquareHTML() {
		let displayHTML = '';
		let fourSquareInfo = this.state.currentMarkerProps.fourSquareInfo;
		
		// the current marker has four square info
		if(fourSquareInfo) {
			displayHTML = `<p>${fourSquareInfo.text}</p>
						<p>Tips provided by FourSquare</p>`;
		}

		return displayHTML;
	}

	render() {
		const currentProps = this.state.currentMarkerProps;

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
							{currentProps && 
							currentProps.name}
						</h3>
						{/*If there is no four square data available, then nothing is displayed */}
						{currentProps && currentProps.fourSquareInfo &&
							<div className="tips">
								<p>{currentProps.fourSquareInfo.text}</p>
								<p><a href={currentProps.fourSquareInfo.canonicalUrl}>See more info</a></p>
								<p>Tips provided by FourSquare</p>
							</div>
						}
					</div>

				</InfoWindow>

			</Map>
		);
	}
}

export default GoogleApiWrapper({apiKey: 'AIzaSyD5R-Qq9SoZ3Y4RmxD2xB7XDhaag-nKZ9s'})(GoogleMap)