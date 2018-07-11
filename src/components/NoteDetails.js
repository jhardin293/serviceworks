import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { uploadImage } from '../actions'
import { Link, Redirect } from 'react-router-dom'

export class NoteDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: {
        title: props.note.title,
        body: props.note.body,
        image: props.note.image,
        id: props.note.id || ''
      },
      onSave: props.onSave,
      allowDelete: props.allowDelete
    }
  }

  static propTypes = {
    note: PropTypes.object.isRequired,
    exit: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    allowDelete: PropTypes.bool,
  }

  onChange = (e) => {
    this.setState({ note: { ...this.state.note, [e.target.name]: e.target.value } });
  }

  onSave = (e, note) => {
    e.preventDefault()
    this.props.onSave(e, note)
  }

  handleUpload = (e) => {
    //Make sure photo is uploaded before your alowed to save note;
    const file = e.target.files[0];
    if (file) {
      uploadImage(file).then((url) => {
        this.setState({ note: { ...this.state.note, image: url } });
      })
    }
  }
  render() {
    const allowDelete = this.state.allowDelete;
    if (this.props.exit === true) {
      return <Redirect to="/notes" />
    }
    return (
      <div className="new-note-view page-view">
        <div className="page-header">
          <h1>{this.state.note.title || 'New note'}</h1>
          <div className="tab-btn-group">
            <Link to="/notes">
              <button className="btn second-btn btn-cancel ">Cancel</button>
            </Link>
            {allowDelete &&
              <button
                className="btn second-btn btn-delete"
                onClick={(e) => this.props.onDelete(this.state.note.id, e)}>
                Delete
              </button>
            }
            <button
              className="btn second-btn success btn-success"
              onClick={(e) => this.onSave(e, this.state.note)}>
              Save
            </button>
          </div>
        </div>
        <div className="page-body">
          <div className="note">
            <form>
              <input type="text" name="title" placeholder="New Note" value={this.state.note.title} onChange={this.onChange} />
              <textarea name="body" value={this.state.note.body} onChange={this.onChange} />
              <div className="control-area">
                <input type="file" name="Add Photo" onChange={this.handleUpload} />
              </div>
            </form>
            <div>
              {this.state.note.image.length > 0 &&
                <img src={this.state.note.image} alt="" />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}