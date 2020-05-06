import React, {Component} from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import * as selectors from '../../redux/root-reducer'

import RoleListItem from '../RoleListItem';

const RESTRICTED_ROLES = [
  "administrator",
  "manager",
  "customer",
  "reporter",
  "reader"
]


class ManageRoles extends Component {
  constructor(){
    super()
    this.state = {
      roles: [],
    };
  };
  componentDidMount(){
    axios.get('http://localhost:3000/roles')
    .then(response => this.setState({roles: response.data}))
    .catch(error=>console.log(error));
  }
  updateState = (index) => {
    axios.get('http://localhost:3000/roles')
    .then(response => this.setState({roles: response.data}))
    .catch(error=>console.log(error));
  }
  render(){
    const { authUser } = this.props;
    return (
      <div>
        <div className="pa1 ph5-l tc">
          <h1 className="f3 fw6">Manage Roles</h1>
        </div>
        <div className="pa4">
          <div className="overflow-y-scroll overflow-x-scroll vh-50 ">
            <table className="f6 w-100 mw-100 center" cellSpacing="0">
              <thead>
                <tr>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">User Name</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Read Artist</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Register Artist</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Update Artist</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Delete Artist</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Read Song</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Register Song</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Update Song</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Delete Song</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Inactive Song</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Read Album</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Register Album</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Update Album</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Delete Album</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Generate Report</th>
                  <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">Actions</th>
                </tr>
              </thead>
              <tbody className="lh-copy">
                {
                  this.state.roles.filter(role => !RESTRICTED_ROLES.includes(role.name.toLowerCase()) ).map((singleRole, i)=>{
                    return (
                      <RoleListItem
                      key={singleRole.roleid}
                      role={singleRole}
                      currentUser={authUser}
                      updateState={this.updateState}
                      index={i}
                      />
                    );
                })
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="tc pa2">
          {/*TODO: pasarle la ruta correcta y permitir renderizar el formulario AddRole */}
          <Link className="f5 link dim ph4 pv3 m2 dib white bg-green" to={`/${authUser.rolename}/manageroles/new`}>Add Role</Link>
        </div>
      </div>    
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: selectors.getAuthUser(state)
});

export default connect(mapStateToProps)(ManageRoles);