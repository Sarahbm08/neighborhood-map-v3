Sarah's Places App
===============================

This is Sarah Morley's implementation of the Neighborhood Map app for the udacity Front End Web Development nandegree.

## How to Run

This app utilzes the React framework, so in order to run you need to run `npm install` then `npm start` to start the server. A browser window will automatically open with the MyReads app running.

The service worker that is bootstrapped with create-react-app is enabled in this app, but it will only work in the production build.

## Features

This neighboorhood app features a preset list of places (contained in `data/locations.json`) that are automatically marked upon the app first opening. You can then press on each marker to opens the top review (from Foursquare), with a link to see more information where available. You can also view a list of the places by clicking on the hamburger menu. In the list you can filter which places are displayed by just typing in a query. Any place that contains any part of the search will then be displayed, along with the accompanying markers on the map.

## Dependancies

* NodeJS
* ReactJS
* create-react-app
* google-maps-react
* weloveiconfonts.com (hamburger icon)
* Foursquare API