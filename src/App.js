import React, { Component } from 'react';
import './App.css';
import myPlaces from './data/locations.json';
import GoogleMap from './GoogleMap'
import ListView from './ListView'

class App extends Component {
  state = {
    center: {lat: 39.9157967, lng: -105.0556132},
    zoom: 14,
    all: myPlaces,
    showList: false
  }

  toggleList = () => {
    this.setState({showList: !this.state.showList});
  }

  render() {
    return (
      <div>
        <button 
          className="entypo-menu"
          onClick={this.toggleList}
        >
        </button>

        {this.state.showList && <ListView
          myPlaces={this.state.all}>
        </ListView>}
      
        <GoogleMap
          center={this.state.center}
          zoom={this.state.zoom}
          myPlaces={this.state.all}
        />
      </div>
    );
  }
}

export default App;
