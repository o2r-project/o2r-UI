import React, { Component } from 'react'
import {Button, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Route, NavLink, HashRouter } from "react-router-dom";

import './App.css';
import logo from '../../assets/img/o2r-logo-only-white.svg';
import orcidLogo from '../../assets/img/orcid.png';
import Privacy from './footerLinks/Privacy';
import Impressum from './footerLinks/Impressum';
//import Startpage from '../startpage/Startpage';
//Demo
import Startpage from '../startpageDemo/Startpage';
import httpRequests from '../../helpers/httpRequests';
import Author from '../authorView/Author';
import CreateERC from '../createERC/CreateERC';
import Discovery from '../discovery/Discovery';
import ERC from '../erc/ERC';

const Header = ( props ) => {
  return (        
    <AppBar id="header">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
          <a href="/"><img src={logo} alt="o2r" id="headerLogo"/></a>
        </Typography>
        <Button target="_blank" rel="noopener" color="inherit" href="http://www.dlib.org/dlib/january17/nuest/01nuest.html">
          Learn more about ERCs
        </Button>
        <HashRouter>
          {/*<NavLink id="link" to="/discover">
            <Button color="inherit" label="test">
              Discover ERC
            </Button>
          </NavLink>*/}
          <NavLink id="link" to="/author">
            {props.loggedIn ? 
              <Button color="inherit">
                {props.userName} | 
                  <img src={orcidLogo} className="orcidImage" alt="orcid"></img>
                  {props.userOrcid}
              </Button> : ''}
          </NavLink>
        </HashRouter>
        <Button color="inherit"
          href={props.loggedIn ? "api/v1/auth/logout" : "api/v1/auth/login"} 
          onClick={() => props.login()}>{props.loggedIn ? 'Logout' : 'Login'}
        </Button>
        {/*<Button color="inherit">
          Help
            </Button>*/}
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
          <a id="link" href="http://www.dlib.org/dlib/january17/nuest/01nuest.html"> About ERC</a> |
          <a id="link" href="https://o2r.info/erc-spec/"> ERC specification</a> |
          <NavLink id="link" to="/impressum"> Impressum</NavLink> |
          <NavLink id="link" to="/privacy"> Privacy Policy</NavLink> |
          <a id="link" href="https://o2r.info/api/"> API</a> |
          <a id="link" href="https://o2r.uni-muenster.de/api/v1/"> Endpoint</a> |
          <a id="link" href="https://github.com/o2r-project/reference-implementation"> Implementation</a> | 
          Version 0.2.0
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
    };
  };

  user () {
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
        loggedIn={this.state.loggedIn} 
        login={() => this.user()}
        userName={this.state.userName}
        userOrcid={this.state.userOrcid}>  
      </Header>
      <Footer></Footer>
      <HashRouter>
      <div>
        <div className="content" id="mainView">
          <Route exact path="/" component={Startpage}/>
          <Route path="/impressum" component={Impressum}/>
          <Route path="/privacy" component={Privacy}/>
          <Route path="/author" component={Author}/>
          <Route path="/createERC/:id" component={CreateERC}/>
          <Route path="/discover" component={Discovery}/>
          <Route path="/erc/:id" component={ERC}/>
        </div>
      </div>
      </HashRouter>
      </div>
    )
  }
}

export default App

