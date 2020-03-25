import React, { Component, Fragment } from "react";
import CustomLink from "../CustomLink";
import pullAllWith from "lodash/pullAllWith";
import isEqual from "lodash/isEqual";
import range from "lodash/range";
import axios from 'axios';


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
    .then(res => {
      const data = res.data;
      this.setState({ role: data[0] });
    });

    axios.get(`http://localhost:3000/roles/${this.props.role.roleid}/permissions`)
    .then(res => {
      const data = res.data;
      this.setState({ permissions: data });
    });

    axios.get(`http://localhost:3000/permissions`)
    .then(res => {
      const data = res.data;
      this.setState({ allPermissions: data });
    });

  }

  handleUpdate = () => {
    axios.put(`http://localhost:3000/roles/${this.state.role.roleid}`, { name: this.state.role.name })
      .then(res => {
        console.log(res.status);
      })
  };

  handleFieldChange = event => {
    const { checked, value } = event.target;
    if (!checked) {
      const itemToPull = this.state.allPermissions.filter(
        item => item["permissionid"] == value);
      const copy = pullAllWith(this.state.permissions, itemToPull, isEqual);
      this.setState({ permissions: copy });

      axios.delete(`http://localhost:3000/roles/${this.state.role.roleid}/permissions/${value}`)
        .then(res => {
          console.log(res.status)
        });

    } else {
      const itemToPush = this.state.allPermissions.filter(
        item => item["permissionid"] == value
      );
      const copy = [...this.state.permissions, itemToPush[0]];
      this.setState({ permissions: copy });
      axios.post(`http://localhost:3000/roles/${this.state.role.roleid}/permissions`, itemToPush[0])
        .then(res => {
          console.log(res.status);
        });

    };
  }

  handleInputChange = event => {
    const { value, name } = event.target;
    const copy = { ...this.state.role, [name]: value };
    this.setState({ role: copy });
  };

  handleDelete = event => {

    axios.delete(`http://localhost:3000/roles/${this.state.role.roleid}`)
      .then(res => {
        console.log(res.status)
      });
  }

  render() {
    //console.log("aquí va el state", this.state.permissions);
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
						<button
              className="b ph3 pv2 input-reset ba b--red red bg-transparent grow pointer f6 dib ma2"
              onClick={this.handleDelete}
            >
              Delete
            </button>
          </td>
        </tr>
      </Fragment>
    );
  }
}

export default RoleListItem;
