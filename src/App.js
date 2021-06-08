import React, { Component } from 'react'
import axios from 'axios'

const client_id = process.env.REACT_APP_client_id;
const client_secret = process.env.REACT_APP_client_secret;

export default class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       latlong: '',
       searchInput:"",
       venues: []
    }
  }
  
  componentDidMount() { this.getLocation();}
  getLocation = () => (navigator.geolocation.getCurrentPosition(response => this.setState({latlong: response.coords.latitude +","+response.coords.longitude}, () => this.getVenues(this.state.searchInput))));
  
  changeHandler = (event) => {
    this.setState({searchInput:event.target.value});
  }
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
    
    axios.get(endPoint + new URLSearchParams(params)).then(response => this.setState({venues: response.data.response.venues}));
  }
  
  
  render() {
    return (
      <div>
        <form onSubmit={this.getVenues.bind(null,this.state.searchInput)}>
          <input onChange={this.changeHandler} type="text" placeholder="search venue" name="searchInput" id="searchInput"></input>
          <button type="submit">Search</button>
        </form>
        <ul>
          {this.state.venues.map(venue=>{return <li key={venue.id}>{venue.name}</li>})}
      </ul>
      </div>
    )
  }
}

