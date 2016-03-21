var React = require('react');

var TextListItem = React.createClass({
  renderDate: function() {
    var dateEl;
    if (this.props.date) {
      var date = new Date(this.props.date);
      var y = date.getFullYear().toString();
      var m = (date.getMonth()+1).toString();
      var d  = date.getDate().toString();

      var dateStr = (m[1]?m:"0"+m[0]) + '/' + (d[1]?d:"0"+d[0]) + '/' + y;
      dateEl = (
        <div className="li-date">{dateStr}</div>
      );
    }
    return dateEl;
  },
  renderAttachment: function() {
    var attachment;
    if (this.props.attachment) {
      var n = this.props.attachment.lastIndexOf('/');
      var name = this.props.attachment.substring(n + 1);
      attachment = (
        <div className="li-attachment">
          <a className="li-attachment-download" href={this.props.attachment} target="_blank"></a>
          <div className="li-attachment-name">{name}</div>
        </div>
      );
    }
    return attachment;
  },
  render: function() {
    //<div className="li-name">{this.props.user.name}</div>

    var name = "Test User";
    if (typeof(this.props.user) != 'undefined') {
      name = this.props.user.name;
    }

    return (
      <li className="probability-list-item">
        <div className="li-info">
          <div className="li-image"></div>
          <div className="li-name">Test User</div>
          {this.renderDate()}
        </div>
        <div className="li-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit leo ullamcorper vehicula fermentum. Curabitur mollis nisl et dapibus dictum. Duis cursus nec turpis quis rutrum. Morbi eleifend ante nisl, ultrices facilisis nisi interdum non. Integer tempus ornare suscipit. Nulla vel pharetra velit. Maecenas tincidunt et tellus a feugiat. Phasellus eu dapibus nisl, vel hendrerit ante. Ut ac urna efficitur, scelerisque justo et, porta nulla. Cras sagittis pellentesque nisl at faucibus. Vivamus in leo erat. Integer faucibus, nisi eu tincidunt interdum, libero est imperdiet quam, quis semper sapien purus eget ipsum.</div>
        {this.renderAttachment()}
      </li>
    );
  }
});
module.exports = TextListItem;
