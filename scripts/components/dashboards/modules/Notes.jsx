var React = require('react');
var TextListItem = require('../../common/charts/TextListItem.jsx');
var NotableForm = require('./NotableForm.jsx');


var Notes = React.createClass({
  getInitialState: function() {
		return {scrollLoaded: false};
  },
  componentDidMount: function() {
    var s = this;
    /*
    (function poll(){
      var timeoutId = setTimeout(function(){
        NotesStore.poll(s.props.company.id).then(function(notes){
          s.addNote();
          poll();
        });
      }, 10000);
      s.setState({timeoutId: timeoutId})
    })();
    */
    if (!this.state.scrollLoaded && !this.props.hidden) {
      //$('.notes-list').jScrollPane({contentWidth: '0px'});
      this.setState({scrollLoaded: true});
    }
  },
  componentWillReceiveProps: function(newProps) {
    this.addNote();

    if (this.props.hidden != newProps.hidden && !newProps.hidden && !this.state.scrollLoaded) {
      this.setState({scrollLoaded: true});
      $('.notes-list').jScrollPane({contentWidth: '0px'});
    }
  },
  componentWillUnmount: function() {
    clearTimeout(this.state.timeoutId);
  },
  addNote: function() {
    if (typeof($('.notes-list').data('jsp')) != "undefined") {
      $('.notes-list').data('jsp').destroy();
      this.setState({notes: NotesStore.getState().notes}, function() {
        $('.notes-list').jScrollPane({contentWidth: '0px'});
        $('.notes-list').data('jsp').addHoverFunc();
      });
    }
  },
  createNote: function (args) {
    var self = this;

    return NotesStore.create(args).then(function() {
      self.addNote();
    });
  },
  renderNotesList: function() {
    var notes = $.map(this.state.notes, function(note) {
      console.log("NOTE");
      console.log(note.body);
      return (
        <TextListItem key={note.id} user={note.user} body={note.body} date={note.created_at} attachment={note.attachment} />
      );
    });
    return (
      <div className="notes-list">
        <ul className="text-list media-list">
          {notes}
        </ul>
      </div>
    );
  },
  render: function() {
    var hiddenStyle = this.props.hidden ? {display: 'none'} : {};
//    <NotableForm company_id={this.props.company.id} saveHandler={this.createNote} validateBody={true} />

    return (
      <div id="notes" className="dashboard-module tall" style={hiddenStyle}>
        <div className="top">
          <div className="drag-handle"></div>
          <div className="top-title">Team Notes</div>
        </div>
        <div className="main">
          {this.renderNotesList()}
          <NotableForm company_id={this.props.dashboard.id} saveHandler={this.createNote} validateBody={true} />
        </div>
      </div>
    );
  }
});
module.exports = Notes;
