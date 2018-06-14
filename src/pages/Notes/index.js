import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getNotes } from '../../actions'



import plus from '../../images/plus.svg'

class NotesComp extends Component {
  static propTypes = {
    getNotes: PropTypes.func.isRequired,
    notes: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.props.getNotes();
  }
  render() {
    const notes = this.props.notes.notes.sort((a,b)=> {
      return b.last_edit - a.last_edit; 
    });

    const notesList = notes.map((note)=> {
      return (
        <Link 
          key={note.id}
          className="note"
          to={{
            pathname: "/notes/edit-note",
            state: {note}
        }} >
            <div className="note-left">
              <div className="note-text">
                <div className="note-title">{note.title}</div>
                <div className="note-body">
                  <p>{note.body}</p>
                </div>
              </div>
              <div className="note-img">
                <img src={note.image} alt="note-img" />
              </div>
            </div>
            <div className="note-right">
              <div className="note-created ">
                <span>{moment(note.last_edit).format('L')}</span>
                <span>{moment(note.last_edit).format('LT')}</span>
              </div>
            </div>
        </Link>
      )
    })
    return (
      <div className="notes-view page-view">
        <div className="page-header">
          <h1>Notes</h1>
          <Link to="notes/new-note">
            <button className="notes-btn btn"><img src={plus} alt="" /><span>New note</span></button>
          </Link>
        </div>
        <div className="page-body">
          <div className="notes-list-wrapper">
            <div className="notes-list panel">
              <div className="header">
                <h2>Note text</h2>
                <h2>Updated</h2>
              </div>
              <div className="panel-body">
                <div className="sort-group">
                  {/* <div className="month-group"><span>March 2018</span></div> */}
                  <div className="group-body">
                    {notesList}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapNoteStateToProps = state => ({
  notes: state.notes
});
export const Notes = connect(mapNoteStateToProps, {getNotes})(NotesComp);

