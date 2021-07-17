import React, { Component } from 'react'
import {Button, AppBar, Toolbar, Typography, MuiThemeProvider } from '@material-ui/core';
import { Route, NavLink, BrowserRouter } from "react-router-dom";

import o2rTheme from '../../helpers/theme';
import './App.css';
import logo from '../../assets/img/o2r-logo-only-white.svg';
import orcidLogo from '../../assets/img/orcid.png';
import Privacy from './footerLinks/Privacy';
import Impressum from './footerLinks/Impressum';
//Demo
import Startpage from '../startpageDemo/Startpage';
import httpRequests from '../../helpers/httpRequests';
import Author from '../authorView/Author';
import CreateERC from '../createERC/CreateERC';
import Discovery from '../discovery/Discovery';
import JobsRender from '../erc/Check/JobsRender'
import ERC from '../erc/ERC';

const Header = ( props ) => {
  return (
    <AppBar style={{backgroundColor : o2rTheme.palette.primary.main}} id="header">
      <Toolbar>
      <a href="/"><img src={logo} alt="o2r" id="headerLogo"/></a>
        <Typography variant="h4" color="inherit" style={{ flex: 1 }}>
          <Button style={{marginLeft: "120px", fontWeight : "bold"}} color="inherit" href={"/"}>HOME</Button>
        </Typography>
        <Button target="_blank" rel="noopener" color="inherit" href="http://www.dlib.org/dlib/january17/nuest/01nuest.html">
          Learn more about ERCs
        </Button>
        <BrowserRouter forceRefresh>
          {/*<a id="link" href="/discover">
            <Button color="inherit" label="test">
              Discover ERC
            </Button>
          </a>*/}
          <NavLink id="link" to={"/author/" + props.userOrcid}>
            {props.loggedIn ?
              <Button color="inherit">
                {props.userName} |
                  <img src={orcidLogo} className="orcidImage" alt="orcid"></img>
                  {props.userOrcid}
              </Button> : ''}
          </NavLink>
        </BrowserRouter>
        <Button color="inherit" id="login"
          href={props.loggedIn ? "/api/v1/auth/logout" : "/api/v1/auth/login"} 
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
    <div style={{backgroundColor : o2rTheme.palette.primary.main}} className="mui-container mui--text-center" id="footer">
      <BrowserRouter forceRefresh>
      <div id="links">
          <NavLink id="link" to="/">Home</NavLink> |&nbsp;
          <a id="link" href="http://www.dlib.org/dlib/january17/nuest/01nuest.html">About ERC</a> |&nbsp;
          <a id="link" href="https://o2r.info/erc-spec/">ERC specification</a> |&nbsp;
          <NavLink id="link" to="/impressum">Impressum</NavLink> |&nbsp;
          <NavLink id="link" to="/privacy">Privacy Policy</NavLink> |&nbsp;
          <a id="link" href="https://o2r.info/api/">API</a> |&nbsp;
          <a id="link" href="https://o2r.uni-muenster.de/api/v1/">Endpoint</a> |&nbsp;
          <a id="link" href="https://github.com/o2r-project/reference-implementation">Implementation</a> |&nbsp;
          Version&nbsp;<code>#dev#</code>
      </div>
      </BrowserRouter>
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
      ojsView: this.ojs(),
      id: this.id(),
    };
  };

  ojs(){
    if (typeof config.ojsView !== 'undefined') {// eslint-disable-line
      return config.ojsView // eslint-disable-line
  }
  return false
  }

  id(){
    if (typeof config.ercID !== 'undefined') {// eslint-disable-line
      return config.ercID // eslint-disable-line
  }
  return ""
  }

  user () {
    httpRequests.getUser()
      .then(
        response => {this.setState({
          loggedIn: true,
          userName: response.data.name,
          userOrcid:response.data.orcid,
        });  
        httpRequests.getOneUser(response.data.orcid)
          .then(
            response=>
            this.setState({
              level: response.data.level
            })
          )
      }


      )
      .catch(response => {
        console.log(response);
      });
  }

  render() {
    return (
      ! this.state.ojsView ? 
      <MuiThemeProvider theme={o2rTheme}>
      <div id="pageContainer">
      <Header
        loggedIn={this.state.loggedIn}
        login={() => this.user()}
        userName={this.state.userName}
        userOrcid={this.state.userOrcid}>
      </Header>

      <BrowserRouter>
      <div>
        <div className="content" id="mainView">
          <Route exact path="/" component={(props) => <Startpage {...props} loggedIn={this.state.loggedIn}></Startpage>} />
          <Route path="/impressum" component={Impressum}/>
          <Route path="/privacy" component={Privacy}/>
          <Route path="/author/:id" component={Author}/>
          <Route path="/createERC/:id" component={CreateERC}/>
          <Route path="/discover" component={Discovery}/>
          <Route exact path="/erc/:id" component={(props) => <ERC {...props} userLevel={this.state.level} orcid={this.state.userOrcid} />}></Route>
          <Route path="/erc/:id/job/:jobId" component={JobsRender}></Route>
           
        </div>
      </div>
      </BrowserRouter>
      <Footer></Footer>
      </div>
      </MuiThemeProvider> :


      <MuiThemeProvider theme={o2rTheme}>

      <BrowserRouter>
        <div className="content" id="mainView" style={{maxHeight: "100%", marginTop: "0px"}}>
          <Route path="/" component={(props) => <ERC {...props} id={this.state.id} userLevel={this.state.level} ojsView={this.state.ojsView} />}></Route>
        </div>
      </BrowserRouter>


      </MuiThemeProvider>
    )
  }
}

export default App
