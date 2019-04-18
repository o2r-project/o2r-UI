import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
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
    axios.get('http://localhost/api')
      .then(response => this.setState({quote: response.data.quote}))
      .catch(response => {
        console.log("errorrrr");
        console.log(response)
      })
  }

  render () {
    return (
      
      <div className='button__container'>
      <Button variant="contained" color="primary">
      Material UI
    </Button>
        <button className='button' onClick={this.handleClick}>Click Me</button>
        <p>{this.state.quote}</p>
      </div>
    )
  }
}
export default App