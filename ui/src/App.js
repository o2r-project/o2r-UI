import React, { Component } from 'react'
import './App.css'

import axios from 'axios'

class App extends Component {
  constructor () {
    super()
    this.state = {
      username: ''
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    axios.get('https://localhost/api/v1')
      .then(response => this.setState({username: response.data.name}))
      .catch(response => {
        console.log("errorrrr");
        console.log(response)
      })
  }

  render () {
    return (
      <div className='button__container'>
        <button className='button' onClick={this.handleClick}>Click Meeee</button>
        <p>{this.state.username}</p>
      </div>
    )
  }
}
export default App