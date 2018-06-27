import React, { Component } from 'react'
import { InvoiceDetails } from '../components/InvoiceDetails'
import moment from 'moment'
import { newInvoice } from '../actions/'

export class NewInvoice extends Component {
  state = {
    invoice: {
      title: '',
      customer: '',
      selectedBilling: '',
      dueDate: moment(),
      invoiceNumber: this.props.location.state.invoiceNumber + 1,
      total: 0,
      footer: '',
      labor: {
        0: {
          item: '',
          rate: '',
          billing: {
            label: 'Hourly',
            value: 'hourly'
          },
          hours: '',
          total: 0
        }
      },
      parts: {
        0: {
          item: '',
          price: '',
          quantity: 1,
          total: 0
        }
      }
    },
    exit: false,
  }

  onSave = (invoice) => {
    const invoiceClone = {...invoice.invoice};
    invoiceClone.dueDate = new Date(invoiceClone.dueDate);
    // console.log(invoiceClone, 'inovice clone')
    newInvoice(invoiceClone);
    this.setState({exit: true});
  }


  render() {
    console.log(this.state, 'invoice state');
    return (
      <InvoiceDetails
        invoice={this.state.invoice}
        onSave={this.onSave}
        exit={this.state.exit}
      />
    )
  }
}
