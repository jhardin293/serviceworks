import React, { Component } from 'react'
import { editNote, deleteNote } from '../actions'
import { NoteDetails } from '../components/NoteDetails'

export class EditNote extends Component {
  note =   this.props.location.state.note
  state = {
    note: {
      title: this.note.title,
      body: this.note.body || '',
      image: this.note.image || '',
      id: this.note.id
    },
    exit: false
  }

  onDelete = (id) => {
    deleteNote(id);
    this.setState({exit: true});
  }

  onSave = (e,note) => {
    const noteClone = {...note};
    noteClone.last_edit = new Date();
    console.log(noteClone,'edit note clone')
    editNote(noteClone);

    this.setState({exit: true});
  }

  render() {
    return (
      <NoteDetails 
        note={this.state.note} 
        exit={this.state.exit} 
        onSave={this.onSave} 
        onDelete={this.onDelete}
        allowDelete={true}/>
    )
  }
}
