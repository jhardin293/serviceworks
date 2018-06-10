import React, { Component } from 'react'
import { newNote } from '../actions'
import { NoteDetails } from '../components/NoteDetails'

export class NewNote extends Component {
  state = {
    note: {
      title: '',
      body: '',
      image: ''
    },
    exit: false
  }

  onSave = (e,note) => {
    const noteClone = {...note};
    noteClone.last_edit = new Date();
    newNote(noteClone);

    this.setState({exit: true});
  }

  render() {
    return (
      <NoteDetails note={this.state.note} exit={this.state.exit} onSave={this.onSave}/>
    )
  }
}
