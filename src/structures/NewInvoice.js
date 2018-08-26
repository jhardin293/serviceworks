import React, { Component } from 'react'
import { InvoiceDetails } from '../components/InvoiceDetails'
import moment from 'moment'
import { connect } from 'react-redux'
import { newInvoice, getInvoiceCount } from '../actions/'

export class NewInvoiceComp extends Component {
  state = {
    invoice: {
      title: '',
      customer: '',
      selectedBilling: '',
      dueDate: moment(),
      invoiceNumber: '',
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
  componentWillMount() {
    this.props.getInvoiceCount();
    if (this.props.location.state) {
      this.setState({redirect: this.props.location.state.redirect})
    }else {
      this.setState({redirect: {path: '/invoices'}})
    }
  }


  onCancel = () => {
    this.setState({exit: true});
  }

  onSave = (invoice) => {
    const invoiceClone = {...invoice.invoice};
    invoiceClone.dueDate = new Date(invoiceClone.dueDate);
    invoiceClone.invoiceNumber = this.props.invoicesCount.invoicesCount +1;
    newInvoice(invoiceClone);
    this.setState({exit: true});
  }


  render() {
    console.log(this.state, 'state');
    return (
      <InvoiceDetails
        invoice={this.state.invoice}
        onSave={this.onSave}
        exit={this.state.exit}
        onCancel={this.onCancel}
        redirect={this.state.redirect}
      />
    )
  }
}

const mapStateToProps = state => ({
  invoicesCount: state.invoicesCount
});

export const NewInvoice = connect(mapStateToProps,
  { getInvoiceCount })(NewInvoiceComp);