import React, { Component } from 'react'
import {Button, AppBar, Toolbar} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Route, NavLink, HashRouter } from "react-router-dom";

import './App.css';
import logo from '../../assets/img/o2r-logo-only-white.svg';
import orcidLogo from '../../assets/img/orcid.png';
import Privacy from './footerLinks/Privacy';
import Impressum from './footerLinks/Impressum';
import Upload from '../upload/Upload';
import httpRequests from '../../helpers/httpRequests';
import Author from '../authorView/Author';

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
        <HashRouter>
          <NavLink id="link" to="/author">
            {props.loggedIn ? 
              <Button color="inherit" href="/author">
                {props.userName} | <img src={orcidLogo} className="orcidImage"></img>{props.userOrcid}
              </Button> : ''}
          </NavLink>
        </HashRouter>
        <Button color="inherit"
          href= {props.loggedIn ? "api/v1/auth/logout" : "api/v1/auth/login"} 
          onClick={() => props.login()}>{props.loggedIn ? 'Logout' : 'Login'}
        </Button>
        <Button color="inherit">
          Help
        </Button>
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
          <Route path="/author" component={Author}/>
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