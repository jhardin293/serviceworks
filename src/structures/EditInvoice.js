import React, { Component } from 'react'
import { InvoiceDetails } from '../components/InvoiceDetails'
import moment from 'moment'
import { editInvoice, deleteInvoice } from '../actions/'
import isEqual from 'lodash.isequal'

export class EditInvoice extends Component {
  invoice = this.props.location.state.invoice
  state = {
    invoice: {
      title: this.invoice.title,
      customer: this.invoice.customer,
      dueDate: moment(this.invoice.dueDate),
      invoiceNumber: this.invoice.invoiceNumber,
      total: this.invoice.total,
      footer: this.invoice.footer,
      labor: this.invoice.labor,
      parts: this.invoice.parts,
      id: this.invoice.id
    },
    exit: false,
    allowDelete: true,
    redirect: this.props.location.state.redirect,
    openExitModal: false,
    openDeletModal: false,
  }

  onCancel = (currentState) => {
    if(isEqual(this.state.invoice, currentState)) {
      this.setState({exit: true});
    }else {
      this.setState({openExitModal: true});
    }
  }

  handleDeleteConfirmation = () => {
    this.setState({openDeleteModal: true});
  }

  handleCloseModal = () => {
    this.setState({openExitModal: false, openDeleteModal: false});
  }

  onSave = (invoice) => {
    const invoiceClone = { ...invoice };
    invoiceClone.dueDate = new Date(invoiceClone.dueDate);
    editInvoice(invoiceClone);
    this.setState({ exit: true });
  }

  onDelete = (id) => {
    deleteInvoice(id);
    this.setState({ exit: true });
  }

  render() {
    return (
      <InvoiceDetails
        invoice={this.state.invoice}
        onCancel={this.onCancel}
        onSave={this.onSave}
        onDelete={this.onDelete}
        exit={this.state.exit}
        redirect={this.state.redirect}
        allowDelete={this.state.allowDelete}
        openExitModal={this.state.openExitModal}
        handleCloseModal={this.handleCloseModal}
        handleDeleteConfirmation={this.handleDeleteConfirmation}
        openDeleteModal={this.state.openDeleteModal}
      />
    )
  }
}
