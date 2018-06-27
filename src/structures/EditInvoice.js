import React, { Component } from 'react'
import { InvoiceDetails } from '../components/InvoiceDetails'
import moment from 'moment'
import { editInvoice, deleteInvoice } from '../actions/'

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
    allowDelete: true
  }

  onSave = (invoice) => {
    const invoiceClone = { ...invoice.invoice };
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
        onSave={this.onSave}
        onDelete={this.onDelete}
        exit={this.state.exit}
        allowDelete={this.state.allowDelete}
      />
    )
  }
}
