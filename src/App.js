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
    filtered: myPlaces,
    showList: false,
    currentMarkerIndex: -1
  }

  toggleList = () => {
    this.setState({ showList: !this.state.showList });
  }

  updateQuery = (newValue) => {
    this.setState({ filtered: this.filterPlaces(this.state.all, newValue) });
  }

  filterPlaces = (myPlaces, query) => {
    return myPlaces.filter( place => place.name.toLowerCase().includes(query.toLowerCase()) );
  }

  /* THIS IS WHERE YOU ARE
    The currentMarkerIndex isn't being passed correctly and I don't know why */
  clickListItem = (currentMarkerIndex) => {
    console.log("clickListItem index: " + currentMarkerIndex);
    this.setState({ currentMarkerIndex });
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

        {this.state.showList && 
          <ListView 
            myPlaces={this.state.filtered}
            updateQuery={this.updateQuery}
            clickListItem={this.clickListItem}
          />
        }
      
        <GoogleMap
          center={this.state.center}
          zoom={this.state.zoom}
          myPlaces={this.state.filtered}
          currentMarkerIndex={this.state.currentIndex}
        />
      </div>
    );
  }
}

export default App;
