import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Nav from './components/Nav';
import ManageUsers from './components/ManageUsers';

import 'tachyons';

class App extends Component {
  constructor(){
    super();
    this.state = {
      currentUser: {}
    };
  };
  componentDidMount(){
    fetch('http://localhost:3000/users/1')
    .then(response => response.json())
    .then(data => {
      this.setState({currentUser: data[0]})
    });


  }
  render(){
    return (
      <div>
        <Router>
          <Nav currentUser={this.state.currentUser}/>
          {/* modificar las rutas cuando ya se tenga el front end de los demas usuarios, por el moment
          / sera la ruta predeterminada para el admin */}
          <Route exact path={`/${this.state.currentUser.username}/manageusers`}
            render={(props) => <ManageUsers {...props} currentUser={this.state.currentUser}/>}
            />
          {/* <Route exact path={`/${this.state.currentUser.username}/stats`} component={ManageUsers}/>
          <Route exact path={`/${this.state.currentUser.username}/manageroles`} component={ManageUsers}/>
          <Route exact path={`/${this.state.currentUser.username}/signout`} component={ManageUsers}/> */}
          {/* <Route exact path="/dashboard/:babyId" component={Dashboard} />
          <Route exact path="/newbaby"
          render={(props) => <AddBaby {...props} doBabiesExist={true} />}/> */}
        </Router>
        
      </div>
    );
  }
}

export default App;
