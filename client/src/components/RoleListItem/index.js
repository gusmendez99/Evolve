import React, { Component, Fragment } from "react";
import pullAllWith from "lodash/pullAllWith";
import isEqual from "lodash/isEqual";
import range from "lodash/range";
import axios from 'axios';

import CustomLink from '../CustomLink'

class RoleListItem extends Component {
  constructor() {
    super();
    this.state = {
      role: {},
      permissions: [],
      allPermissions: []
    };
  }
  componentDidMount() {
    axios.get(`http://localhost:3000/roles/${this.props.role.roleid}`)
      .then(response => {
        this.setState({ role: response.data[0] });
      });

    axios.get(`http://localhost:3000/roles/${this.props.role.roleid}/permissions`)
      .then(response => {
        this.setState({ permissions: response.data });
      });
    axios.get("http://localhost:3000/permissions")
      .then(response => {
        const filterData = pullAllWith(response.data, [{permissionid: 15, name: "READ ACTIVE SONG"}],isEqual);
        this.setState({ allPermissions: filterData });
      });
  }

	handleUpdate = () => {
		axios({
      method: "put",
      url:`http://localhost:3000/roles/${this.state.role.roleid}`, 
			data: { name: this.state.role.name }
    }).then(response => console.log(response.status))
    .catch(error => console.log(error));
	};

	handleFieldChange = event => {
		const { checked, value } = event.target;
		if (!checked) {
			console.log(this.state.permissions);
			const itemToPull = this.state.allPermissions.filter(
				item => item["permissionid"] == value
			);
			
      console.log("Esto le mando ->".itemToPull);

      axios.delete(`http://localhost:3000/roles/${this.state.role.roleid}/permissions/${value}`)
      .then(response => {
        console.log(response.status);
        if(response.status === 200){
          const copy = pullAllWith(this.state.permissions, itemToPull, isEqual);
		    	this.setState({ permissions: copy });
        }
      })
      .catch(error=> console.log(error));
		} else {
			const itemToPush = this.state.allPermissions.filter(
				item => item["permissionid"] == value
			);
			console.log(itemToPush[0]);
      axios({
        method: "post",
        url: `http://localhost:3000/roles/${this.state.role.roleid}/permissions`,
        data: itemToPush[0]
      })
      .then(response =>{ 
        console.log(response.status);
        if (response.status===201){
        const copy = [...this.state.permissions, itemToPush[0]];
        this.setState({ permissions: copy });
      }})
      .catch(error=> console.log(error));
		}
	};
	
	handleInputChange = event => {
		const { value, name } = event.target;
		const copy = { ...this.state.role, [name]: value };
		this.setState({ role: copy });
	};
  // TODO: hay que aplicar onDelete cascade porque el server tira error ya que en rolepermission está
  // esta llave de rol como llave foránea
	handleDelete = event => {
		axios({
      method: "delete",
      url: `http://localhost:3000/roles/${this.state.role.roleid}`,
    })
    .then(response => console.log(response.status))
    .catch(error => console.log(error));
	};

  render() {
    return (
      <Fragment>
        <tr className="tc">
          <td className="pv3 pr3 bb b--black-20">
            <input
              name="name"
              className="input-reset ba b--black-20 pa2 db w-100"
              type="text"
              placeholder={this.state.role.name}
              aria-describedby="name"
              onChange={this.handleInputChange}
            />
          </td>

          {range(this.state.allPermissions.length).map((val, index) => (
            <td className="pv3 pr3 bb b--black-20" key={index}>
              <input
                className="mr2"
                key={index}
                value={val + 1}
                type="checkbox"
                checked={
                  this.state.permissions.filter(
                    item => item["permissionid"] == val + 1
                  ).length > 0
                }
                onChange={this.handleFieldChange}
              />
            </td>
          ))}
          <td className="pv3 pr3 bb b--black-20 flex justify-center items-center">
            <button
              className="b ph3 pv2 input-reset ba b--blue blue bg-transparent grow pointer f6 dib ma2"
              onClick={this.handleUpdate}
            >
              Update
            </button>

            <CustomLink
								to={`/${this.props.currentUser.rolename}/manageroles`}
								className="b ph3 pv2 input-reset ba b--red red bg-transparent grow pointer f6 dib ma2"
								onClick={this.handleDelete}>Delete</CustomLink>
          </td>
        </tr>
      </Fragment>
    );
  }
}

export default RoleListItem;
