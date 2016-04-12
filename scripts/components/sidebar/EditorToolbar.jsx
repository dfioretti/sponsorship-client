var React = require('react'),
    Toolbar = require('material-ui').Toolbar,
    SaveIcon = require('react-icons/lib/md/save'),
    AddIcon = require('react-icons/lib/md/add-circle-outline'),
    ToolbarTitle = require('material-ui').ToolbarTitle,
    RaisedButton = require('material-ui').RaisedButton,
    FlatButton = require('material-ui').FlatButton,
    ToolbarGroup = require('material-ui').ToolbarGroup,
    ToolbarSeparator = require('material-ui').ToolbarSeparator;

var EditorToolbar = React.createClass({
    render: function() {
        return (
            <Toolbar>
                <ToolbarGroup float="left">
                    <FlatButton
                    style={{marginLeft: 0, marginRight: 0, fontFamily: 'Avenir-Book'}}
                    icon={<AddIcon />}
                    label="NEW"
                    onMouseUp={this.props.handleNewClick}
                    />
                    <FlatButton
                    style={{marginLeft: 0, marginRight: 0, fontFamily: 'Avenir-Book'}}
                    icon={<SaveIcon />}
                    onMouseUp={this.props.handleSaveClick}
                    label="SAVE"
                    />
                </ToolbarGroup>
            </Toolbar>
        );
    }
});

module.exports = EditorToolbar;
