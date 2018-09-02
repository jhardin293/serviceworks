import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

import deleteIcon from '../images/delete.svg'


Modal.setAppElement('#root');


export class PageNavs extends Component {

  static propTypes = {
    subject: PropTypes.string.isRequired,
    openExitModal: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleDeleteConfirmation: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired, 
    onDelete: PropTypes.func, 
    payload:PropTypes.object.isRequired,
    allowDelete: PropTypes.bool,
    leavePage: PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <Modal
          className="confrimation-modal"
          isOpen={this.props.openExitModal}
          onRequestClose={() => this.props.handleCloseModal()}
          shouldCloseOnOverlayClick={true}
        >
          <img  className="close-modal"  onClick={() => this.props.handleCloseModal()} src={deleteIcon} alt="close"/>
          <h3>You have unsaved changes</h3>
          <div className="button-wrapper">
            <button className="btn second-btn btn-success" onClick={(e) => this.props.onSave(this.props.payload, e)}>Save {this.props.subject}</button>
            <button className="btn second-btn btn-cancel" onClick={() => this.props.leavePage()}>Dont save</button>
            <button className="btn second-btn btn-cancel" onClick={() => this.props.handleCloseModal()}>Cancel</button>
          </div>
        </Modal>
        <Modal
          className="confrimation-modal"
          isOpen={this.props.openDeleteModal}
          onRequestClose={() => this.props.handleCloseModal()}
          shouldCloseOnOverlayClick={true}
        >
          <img  className="close-modal"  onClick={() => this.props.handleCloseModal()} src={deleteIcon} alt="close"/>
          <h3>Are you sure you want to delete?</h3>
          <div className="button-wrapper">
            <button className="btn second-btn btn-delete" onClick={(e) => this.props.onDelete (this.props.payload.id, e)}>Delete {this.props.subject}</button>
            <button className="btn second-btn btn-cancel " onClick={() => this.props.handleCloseModal()}>Cancel</button>
          </div>
        </Modal>
        <div className="tab-btn-group">
          <button
            className="btn second-btn btn-cancel "
            onClick={() => this.props.onCancel(this.props.payload)}>
            Back
            </button>
          {this.props.allowDelete &&
            <button
              className="btn second-btn btn-delete"
              onClick={(e) => this.props.handleDeleteConfirmation(this.props.payload, e)}>
              Delete
              </button>
          }
          <button
            className="btn second-btn btn-success"
            onClick={(e) => this.props.onSave(this.props.payload, e)}>
            Save {this.props.subject}
            </button>
        </div>
      </div>
    )
  }
}