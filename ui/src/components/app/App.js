import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Route, NavLink, HashRouter } from "react-router-dom";

import './App.css';
import logo from '../../assets/img/o2r-logo-only-white.svg';
import Privacy from '../footerLinks/Privacy';
import Impressum from '../footerLinks/Impressum';
import Upload from '../upload/Upload';

const Header = () => {
  return (        
    <AppBar id="header">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
          <a href="/"><img src={logo} alt="" id="headerLogo"/></a>
        </Typography>
        <Button color="inherit">Discover ERC</Button>
        <Button color="inherit" href="api/v1/auth/login">Login</Button>
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
  render () {
    return (
      <div id="pageContainer">
      <Header></Header>
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
  constructor(props){
    super(props);

  }
  render() {
    return (
      <div>{this.props.view}</div>
    );
  }
}