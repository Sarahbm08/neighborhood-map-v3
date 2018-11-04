import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import GoogleMapError from './GoogleMapError'

// necessary IDs to access the Foursquare API
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
		infoWindowVisible: false,
		loadError: false
	}

	componentDidMount() {
		window.gm_authFailure = () => {
			this.setState({ loadError: true });
		}
	}

	mapIsReady = (props, map) => {
		this.setState({ map });
		this.updateMarkers(this.props.myPlaces);
	}

	componentDidUpdate(prevProps) {
		// our places have changed, so we need to update the markers
		if (this.props.myPlaces.length !== prevProps.myPlaces.length) {
			this.updateMarkers(this.props.myPlaces);
		}

		if(this.props.currentMarkerIndex !== prevProps.currentMarkerIndex) {			
			this.onMarkerClick(this.state.markerProps[this.props.currentMarkerIndex], this.state.markers[this.props.currentMarkerIndex], null);
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
		this.setMarkerBounce(false);
		this.setState({ currentMarker: null,
						currentMarkerProps: null,
						currentMarkerIndex: -1,
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
						currentMarkerIndex: newProps.key,
						infoWindowVisible: true});
				this.setMarkerBounce(true);			
			});	
	}

	setMarkerBounce(bouncing) {
		const currentMarker = this.state.currentMarker;
		// only make animation if a marker is currently selected
		if(currentMarker) {			
			if (bouncing) {
				currentMarker.setAnimation(this.props.google.maps.Animation.BOUNCE);
			}
			else {
				currentMarker.setAnimation(null);
			}
		}
	}

	// get information from foursquare of the place at the given position
	getPlaceInfo(pos) {
		let venueID = '';
		let lat = pos.lat, lng = pos.lng;		

		//this fetch's purpose is to find the venueID of the given position
		return fetch(`https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}&ll=${lat},${lng}`)
		    .then(data => data.json())
		    .then(data => {
		    	venueID = data.response.venues[0].id;
		    	return this.getPlaceTip(venueID);
		    })
		    .catch(function(e) {
		        console.log(e);
		        return null;
		    });	    
	}

	// fetches the tip data from the given venueID (found in getPlaceInfo)
	getPlaceTip = (venueID) => {
		return fetch(`https://api.foursquare.com/v2/venues/${venueID}/tips?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}`)
		    .then(data => data.json())
		    .then(data => {
		    	return data.response.tips.items[0];
		    })
		    .catch(function(e) {
		    	console.log(e);
		    	return null;
		    });
	}

	render() {
		// created this variable just to clean up the code when displaying info
		const currentProps = this.state.currentMarkerProps;

		return (
			<div>
				{this.state.loadError && <GoogleMapError/>}
				{!this.state.loadError && 
					<Map
					role='application'
					aria-label='map'
					onReady={this.mapIsReady}
					google={this.props.google}
					zoom={this.props.zoom}
					initialCenter={this.props.center}
					className='map'
					>

						<InfoWindow 
							onClose={this.closeInfoWindow}
							marker={this.state.currentMarker}
							visible={this.state.infoWindowVisible}>

							<div>
								<h3 tabIndex='2'>
									{currentProps && currentProps.name}
								</h3>
								{/*If there is no four square data available, then nothing is displayed */}
								{currentProps && currentProps.fourSquareInfo &&
									<div className='tips' tabIndex='3'>
										<p>{currentProps.fourSquareInfo.text}</p>
										<p><a href={currentProps.fourSquareInfo.canonicalUrl}>See more info</a></p>
										<p>Tips provided by Foursquare</p>
									</div>
								}
								{/*Display message if there is no fourSquareInfo */}
								{currentProps && !currentProps.fourSquareInfo &&
									<div className='tips' tabIndex='3'>
										<p>No Foursquare info available</p>
									</div>
								}
							</div>
						</InfoWindow>
					</Map>
				}
			</div>
		);
	}
}

export default GoogleApiWrapper({apiKey: 'AIzaSyD5R-Qq9SoZ3Y4RmxD2xB7XDhaag-nKZ9s' })(GoogleMap)