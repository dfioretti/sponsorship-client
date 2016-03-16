var React = require('react');

// TODO - build another consts file
const PermissionTypes = [
  'admin',
  'fifa',
  'ews'
]
var UsersIndex = React.createClass({
  getInitialState: function() {
    return {users: []};
  },
  componentWillMount: function() {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "/api/v1/users",
      success: function(data, status, xhr) {
        this.setState({users: data.users});
      }.bind(this),
      error: function(xhr, status, error) {
        console.log("ERROR")
        console.log(status);
        console.log(error);
      }
    });
  },
  handleCheck: function(user, e) {
    var p = user.permissions;
    var index = p.indexOf(e.target.value);
    if (index == -1) {
      p.push(e.target.value);
    } else {
      p.splice(index, 1);
    }

    user.permissions = p

    $.ajax({
      type: "PUT",
      contentType: "application/json",
      url: "/api/v1/users/" + user.id,
      data: JSON.stringify({user: user}),
      success: function(data, status, xhr) {
        var users = this.state.users;
        $.each(users, function(i, u) {
          if (u.id == data.user.id) {
            users[i] == data.user;
          }
        });
        this.setState({users: users});
      }.bind(this),
      error: function(xhr, status, error) {
        console.log("ERROR")
        console.log(status);
        console.log(error);
      }
    });
  },
  renderPermissionChecks: function(permissions, user) {
    var boxes = $.map(PermissionTypes, function(p, i) {
      var checked = permissions.indexOf(p) != -1
      return (
        <span className="checkbox-container" key={i}>
          <input type="checkbox" name={p} value={p} checked={checked} onChange={this.handleCheck.bind(this, user)}/>
          {p}
        </span>
      );
    }.bind(this));

    return (
      <div>
        {boxes}
      </div>
    );
  },
  renderUsers: function() {
    var usersList = $.map(this.state.users, function(u, i) {
      return (
        <tr key={i}>
          <td>{u.name}</td>
          <td>{u.email}</td>
          <td className="permissions-checklist">{this.renderPermissionChecks(u.permissions, u)}</td>
        </tr>
      );
    }.bind(this));

    return (
      <tbody>
        {usersList}
      </tbody>
    );
  },
  render: function() {
    return (
      <div id="users_index" className="users-index centered">
        <div className="top">
          <p className="top-title">Users</p>
        </div>
        <div className="company-index-table">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Permissions</th>
              </tr>
            </thead>
            {this.renderUsers()}
          </table>
        </div>
      </div>
    );
  }
});
module.exports = UsersIndex;
