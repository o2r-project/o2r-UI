import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Route, NavLink, HashRouter } from "react-router-dom";

import './App.css';
import logo from '../../assets/img/o2r-logo-only-white.svg';
import Privacy from './footerLinks/Privacy';
import Impressum from './footerLinks/Impressum';
import Upload from '../upload/Upload';
import httpRequests from '../../helpers/httpRequests'

const Header = (props) => {
  return (        
    <AppBar id="header">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
          <a href="/"><img src={logo} alt="" id="headerLogo"/></a>
        </Typography>
        <Button color="inherit">
          Discover ERC
        </Button>
        {props.loggedIn ? <Button color="inherit">{props.userName} {props.userOrcid}</Button> : ''}
        <Button color="inherit"
          href= {props.loggedIn ? "api/v1/auth/logout" : "api/v1/auth/login"} 
          onClick={() => props.login()}>{props.loggedIn ? 'Logout' : 'Login'}
        </Button>
        <Button color="inherit">Help</Button>
      </Toolbar> 
    </AppBar>
  );
};

const Footer = () => {
  return(
    <div className="mui-container mui--text-center" id="footer">
      <HashRouter>
      <div id="links">
          <NavLink id="link" to="/">Home</NavLink> |
          <NavLink id="link" to="/impressum"> Impressum</NavLink> |
          <NavLink id="link" to="/privacy"> Privacy Policy</NavLink>
      </div>
      </HashRouter>
    </div>
  );
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: this.user(),
      userName: null,
      userOrcid: null,
    }
  }

  user() {
    httpRequests.getUser()
    .then(
      response => this.setState({
        loggedIn: true,
        userName: response.data.name,
        userOrcid:response.data.orcid
      }),
    )
    .catch(response => {
      console.log(response);
    });  
  }


  render() {
    return (
      <div id="pageContainer">
      <Header 
        loggedIn = {this.state.loggedIn} 
        login = {() => this.user()}
        userName = {this.state.userName}
        userOrcid = {this.state.userOrcid}>
      </Header>
      <Footer></Footer>
      <HashRouter>
      <div>
        <div className="content" id="mainView">
          <Route exact path="/" component={Upload}/>
          <Route path="/impressum" component={Impressum}/>
          <Route path="/privacy" component={Privacy}/>
        </div>
      </div>
      </HashRouter>
      </div>
    )
  }

}
export default App

class Main extends React.Component {

  render() {
    return (
      <div>
        {this.props.view}
      </div>
    );
  }
}