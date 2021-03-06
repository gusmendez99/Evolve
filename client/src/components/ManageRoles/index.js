import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import * as selectors from "../../redux/root-reducer";
import * as actions from "../../redux/role/role.actions";

import RoleListItem from "../RoleListItem";

const RESTRICTED_ROLES = [
  "administrator",
  "manager",
  "customer",
  "reporter",
  "reader",
];

const ManageRoles = ({ authUser, roles, isLoading, onLoad }) => {
  useEffect(onLoad, []);

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
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  User Name
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Read Artist
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Register Artist
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Update Artist
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Delete Artist
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Read Song
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Register Song
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Update Song
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Delete Song
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Inactive Song
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Read Album
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Register Album
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Update Album
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Delete Album
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Generate Report
                </th>
                <th className="fw6 bb b--black-20 tc pb3 pr3 bg-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="lh-copy">
              { roles.length > 0 && !isLoading && (
                roles
                  .filter(
                    (role) =>
                      !RESTRICTED_ROLES.includes(role.name.toLowerCase())
                  )
                  .map((singleRole, i) => {
                    return (
                      <RoleListItem
                        key={singleRole.roleid}
                        role={singleRole}
                        currentUser={authUser}
                        index={i}
                      />
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tc pa2">
        <Link
          className="f5 link dim ph4 pv3 m2 dib white bg-green"
          to={`/${authUser.rolename}/manageroles/new`}
        >
          Add Role
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  authUser: selectors.getAuthUser(state),
  roles: selectors.getRoles(state),
  isLoading: selectors.isFetchingRoles(state),
});

const mapDispatchToProps = (dispatch) => ({
  onLoad() {
    dispatch(actions.startFetchingRoles());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageRoles);
