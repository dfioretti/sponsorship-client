var React = require('react');

var NotableForm = React.createClass({
  validateForm: function () {
    var self = this;
    var errors = [];
    var validators = {
      validateBody: {
        shouldValidate: !!this.props.validateBody,
        message: "Body cannot be blank",
        isValid: function () { return ReactDOM.findDOMNode(self.refs.body).value !== ""; }
      },
      validateFile: {
        shouldValidate: !!this.props.validateFile,
        message: "Must attach file",
        isValid: function () { return !_.isUndefined(ReactDOM.findDOMNode(self.refs.file).files[0]); }
      }
    };

    _.each(validators, function (config, key) {
      if (config.shouldValidate && !config.isValid()) {
        errors.push(config.message);
        self.setState({error: config.message});
      }
    });

    return {
      errors: errors
    };
  },
  saveToS3IfUpload: function () {
    var deferred = $.Deferred();

    var file = ReactDOM.findDOMNode(this.refs.file).files[0];
    var args = {body: ReactDOM.findDOMNode(this.refs.body).value, company_id: this.props.company_id};

    if (this.props.tagsEnabled) {
      args.tag_list = ReactDOM.findDOMNode(this.refs.tagsList).value;
    }

    $('.note-submit').attr('disabled', true);

    if (typeof(file) != 'undefined') {

      var name = file.name.replace(/ /g, '_');
      var s3upload = s3upload != null ? s3upload : new S3Upload({
        file_dom_selector: 'note-file',
        s3_sign_put_url: '/api/v1/sign_upload',
        s3_object_name: ENV+'/'+uuid.v4()+'/'+name,
        onProgress: function(percent, message) {
          $('.loader-bar').width(percent * 4);
        },
        onFinishS3Put: function(public_url) {
          args.attachment = public_url;
          deferred.resolve(args);
        },
        onError: function(status) {
          console.log('Upload error: ', status);
          deferred.reject();
        }
      });
    } else {
      deferred.resolve(args);
    }

    return deferred.promise();
  },
  save: function(e) {
    e.preventDefault();
    var p = this;
    // console.log(ReactDOM.findDOMNode(this.refs.file).files[0])
    // console.log(_.isEmpty(ReactDOM.findDOMNode(this.refs.file).files[0]))

    if (this.validateForm().errors.length > 0) {
      return;
    }

    this.saveToS3IfUpload().done(function (args) {
      if (p.props.saveHandler) {
        p.props.saveHandler(args).then(function() {
          p.clear();
          $('.note-submit').attr('disabled', false);
          $('.loader-bar').width(0);
        });
      } else {
        p.clear();
        $('.note-submit').attr('disabled', false);
        $('.loader-bar').width(0);
      }
    });
  },
  clear: function() {
    this.setState({error: null});
    ReactDOM.findDOMNode(this.refs.form).reset();
  },
  render: function () {
    if (this.state && this.state.error) {
      var errorMessage = (
        <div className="error-message">{this.state.error}</div>
      );
    }

    if (this.props.tagsEnabled) {
      var tagsInput = (
        <input type="text" className="form-control notable-tags-input" id="notable-tags" ref="tagsList" placeholder="Add tags (separate with commas)..."/>
      )
    }

    return (
      <div>
        <div className="new-note">
          {errorMessage}
          <form id="note-form" ref="form" onSubmit={this.save}>
            <textarea placeholder={this.props.bodyPlaceholder || "New note here..."} ref="body"></textarea>
            {tagsInput}
            <div className="attachment">
              <input type="file" className="file-input" id="note-file" ref="file" />
            </div>
            <button type="submit" className="note-submit">Submit</button>
          </form>
        </div>
        <div className="loader-bar"></div>
      </div>
    );
  }
});
module.exports = NotableForm;
