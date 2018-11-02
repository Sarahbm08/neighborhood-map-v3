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
    showList: false
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
          />
        }
      
        <GoogleMap
          center={this.state.center}
          zoom={this.state.zoom}
          myPlaces={this.state.filtered}
        />
      </div>
    );
  }
}

export default App;
