import React, { Component } from 'react'
import { InvoiceDetails } from '../components/InvoiceDetails'
import moment from 'moment'

export class NewInvoice extends Component {
  state = {
    invoice: {
      title: '',
      customer: '',
      selectedBilling: '',
      dueDate: moment()
    },
    exit: false,
  }

  render() {
    return (
      <InvoiceDetails 
        invoice={this.state.invoice}
      />
    )
  }
}
