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
    //if(this.state.showList)

    this.setState({showList: !this.state.showList});
  }

  render() {
    return (
      <div>
        <header>
          <button className="menu" onClick={this.toggleList}>
            <span className="entypo-menu"></span>
          </button>
          <h1>Sarah's Places</h1>
        </header>       

        {this.state.showList && <ListView myPlaces={this.state.all}/>}
      
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
