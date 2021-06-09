import React, { Component } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

// env vars
const client_id = process.env.REACT_APP_client_id;
const client_secret = process.env.REACT_APP_client_secret;

export default class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       latlong: '',
       searchInput:"",
       rawData: [],
       venues: [],
       theVenue_id: [],
    }
  }
  
  componentDidMount() {this.getLocation()}
  // get users location
  getLocation = () => (navigator.geolocation.getCurrentPosition(response => this.setState({latlong: response.coords.latitude +","+response.coords.longitude}, () => this.getVenues(this.state.searchInput), () => this.getVenueDetails())));
  // get users text in state
  changeHandler = (event) => {
    this.setState({searchInput:event.target.value});
  }
  // search for venues
  getVenues = (query) => {  
    const endPoint = "https://api.foursquare.com/v2/venues/search?";
    const params =  {
      client_id: client_id,
      client_secret: client_secret,
      ll: this.state.latlong,
      query: query,
      radius: 10000,
      limit: 50,
      v: "20180323"
    };


    axios.get(endPoint + new URLSearchParams(params)).then(response => this.setState({rawData: response.data.response.venues}));
    axios.get(endPoint + new URLSearchParams(params)).then(response => this.setState({theVenue_id: response.data.response.venues.map(venue_id=>{return venue_id.id})}));
    axios.get(endPoint + new URLSearchParams(params)).then(response => this.setState({venues: response.data.response.venues.map(venues=>{return venues.name})}));

  }

  render() {
    return (
      <div>
        <form onSubmit={this.getVenues.bind(null,this.state.searchInput)}>
          <input onChange={this.changeHandler} type="text" placeholder="search venue" name="searchInput" id="searchInput"></input>
          <button type="submit">Search</button>
        </form>
        <ul>
          {this.state.venues.map(venue=>{return <li key={uuidv4()}>{venue}</li>})}
          {/* {this.state.venues.map(venue_id=>{return <li>{venue_id.id}</li>})
      
    } */}

      </ul>
      </div>
    )
  }
}

